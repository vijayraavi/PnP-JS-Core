"use strict";
import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

export class Items extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    constructor(url: string | Queryable) {
        super(url, "items");
    }

    public getById(id: number): Item {
        this.concat(`(${id})`);
        return this;
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): Items { return; }

    // filterable stub for mixin
    public filter(filter: string): Items { return; }
}

Util.applyMixins(Items, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);

export class Item extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): Item { return; }
}

Util.applyMixins(Item, Mixins.Gettable, Mixins.Selectable);
