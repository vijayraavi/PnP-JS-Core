"use strict";

import { Queryable } from "./queryable";
import { HttpClient } from "../../net/httpClient";

export class Selectable extends Queryable {
    public select(...selects: string[]): any {
        this._query.add("$select", selects.join(","));
        return this;
    }
}

export class Filterable extends Queryable {
    public filter(filter: string): any {
        this._query.add("$filter", filter);
        return this;
    }
}

export class Gettable extends Queryable {
    public get(): Promise<any> {
        let client = new HttpClient();
        return client.get(this.toUrlAndQuery()).then(function(response) {

            if (response.status !== 200) {
                throw "Error making GET request: " + response.statusText;
            }

            return response.json();

        }).then(function(json) {
            return json.hasOwnProperty("d") ? json.d.hasOwnProperty("results") ? json.d.results : json.d : json;
        });
    }
}
