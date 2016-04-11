"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

/**
 * Describes the quick launch navigation
 * 
 */
export class QuickLaunch extends Queryable implements Mixins.Gettable {

    /**
     * Creates a new instance of the Lists class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "QuickLaunch");
    }

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<any> { return; }
}
Util.applyMixins(QuickLaunch, Mixins.Gettable);
