import { ODataParser, ODataBatch } from "./odata";
import { ICachingOptions, CachingParserWrapper, CachingOptions } from "./caching";
import { FetchOptions, HttpClient } from "../net/httpclient";
import { Logger, LogLevel } from "../utils/logging";
import { Util } from "../utils/util";

/**
 * Defines the context for a given request to be processed in the pipeline
 */
export interface RequestContext<T> {
    batch: ODataBatch;
    batchDependency: () => void;
    cachingOptions: ICachingOptions;
    isBatched: boolean;
    isCached: boolean;
    requestAbsoluteUrl: string;
    verb: string;
    options: FetchOptions;
    parser: ODataParser<T>;
    hasResult?: boolean;
    result?: T;
    requestId: string;
}

/**
 * Processes a given context through the request pipeline
 * 
 * @param context The request context we are processing
 */
export function pipe<T>(context: RequestContext<T>): Promise<T> {

    // this is the beginning of the extensible pipeline in future versions
    let pipeline: Array<(c: void | RequestContext<T>) => Promise<RequestContext<T>>> = [
        PipelineMethods.logStart,
        PipelineMethods.caching,
        PipelineMethods.send,
        PipelineMethods.logEnd,
    ];

    return pipeline.reduce((chain, next) => chain.then(c => next(c)), Promise.resolve(context))
        .then(ctx => PipelineMethods.returnResult(ctx))
        .catch((e: Error) => {
            Logger.log({
                data: e,
                level: LogLevel.Error,
                message: `Error in request pipeline: ${e.message}`,
            });
            throw e;
        });
}

/**
 * decorator factory applied to methods in the pipeline to control behavior
 */
function requestPipelineMethod(alwaysRun = false) {

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        let method = descriptor.value;

        descriptor.value = function(...args: any[]) {

            // if we have a result already in the pipeline, pass it along and don't call the tagged method
            if (!alwaysRun && args.length > 0 && args[0].hasOwnProperty("hasResult") && args[0].hasResult) {
                Logger.write(`[${args[0].requestId}] (${(new Date()).getTime()}) Skipping request pipeline method ${propertyKey}, existing result in pipeline.`, LogLevel.Verbose);
                return Promise.resolve(args[0]);
            }

            // apply the tagged method
            Logger.write(`[${args[0].requestId}] (${(new Date()).getTime()}) Calling request pipeline method ${propertyKey}.`, LogLevel.Verbose);
            return method.apply(target, args);
        };
    };
}

/**
 * Contains the methods used within the request pipeline
 */
class PipelineMethods {

    /**
     * Logs the start of the request
     */
    @requestPipelineMethod(true)
    public static logStart<T>(context: RequestContext<T>): Promise<RequestContext<T>> {

        return new Promise<RequestContext<T>>(resolve => {

            Logger.log({
                data: Logger.activeLogLevel === LogLevel.Info ? {} : context,
                level: LogLevel.Info,
                message: `[${context.requestId}] (${(new Date()).getTime()}) Beginning ${context.verb} request to ${context.requestAbsoluteUrl}`,
            });

            resolve(context);
        });
    }

    /**
     * Handles caching of the request
     */
    @requestPipelineMethod()
    public static caching<T>(context: RequestContext<T>): Promise<RequestContext<T>> {

        return new Promise<RequestContext<T>>(resolve => {

            // handle caching, if applicable
            if (context.verb === "GET" && context.isCached) {

                Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Caching is enabled for request, checking cache...`, LogLevel.Info);

                let cacheOptions = new CachingOptions(context.requestAbsoluteUrl.toLowerCase());
                if (typeof context.cachingOptions !== "undefined") {
                    cacheOptions = Util.extend(cacheOptions, context.cachingOptions);
                }

                // we may not have a valid store, i.e. on node
                if (cacheOptions.store !== null) {
                    // check if we have the data in cache and if so resolve the promise and return
                    let data = cacheOptions.store.get(cacheOptions.key);
                    if (data !== null) {
                        // ensure we clear any help batch dependency we are resolving from the cache
                        Logger.log({
                            data: Logger.activeLogLevel === LogLevel.Info ? {} : data,
                            level: LogLevel.Info,
                            message: `[${context.requestId}] (${(new Date()).getTime()}) Value returned from cache.`,
                        });
                        context.batchDependency();
                        return PipelineMethods.setResult(context, data).then(ctx => resolve(ctx));
                    }
                }

                Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Value not found in cache.`, LogLevel.Info);

                // if we don't then wrap the supplied parser in the caching parser wrapper
                // and send things on their way
                context.parser = new CachingParserWrapper(context.parser, cacheOptions);
            }

            return resolve(context);
        });
    }

    /**
     * Sends the request
     */
    @requestPipelineMethod()
    public static send<T>(context: RequestContext<T>): Promise<RequestContext<T>> {

        return new Promise<RequestContext<T>>((resolve, reject) => {
            // send or batch the request
            if (context.isBatched) {

                // we are in a batch, so add to batch, remove dependency, and resolve with the batch's promise
                let p = context.batch.add(context.requestAbsoluteUrl, context.verb, context.options, context.parser);

                // we release the dependency here to ensure the batch does not execute until the request is added to the batch
                context.batchDependency();

                Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Batching request.`, LogLevel.Info);
                resolve(p.then(result => PipelineMethods.setResult(context, result)));
            } else {

                Logger.write(`[${context.requestId}] (${(new Date()).getTime()}) Sending request.`, LogLevel.Info);

                // we are not part of a batch, so proceed as normal
                let client = new HttpClient();
                let opts = Util.extend(context.options, { method: context.verb });
                client.fetch(context.requestAbsoluteUrl, opts)
                    .then(response => context.parser.parse(response))
                    .then(result => PipelineMethods.setResult(context, result))
                    .then(ctx => resolve(ctx))
                    .catch(e => reject(e));
            }
        });
    }

    /**
     * Logs the end of the request
     */
    @requestPipelineMethod(true)
    public static logEnd<T>(context: RequestContext<T>): Promise<RequestContext<T>> {

        return new Promise<RequestContext<T>>(resolve => {

            Logger.log({
                data: Logger.activeLogLevel === LogLevel.Info ? {} : context,
                level: LogLevel.Info,
                message: `[${context.requestId}] (${(new Date()).getTime()}) Completing ${context.verb} request to ${context.requestAbsoluteUrl}`,
            });

            resolve(context);
        });
    }

    /**
     * At the end of the pipeline resolves the request's result 
     */
    @requestPipelineMethod(true)
    public static returnResult<T>(context: RequestContext<T>): Promise<T> {

        Logger.log({
            data: context.result,
            level: LogLevel.Verbose,
            message: `[${context.requestId}] (${(new Date()).getTime()}) Returning, see data property for value.`,
        });

        return Promise.resolve(context.result);
    }

    /**
     * Sets the result on the context
     */
    private static setResult<T>(context: RequestContext<T>, value: any): Promise<RequestContext<T>> {

        return new Promise<RequestContext<T>>((resolve) => {

            context.result = value;
            context.hasResult = true;
            resolve(context);
        });
    }
}
