"use strict";

/// <reference path="..\..\..\typings\main.d.ts" />

import { Queryable } from "../../Queryable";
import { Items } from "./Items/Items";
import { Views } from "./Views/Views";
import { ContentTypes } from "./ContentTypes/ContentTypes";

export class Lists extends Queryable {
    constructor(url: Array<string>) {
        super(url, "/lists");
    }

    public getByTitle(title: string) {
        this._url.push(`/getByTitle('${title}')`);
        return jQuery.extend(this, {
            contenttypes: new ContentTypes(this._url),
            items: new Items(this._url),
            views: new Views(this._url),
        });
    }

    public getById(id: string) {
        this._url.push(`('${id}')`);
        return jQuery.extend(this, {
            contenttypes: new ContentTypes(this._url),
            items: new Items(this._url),
            views: new Views(this._url),
        });
    }
}
