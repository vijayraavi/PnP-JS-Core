"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

/**
 * Describes a collection of site users
 * 
 */
export class SiteUsers extends Queryable implements Mixins.Gettable, Mixins.Filterable, Mixins.Selectable {

    /**
     * Creates a new instance of the SiteUsers class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "SiteUsers");
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
    public filter(filter: string): SiteUsers { return; }

    /**
     * Select the fields to return
     * 
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): SiteUsers { return; }
}
Util.applyMixins(SiteUsers, Mixins.Gettable, Mixins.Filterable, Mixins.Selectable);
