"use strict";

import { Items } from "./items";
import { Views, View } from "./views";
import { ContentTypes } from "./contenttypes";
import { Fields } from "./fields";
import { Queryable } from "./queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";
import { Gettable, FilterableSelectableGettable } from "./actionables";
import { ITypedHash } from "../../collections/collections";

/**
 * Describes a collection of List objects
 * 
 */
export class Lists extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable, Mixins.Postable {

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
     * Adds a new list to the collection
     * 
     * @param title The new list's title
     * @param description The new list's description
     * @param template The list template value
     * @param enableContentTypes If true content types will be allowed and enabled, otherwise they will be disallowed and not enabled
     * @param additionalSettings Will be passed as part of the list creation body
     */
    /*tslint:disable max-line-length */
    public add(title: string, description = "", template = 100, enableContentTypes = false, additionalSettings: ITypedHash<string> = {}): Promise<ListAddResult> {

        let postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.List" },
            "AllowContentTypes": true,
            "BaseTemplate": template,
            "ContentTypesEnabled": enableContentTypes,
            "Description": description,
            "Title": title,
        }, additionalSettings));

        return this.post({ body: postBody }).then((data) => {
            return {
                list: this.getByTitle(title),
                data: data
            };
        });
    }
    /*tslint:enable */

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<any> { return; }

    /**
     * Execute the post request
     * 
     */
    public post(postOptions: any = {}, parser: (r: Response) => Promise<any> = (r) => r.json()): Promise<any> { return; }

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
Util.applyMixins(Lists, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable, Mixins.Postable);


/**
 * Describes a single List instance
 * 
 */
export class List extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Postable {

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
     * Updates this list intance with the supplied properties 
     * 
     * 
     */
    public update(properties: ITypedHash<string>): Promise<ListUpdateResult> {

        let postBody = JSON.stringify(Util.extend({
            "__metadata": { "type": "SP.List" },
        }, properties));

        return this.post({
            body: postBody,
            headers: {
                "IF-Match": "*",
                "X-HTTP-Method": "MERGE",
            },
        }).then((data) => {
            return {
                data: data,
                list: this,
            };
        });
    }

    /**
     * Execute the get request
     * 
     */
    public get(): Promise<any> { return; }

    /**
     * Execute the post request
     * 
     */
    public post(postOptions: any = {}, parser: (r: Response) => Promise<any> = (r) => r.json()): Promise<any> { return; }

    /**
     * Select the fields to return
     * 
     * @param selects One or more fields to return
     */
    public select(...selects: string[]): List { return; }
}
Util.applyMixins(List, Mixins.Gettable, Mixins.Selectable);

export interface ListAddResult {
    list: List;
    data: any;
}

export interface ListUpdateResult {
    list: List;
    data: any;
}
