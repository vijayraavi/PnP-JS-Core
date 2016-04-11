"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";
import { Files } from "./files";
import { Gettable, SelectableGettable } from "./actionables";

/**
 * Describes a collection of Folder objects
 * 
 */
export class Folders extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    /**
     * Creates a new instance of the Folders class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "folders");
    }

    /**
     * Gets a folder by folder name
     * 
     */
    public getByName(name: string): Folder {
        this.concat(`('${name}')`);
        return new Folder(this);
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
    public select(...selects: string[]): Folders { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): Folders { return; }
}
Util.applyMixins(Folders, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);

/**
 * Describes a single Folder instance
 * 
 */
export class Folder extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the Folder class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Gets the parent folder, if available
     * 
     */
    public get parentFolder() {
        return new Folder(this, "ParentFolder");
    }

    /**
     * Gets this folder's sub folders
     * 
     */
    public get folders(): Folders {
        return new Folders(this);
    }

    /**
     * Gets the folders name
     * 
     */
    public get name(): Gettable<any> {
        this.append("Name");
        return new Gettable<any>(this);
    }

    /**
     * Gets this folder's properties
     * 
     */
    public get properties(): SelectableGettable<any> {
        this.append("Properties");
        return new SelectableGettable<any>(this);
    }

    /**
     * Gets this folder's server relative url
     * 
     */
    public get serverRelativeUrl(): Gettable<any> {
        this.append("ServerRelativeUrl");
        return new Gettable<any>(this);
    }

    /**
     * Gets this folder's files
     * 
     */
    public get files(): Files {
        return new Files(this);
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
    public select(...selects: string[]): Folder { return; }
}
Util.applyMixins(Folder, Mixins.Gettable, Mixins.Selectable);
