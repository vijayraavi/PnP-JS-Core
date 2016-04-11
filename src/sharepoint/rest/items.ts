"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";
import { Gettable, SelectableGettable, FilterableSelectableGettable } from "./actionables";
import { Folder } from "./folders";
import { ContentType } from "./contenttypes";
import { RoleAssignments } from "./roleassignments";

/**
 * Describes a collection of Item objects
 * 
 */
export class Items extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    /**
     * Creates a new instance of the Items class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "items");
    }

    /**
     * Gets an Item by id
     * 
     * @param id The integer id of the item to retrieve
     */
    public getById(id: number): Item {
        this.concat(`(${id})`);
        return new Item(this);
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
    public select(...selects: string[]): Items { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): Items { return; }
}
Util.applyMixins(Items, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);


/**
 * Descrines a single Item instance
 * 
 */
export class Item extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the Items class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }

    /**
     * Gets the set of attachments for this item
     * 
     */
    public get attachmentFiles(): FilterableSelectableGettable<any> {
        this.append("AttachmentFiles");
        return new FilterableSelectableGettable<any>(this);
    }

    /**
     * Gets the content type for this item
     * 
     */
    public get contentType(): ContentType {
        this.append("ContentType");
        return new ContentType(this);
    }

    /**
     * Gets the effective base permissions for the item
     * 
     */
    public get effectiveBasePermissions(): Gettable<any> {
        this.append("EffectiveBasePermissions");
        return new Gettable<any>(this);
    }

    /**
     * Gets the effective base permissions for the item in a UI context
     * 
     */
    public get effectiveBasePermissionsForUI(): Gettable<any> {
        this.append("EffectiveBasePermissionsForUI");
        return new Gettable<any>(this);
    }

    /**
     * Gets the field values for this list item in their HTML representation
     * 
     */
    public get fieldValuesAsHTML(): SelectableGettable<any> {
        this.append("FieldValuesAsHTML");
        return new SelectableGettable<any>(this);
    }

    /**
     * Gets the field values for this list item in their text representation
     * 
     */
    public get fieldValuesAsText(): SelectableGettable<any> {
        this.append("FieldValuesAsText");
        return new SelectableGettable<any>(this);
    }

    /**
     * Gets the field values for this list item for use in editing controls
     * 
     */
    public get fieldValuesForEdit(): SelectableGettable<any> {
        this.append("FieldValuesForEdit");
        return new SelectableGettable<any>(this);
    }

    /**
     * Gets the closest securable up the security hierarchy whose permissions are applied to this list item
     * 
     */
    public get firstUniqueAncestorSecurableObject(): SelectableGettable<any> {
        this.append("FirstUniqueAncestorSecurableObject");
        return new SelectableGettable<any>(this);
    }

    /**
     * Gets the folder associated with this list item (if this item represents a folder)
     * 
     */
    public get folder(): Folder {
        return new Folder(this, "Folder");
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
     * Gets the set of role assignments for this item
     * 
     */
    public get roleAssignments(): RoleAssignments {
        return new RoleAssignments(this);
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
    public select(...selects: string[]): Item { return; }
}
Util.applyMixins(Item, Mixins.Gettable, Mixins.Selectable);
