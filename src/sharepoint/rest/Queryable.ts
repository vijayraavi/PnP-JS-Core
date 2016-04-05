"use strict";

import * as Util from "../../utils/util";
import { Dictionary } from "../../collections/collections";

/**
 * Queryable Base Class
 * 
 */
export class Queryable {

    /**
     * Creates a new instance of the Queryable class
     * 
     * @constructor
     * @param baseUrl A string or Queryable that should form the base part of the url
     * 
     */
    constructor(baseUrl: string | Queryable, path?: string) {

        if (typeof baseUrl === "string") {
            let s = baseUrl as string;
            this._url = Util.combinePaths(s, path);
        } else {
            let q = baseUrl as Queryable;
            this._url = Util.combinePaths(q._url, path);
        }

        this._query = new Dictionary<string>();
    }

    /**
     * Tracks the query parts of the url
     */
    protected _query: Dictionary<string>;

    /**
     * Tracks the url as it is built 
     */
    private _url: string;

    /**
     * Directly concatonates the supplied string to the current url, not normalizing "/" chars
     * 
     * @param pathPart The string to concatonate to the url
     */
    protected concat(pathPart: string) {
        this._url += pathPart;
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
     * Gets the currentl url, made server relative or absolute based on the availability of the _spPageContextInfo object
     * 
     */
    public toUrl(): string {

        if (typeof _spPageContextInfo !== "undefined") {
            if (_spPageContextInfo.hasOwnProperty("webAbsoluteUrl")) {
                return Util.combinePaths(_spPageContextInfo.webAbsoluteUrl, this._url);
            } else if (_spPageContextInfo.hasOwnProperty("webServerRelativeUrl")) {
                return Util.combinePaths(_spPageContextInfo.webServerRelativeUrl, this._url);
            }
        }

        return this._url;
    }

    /**
     * Gets the full url with query information
     * 
     */
    public toUrlAndQuery(): string {
        let url = this.toUrl();
        if (this._query.count() > 0) {
            url += "?";
            let keys = this._query.getKeys();
            let query = keys.map((key, ix, arr) => `${key}=${this._query.get(key)}`);
            url += query.join("&");
        }
        return url;
    }
}
