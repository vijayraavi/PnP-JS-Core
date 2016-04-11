"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";
import { Web } from "./webs";

/**
 * Describes a site collection
 * 
 */
export class Site extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the RoleAssignments class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string) {
        super(baseUrl, "site");
    }

    /**
     * Gets the root web of the site collection
     * 
     */
    public get rootWeb(): Web {
        return new Web(this, "rootweb");
    }

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<any> { return; }

    /**
     * Select the fields to return
     * 
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): Site { return; }
}
Util.applyMixins(Site, Mixins.Gettable, Mixins.Selectable);
