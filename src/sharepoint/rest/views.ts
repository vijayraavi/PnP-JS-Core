"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

/**
 * Describes the views available in the current context
 * 
 */
export class Views extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    /**
     * Creates a new instance of the Views class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "views");
    }

    /**
     * Gets a view by guid id
     * 
     * @param id The GUID id of the view
     */
    public getById(id: string): View {
        this.concat(`(guid'${id}')`);
        return new View(this);
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
    public select(...selects: string[]): Views { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): Views { return; }
}
Util.applyMixins(Views, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);


/**
 * Describes a single View instance
 * 
 */
export class View extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the View class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
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
    public select(...selects: string[]): View { return; }
}
Util.applyMixins(View, Mixins.Gettable, Mixins.Selectable);
