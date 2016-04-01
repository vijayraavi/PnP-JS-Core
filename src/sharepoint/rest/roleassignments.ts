"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

export class RoleAssignments extends Queryable implements Mixins.Gettable, Mixins.Filterable, Mixins.Selectable {

    constructor(url: string | Queryable) {
        super(url, "RoleAssignments");
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // filterable stub for mixin
    public filter(filter: string): RoleAssignments { return; }

    // selectable stub for mixin
    public select(...selects: string[]): RoleAssignments { return; }
}

Util.applyMixins(RoleAssignments, Mixins.Gettable, Mixins.Filterable, Mixins.Selectable);
