import { Util } from "../utils/util";
import { Dictionary } from "../collections/collections";
import { GraphHttpClient } from "../net/graphclient";
import { FetchOptions } from "../net/utils";
import { ODataParser } from "../odata/core";
import { ODataDefaultParser } from "../odata/parsers";
// import { RuntimeConfig } from "../configuration/pnplibconfig";
import { Logger, LogLevel } from "../utils/logging";

export interface GraphQueryableConstructor<T> {
    new(baseUrl: string | GraphQueryable, path?: string): T;
}

/**
 * Queryable Base Class
 *
 */
export class GraphQueryable {

    /**
     * Tracks the query parts of the url
     */
    protected _query: Dictionary<string>;

    /**
     * Tracks the url as it is built
     */
    private _url: string;

    /**
     * Stores the parent url used to create this instance, for recursing back up the tree if needed
     */
    private _parentUrl: string;

    /**
     * Directly concatonates the supplied string to the current url, not normalizing "/" chars
     *
     * @param pathPart The string to concatonate to the url
     */
    public concat(pathPart: string): this {
        this._url += pathPart;
        return this;
    }

    /**
     * Appends the given string and normalizes "/" chars
     *
     * @param pathPart The string to append
     */
    protected append(pathPart: string) {
        this._url = Util.combinePaths(this._url, pathPart);
    }

    /**
     * Gets the parent url used when creating this instance
     *
     */
    protected get parentUrl(): string {
        return this._parentUrl;
    }

    /**
     * Provides access to the query builder for this url
     *
     */
    public get query(): Dictionary<string> {
        return this._query;
    }

    /**
     * Creates a new instance of the Queryable class
     *
     * @constructor
     * @param baseUrl A string or Queryable that should form the base part of the url
     *
     */
    constructor(baseUrl: string | GraphQueryable, path?: string) {

        this._query = new Dictionary<string>();

        if (typeof baseUrl === "string") {

            const urlStr = baseUrl as string;
            this._parentUrl = urlStr;
            this._url = Util.combinePaths(urlStr, path);
        } else {

            const q = baseUrl as GraphQueryable;
            this._parentUrl = q._url;
            this._url = Util.combinePaths(this._parentUrl, path);
        }
    }

    /**
     * Creates a new instance of the supplied factory and extends this into that new instance
     *
     * @param factory constructor for the new queryable
     */
    public as<T>(factory: GraphQueryableConstructor<T>): T {
        const o = <T>new factory(this._url, null);
        return Util.extend(o, this, true);
    }

    /**
     * Gets the currentl url, made absolute based on the availability of the _spPageContextInfo object
     *
     */
    public toUrl(): string {
        return this._url;
    }

    /**
     * Gets the full url with query information
     *
     */
    public toUrlAndQuery(): string {

        const aliasedParams = new Dictionary<string>();

        let url = this.toUrl().replace(/'!(@.*?)::(.*?)'/ig, (match, labelName, value) => {
            Logger.write(`Rewriting aliased parameter from match ${match} to label: ${labelName} value: ${value}`, LogLevel.Verbose);
            aliasedParams.add(labelName, `'${value}'`);
            return labelName;
        });

        // inlude our explicitly set query string params
        aliasedParams.merge(this._query);

        if (aliasedParams.count() > 0) {
            url += `?${aliasedParams.getKeys().map(key => `${key}=${aliasedParams.get(key)}`).join("&")}`;
        }

        return url;
    }

    /**
     * Gets a parent for this instance as specified
     *
     * @param factory The contructor for the class to create
     */
    protected getParent<T extends GraphQueryable>(
        factory: GraphQueryableConstructor<T>,
        baseUrl: string | GraphQueryable = this.parentUrl,
        path?: string): T {

        return new factory(baseUrl, path);
    }

    /**
     * Clones this queryable into a new queryable instance of T
     * @param factory Constructor used to create the new instance
     * @param additionalPath Any additional path to include in the clone
     * @param includeBatch If true this instance's batch will be added to the cloned instance
     */
    protected clone<T extends GraphQueryable>(factory: GraphQueryableConstructor<T>, additionalPath?: string): T {
        return new factory(this, additionalPath);
    }

    /**
     * Executes the currently built request
     *
     * @param options The options used for this request
     */
    public get(parser: ODataParser<any> = new ODataDefaultParser(), options: FetchOptions = {}): Promise<any> {

        const opts = Util.extend(options, { method: "GET" });
        const client = new GraphHttpClient();
        return client.fetch(this.toUrlAndQuery(), opts).then(r => parser.parse(r));

        // return this.toRequestContext("GET", getOptions, parser).then(context => pipe(context));
    }

    /**
     * Executes the currently built request
     *
     * @param options The options used for this request
     */
    protected post(options: FetchOptions = {}, parser: ODataParser<any> = new ODataDefaultParser()): Promise<any> {

        const opts = Util.extend(options, { method: "POST" });
        const client = new GraphHttpClient();
        return client.fetch(this.toUrlAndQuery(), opts).then(r => parser.parse(r));

        // return this.toRequestContext("POST", getOptions, parser).then(context => pipe(context));
    }

    /**
     * Executes the currently built request
     *
     * @param options The options used for this request
     */
    protected patch(options: FetchOptions = {}, parser: ODataParser<any> = new ODataDefaultParser()): Promise<any> {

        const opts = Util.extend(options, { method: "PATCH" });
        const client = new GraphHttpClient();
        return client.fetch(this.toUrlAndQuery(), opts).then(r => parser.parse(r));

        // return this.toRequestContext("POST", getOptions, parser).then(context => pipe(context));
    }

    /**
     * Executes the currently built request
     *
     * @param options The options used for this request
     */
    protected delete(options: FetchOptions = {}, parser: ODataParser<any> = new ODataDefaultParser()): Promise<any> {

        const opts = Util.extend(options, { method: "DELETE" });
        const client = new GraphHttpClient();
        return client.fetch(this.toUrlAndQuery(), opts).then(r => parser.parse(r));

        // return this.toRequestContext("POST", getOptions, parser).then(context => pipe(context));
    }


    // /**
    //  * Converts the current instance to a request context
    //  *
    //  * @param verb The request verb
    //  * @param options The set of supplied request options
    //  * @param parser The supplied ODataParser instance
    //  * @param pipeline Optional request processing pipeline
    //  */
    // private toRequestContext<T>(
    //     verb: string,
    //     options: FetchOptions = {},
    //     parser: ODataParser<T>,
    //     pipeline: Array<(c: RequestContext<T>) => Promise<RequestContext<T>>> = PipelineMethods.default): Promise<RequestContext<T>> {

    //     const dependencyDispose = this.hasBatch ? this.addBatchDependency() : () => { return; };

    //     return Util.toAbsoluteUrl(this.toUrlAndQuery()).then(url => {

    //         // build our request context
    //         const context: RequestContext<T> = {
    //             options: options,
    //             parser: parser,
    //             pipeline: pipeline,
    //             requestAbsoluteUrl: url,
    //             requestId: Util.getGUID(),
    //             verb: verb,
    //         };

    //         return context;
    //     });
    // }
}

/**
 * Represents a REST collection which can be filtered, paged, and selected
 *
 */
export class GraphQueryableCollection extends GraphQueryable {

    /**
     * Filters the returned collection (https://msdn.microsoft.com/en-us/library/office/fp142385.aspx#bk_supported)
     *
     * @param filter The string representing the filter query
     */
    public filter(filter: string): this {
        this._query.add("$filter", filter);
        return this;
    }

    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): this {
        if (selects.length > 0) {
            this._query.add("$select", selects.join(","));
        }
        return this;
    }

    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    public expand(...expands: string[]): this {
        if (expands.length > 0) {
            this._query.add("$expand", expands.join(","));
        }
        return this;
    }

    /**
     * Orders based on the supplied fields ascending
     *
     * @param orderby The name of the field to sort on
     * @param ascending If false DESC is appended, otherwise ASC (default)
     */
    public orderBy(orderBy: string, ascending = true): this {
        const keys = this._query.getKeys();
        const query: string[] = [];
        const asc = ascending ? " asc" : " desc";
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === "$orderby") {
                query.push(this._query.get("$orderby"));
                break;
            }
        }
        query.push(`${orderBy}${asc}`);

        this._query.add("$orderby", query.join(","));

        return this;
    }

    /**
     * Limits the query to only return the specified number of items
     *
     * @param top The query row limit
     */
    public top(top: number): this {
        this._query.add("$top", top.toString());
        return this;
    }

    /**
     * Skips a set number of items in the return set
     *
     * @param num Number of items to skip
     */
    public skip(num: number): this {
        this._query.add("$top", num.toString());
        return this;
    }

    /**
     * 	To request second and subsequent pages of Graph data
     */
    public skipToken(token: string): this {
        this._query.add("$skiptoken", token);
        return this;
    }

    /**
     * 	Retrieves the total count of matching resources
     */
    public get count(): this {
        this._query.add("$count", "true");
        return this;
    }
}

export class GraphQueryableSearchableCollection extends GraphQueryableCollection {

    /**
     * 	To request second and subsequent pages of Graph data
     */
    public search(query: string): this {
        this._query.add("$search", query);
        return this;
    }
}

/**
 * Represents an instance that can be selected
 *
 */
export class GraphQueryableInstance extends GraphQueryable {

    /**
     * Choose which fields to return
     *
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): this {
        if (selects.length > 0) {
            this._query.add("$select", selects.join(","));
        }
        return this;
    }

    /**
     * Expands fields such as lookups to get additional data
     *
     * @param expands The Fields for which to expand the values
     */
    public expand(...expands: string[]): this {
        if (expands.length > 0) {
            this._query.add("$expand", expands.join(","));
        }
        return this;
    }
}
