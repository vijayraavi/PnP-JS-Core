"use strict";

import { Queryable } from "./queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

/**
 * Describes a collection of Field objects
 * 
 */
export class Fields extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    /**
     * Creates a new instance of the Fields class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "fields");
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
    public select(...selects: string[]): Fields { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): Fields { return; }
}
Util.applyMixins(Fields, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);

/**
 * Describes a single of Field instance
 * 
 */
export class Field extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the Field class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this field instance
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
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
    public select(...selects: string[]): Field { return; }
}
Util.applyMixins(Field, Mixins.Gettable, Mixins.Selectable);
