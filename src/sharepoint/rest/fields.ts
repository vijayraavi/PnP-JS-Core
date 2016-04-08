"use strict";

import { Queryable } from "./queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

export class Fields extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "fields");
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): Fields { return; }

    // filterable stub for mixin
    public filter(filter: string): Fields { return; }
}

Util.applyMixins(Fields, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);

export class Field extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): Field { return; }
}

Util.applyMixins(Field, Mixins.Gettable, Mixins.Selectable);
