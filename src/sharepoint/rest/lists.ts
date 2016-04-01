"use strict";

import { Items } from "./items";
import { Views } from "./views";
import { ContentTypes } from "./contenttypes";
import { Queryable } from "./queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

export class Lists extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "lists");
    }

    public getByTitle(title: string): List {
        this.append(`getByTitle('${title}')`);
        return new List(this);
    }

    public getById(id: string): List {
        this.concat(`('${id}')`);
        return new List(this);
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): Lists { return; }

    // filterable stub for mixin
    public filter(filter: string): Lists { return; }
}

Util.applyMixins(Lists, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);

export class List extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    constructor(baseUrl: string | Queryable) {
        super(baseUrl);

        this.contentTypes = new ContentTypes(this);
        this.items = new Items(this);
        this.views = new Views(this);
    }

    public contentTypes: ContentTypes;
    public items: Items;
    public views: Views;

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): List { return; }
}

Util.applyMixins(List, Mixins.Gettable, Mixins.Selectable);
