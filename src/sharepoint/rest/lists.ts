"use strict";

import { Items } from "./items";
import { Views, View } from "./views";
import { ContentTypes } from "./contenttypes";
import { Fields } from "./fields";
import { Queryable } from "./queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";
import { Gettable, FilterableSelectableGettable } from "./actionables";

/**
 * Describes a collection of List objects
 * 
 */
export class Lists extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    /**
     * Creates a new instance of the Lists class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "lists");
    }

    /**
     * Gets a list from the collection by title
     * 
     * @param title The title of the list 
     */
    public getByTitle(title: string): List {
        return new List(this, `getByTitle('${title}')`);
    }

    /**
     * Gets a list from the collection by guid id
     * 
     * @param title The Id of the list  
     */
    public getById(id: string): List {
        this.concat(`(guid'${id}')`);
        return new List(this);
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
    public select(...selects: string[]): Lists { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): Lists { return; }
}
Util.applyMixins(Lists, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);


/**
 * Describes a single List instance
 * 
 */
export class List extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the Lists class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Gets the content types in this list
     * 
     */
    public get contentTypes(): ContentTypes {
        return new ContentTypes(this);
    }

    /**
     * Gets the items in this list
     * 
     */
    public get items(): Items {
        return new Items(this);
    }

    /**
     * Gets the views in this list
     * 
     */
    public get views(): Views {
        return new Views(this);
    }

    /**
     * Gets the fields in this list
     * 
     */
    public get fields(): Fields {
        return new Fields(this);
    }

    /**
     * Gets the default view of this list
     * 
     */
    public get defaultView(): Gettable<any> {
        this.append("DefaultView");
        return new Gettable<any>(this);
    }

    /**
     * Gets the effective base permissions of this list
     * 
     */
    public get effectiveBasePermissions(): Gettable<any> {
        this.append("EffectiveBasePermissions");
        return new Gettable<any>(this);
    }

    /**
     * Gets the event receivers attached to this list
     * 
     */
    public get eventReceivers(): FilterableSelectableGettable<any> {
        this.append("EventReceivers");
        return new FilterableSelectableGettable<any>(this);
    }

    /**
     * Gets the related fields of this list
     * 
     */
    public get getRelatedFields(): Gettable<any> {
        this.append("getRelatedFields");
        return new Gettable<any>(this);
    }

    /**
     * Gets the effective permissions for the user supplied
     * 
     * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
     */
    public getUserEffectivePermissions(loginName: string): Gettable<any> {
        this.append("getUserEffectivePermissions(@user)");
        this._query.add("@user", "'" + encodeURIComponent(loginName) + "'");
        return new Gettable<any>(this);
    }

    /**
     * Gets the IRM settings for this list
     * 
     */
    public get informationRightsManagementSettings(): Gettable<any> {
        this.append("InformationRightsManagementSettings");
        return new Gettable<any>(this);
    }

    /**
     * Gets the user custom actions attached to this list
     * 
     */
    public get userCustomActions(): Gettable<any> {
        this.append("UserCustomActions");
        return new Gettable<any>(this);
    }

    /**
     * Gets a view by view guid id
     * 
     */
    public getView(viewId: string): View {
        this.append(`getView('${viewId}')`);
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
    public select(...selects: string[]): List { return; }
}
Util.applyMixins(List, Mixins.Gettable, Mixins.Selectable);
