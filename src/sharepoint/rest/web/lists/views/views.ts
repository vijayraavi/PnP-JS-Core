"use strict";
import { Queryable } from "../../../Queryable";

export class Views extends Queryable {
    constructor(url: Array<string>) {
        super(url, "/Views");
    }
    public getById(id: string) {
        this._url.push(`(guid'${id}')`);
        return this;
    }
}
