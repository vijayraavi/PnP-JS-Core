"use strict";

import { Queryable } from "./queryable";
import * as Mixins from "./mixins";
import * as Util from "../../utils/util";

/**
 * A Queryable which only exposes the get method
 * 
 */
export class Gettable<T> extends Queryable implements Mixins.Gettable {

    /**
     * Creates a new instance of the Gettable class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this actionable
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<T> { return; }
}
Util.applyMixins(Gettable, Mixins.Gettable);


/**
 * A Queryable which only exposes the get and select methods
 * 
 */
export class SelectableGettable<T> extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the SelectableGettable class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this actionable
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }

    /**
     * Select the fields to return
     * 
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): Gettable<T> { return; }

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<T> { return; }
}
Util.applyMixins(SelectableGettable, Mixins.Gettable, Mixins.Selectable);


/**
 * A Queryable which only exposes the get and filter methods
 * 
 */
export class FilterableGettable<T> extends Queryable implements Mixins.Gettable, Mixins.Filterable {

    /**
     * Creates a new instance of the FilterableGettable class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this actionable
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): Gettable<T> { return; }

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<T> { return; }
}
Util.applyMixins(FilterableGettable, Mixins.Gettable, Mixins.Filterable);


/**
 * A Queryable which only exposes the get, select and filter methods
 * 
 */
export class FilterableSelectableGettable<T> extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    /**
     * Creates a new instance of the FilterableSelectableGettable class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this actionable
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }

    /**
     * Select the fields to return
     * 
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): FilterableGettable<T> { return; }

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<T> { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): SelectableGettable<T> { return; }
}
Util.applyMixins(FilterableSelectableGettable, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
