"use strict";

import { Queryable } from "./queryable";
import { HttpClient } from "../../net/httpClient";

/**
 * Implements the $select functionality on classes to which it is applied
 * 
 */
export class Selectable extends Queryable {
    public select(...selects: string[]): any {
        this._query.add("$select", selects.join(","));
        return this;
    }
}


/**
 * Implements the $filter functionality on classes to which it is applied
 * 
 */
export class Filterable extends Queryable {
    public filter(filter: string): any {
        this._query.add("$filter", filter);
        return this;
    }
}


/**
 * Implements the get http request on classes to which it is applied
 * 
 */
export class Gettable extends Queryable {
    public get(parser: (r: Response) => Promise<any> = (r) => r.json()): Promise<any> {
        let client = new HttpClient();
        return client.get(this.toUrlAndQuery()).then(function(response) {

            if (response.status !== 200) {
                throw "Error making GET request: " + response.statusText;
            }

            return parser(response);

        }).then(function(parsed) {
            return parsed.hasOwnProperty("d") ? parsed.d.hasOwnProperty("results") ? parsed.d.results : parsed.d : parsed;
        });
    }
}


/**
 * Implements the $top and $skip functionality on classes to which it is applied
 * 
 */
export class Pageable extends Queryable {
    public top(pageSize: number): any {
        this._query.add("$top", pageSize.toString());
        return this;
    }
    public skip(pageStart: number): any {
        this._query.add("$skip", pageStart.toString());
        return this;
    }
}

/**
 * Implements the post http request on classes to which it is applied
 * 
 */
export class Postable extends Queryable {

    public post(postOptions: any = {}, parser: (r: Response) => Promise<any> = (r) => r.json()): Promise<any> {

        let client = new HttpClient();

        return client.post(this.toUrlAndQuery(), postOptions).then(function(response) {

            // TODO, update these with all success codes
            if (response.status !== 201) {
                throw "Error making POST request: " + response.statusText;
            }

            return parser(response);

        }).then(function(parsed) {
            return parsed.hasOwnProperty("d") ? parsed.d.hasOwnProperty("results") ? parsed.d.results : parsed.d : parsed;
        });
    }
}
