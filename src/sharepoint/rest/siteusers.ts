"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

export class SiteUsers extends Queryable implements Mixins.Gettable, Mixins.Filterable, Mixins.Selectable {

    constructor(url: string | Queryable) {
        super(url, "SiteUsers");
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // filterable stub for mixin
    public filter(filter: string): SiteUsers { return; }

    // selectable stub for mixin
    public select(...selects: string[]): SiteUsers { return; }
}

Util.applyMixins(SiteUsers, Mixins.Gettable, Mixins.Filterable, Mixins.Selectable);
