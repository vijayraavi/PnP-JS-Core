"use strict";
import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

export class ContentTypes extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    constructor(url: string | Queryable) {
        super(url, "contentTypes");
    }

    public getById(id: string) {
        this.concat(`(\"${id}\")`);
        return this;
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): ContentTypes { return; }

    // filterable stub for mixin
    public filter(filter: string): ContentTypes { return; }
}

Util.applyMixins(ContentTypes, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);

export class ContentType extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): ContentType { return; }
}

Util.applyMixins(ContentType, Mixins.Gettable, Mixins.Selectable);
