"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

/**
 * Describes a collection of content types
 * 
 */
export class ContentTypes extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    /**
     * Creates a new instance of the ContentTypes class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this content types collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "contentTypes");
    }

    /**
     * Gets a ContentType by content type id
     */
    public getById(id: string): ContentType {
        this.concat(`(\"${id}\")`);
        return new ContentType(this);
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
    public select(...selects: string[]): ContentTypes { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): ContentTypes { return; }
}
Util.applyMixins(ContentTypes, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);

/**
 * Describes a single ContentType instance
 * 
 */
export class ContentType extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the ContentType class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this content type instance
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
    public select(...selects: string[]): ContentType { return; }
}
Util.applyMixins(ContentType, Mixins.Gettable, Mixins.Selectable);
