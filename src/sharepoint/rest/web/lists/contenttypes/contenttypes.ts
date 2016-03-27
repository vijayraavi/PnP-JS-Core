"use strict";
import { Queryable } from "../../../Queryable";

export class ContentTypes extends Queryable {
    constructor(url: Array<string>) {
        super(url, "/ContentTypes");
    }
    public getById(id: string) {
        this._url.push(`(\"${id}\")`);
        return this;
    }
}
