import { Util } from "../utils/util";
import { RuntimeConfig } from "../configuration/pnplibconfig";
import { mergeHeaders, FetchOptions } from "./utils";
// import { APIUrlException } from "../utils/exceptions";

export class GraphHttpClient {

    private _impl: GraphHttpClientImpl;

    constructor() {

        // TODO:: this is weak and needs updated
        this._impl = RuntimeConfig.spfxContext.graphHttpClient;
    }

    public fetch(url: string, options: FetchOptions = {}): Promise<Response> {

        // until we are doing things like establishing the auth just pass this to the SPFx client to do the heavy lifting
        return this.fetchRaw(url, options);
    }

    public fetchRaw(url: string, options: FetchOptions = {}): Promise<Response> {

        // here we need to normalize the headers
        const rawHeaders = new Headers();
        mergeHeaders(rawHeaders, options.headers);
        options = Util.extend(options, { headers: rawHeaders });

        const retry = (ctx: RetryContext): void => {

            this._impl.fetch(url, {}, options).then((response) => ctx.resolve(response)).catch((response) => {

                // Check if request was throttled - http status code 429
                // Check if request failed due to server unavailable - http status code 503
                if (response.status !== 429 && response.status !== 503) {
                    ctx.reject(response);
                }

                // grab our current delay
                const delay = ctx.delay;

                // Increment our counters.
                ctx.delay *= 2;
                ctx.attempts++;

                // If we have exceeded the retry count, reject.
                if (ctx.retryCount <= ctx.attempts) {
                    ctx.reject(response);
                }

                // Set our retry timeout for {delay} milliseconds.
                setTimeout(Util.getCtxCallback(this, retry, ctx), delay);
            });
        };

        return new Promise((resolve, reject) => {

            const retryContext: RetryContext = {
                attempts: 0,
                delay: 100,
                reject: reject,
                resolve: resolve,
                retryCount: 7,
            };

            retry.call(this, retryContext);
        });
    }
}

interface RetryContext {
    attempts: number;
    delay: number;
    reject: (reason?: any) => void;
    resolve: (value?: {} | PromiseLike<{}>) => void;
    retryCount: number;
}

export interface GraphHttpClientImpl {
    fetch(url: string, configuration: any, options: FetchOptions): Promise<Response>;
}
