"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

/**
 * Describes the top navigation on the site
 * 
 */
export class TopNavigationBar extends Queryable implements Mixins.Gettable {

    /**
     * Creates a new instance of the SiteUsers class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "TopNavigationBar");
    }

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<any> { return; }
}
Util.applyMixins(TopNavigationBar, Mixins.Gettable);
