"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

/**
 * Describes a set of role assignments for the current scope
 * 
 */
export class RoleAssignments extends Queryable implements Mixins.Gettable, Mixins.Filterable, Mixins.Selectable {

    /**
     * Creates a new instance of the RoleAssignments class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "RoleAssignments");
    }

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<any> { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): RoleAssignments { return; }

    /**
     * Select the fields to return
     * 
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): RoleAssignments { return; }
}
Util.applyMixins(RoleAssignments, Mixins.Gettable, Mixins.Filterable, Mixins.Selectable);
