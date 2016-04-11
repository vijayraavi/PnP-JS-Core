"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";
import { Gettable } from "./actionables";

/**
 * Describes a collection of File objects
 * 
 */
export class Files extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    /**
     * Creates a new instance of the Files class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "files");
    }

    /**
     * Gets a File by filename
     * 
     * @param name The name of the file, including extension
     */
    public getByName(name: string): File {
        this.concat(`('${name}')`);
        return new File(this);
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
    public select(...selects: string[]): Files { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): Files { return; }
}
Util.applyMixins(Files, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);


/**
 * Describes a single File instance
 * 
 */
export class File extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the File class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Gets the contents of the file - If the file is not JSON a custom parser function should be used with the get call
     * 
     */
    public get value(): Gettable<any> {
        this.append("$value");
        return new Gettable<any>(this);
    }

    /**
     * Gets a result indicating the current user who has a file checked out
     * 
     */
    public get checkedOutByUser(): Gettable<any> {
        this.append("CheckedOutByUser");
        return new Gettable<any>(this);
    }

    /**
     * Gets the current eTag of a file
     * 
     */
    public get eTag(): Gettable<any> {
        this.append("ETag");
        return new Gettable<any>(this);
    }

    /**
     * Gets the server relative url of a file
     * 
     */
    public get serverRelativeUrl(): Gettable<any> {
        this.append("ServerRelativeUrl");
        return new Gettable<any>(this);
    }

    /**
     * Gets a collection of versions
     * 
     */
    public get versions(): Versions {
        return new Versions(this);
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
    public select(...selects: string[]): File { return; }
}
Util.applyMixins(File, Mixins.Gettable, Mixins.Selectable);


/**
 * Describes a collection of Version objects
 * 
 */
export class Versions extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    /**
     * Creates a new instance of the File class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable) {
        super(baseUrl, "versions");
    }

    /**
     * Gets a version by id
     * 
     * @param versionId The id of the version to retrieve
     */
    public getById(versionId: number): Version {
        this.concat(`(${versionId})`);
        return new Version(this);
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
    public select(...selects: string[]): Versions { return; }

    /**
     * Applies a filter to the request
     * 
     * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
     */
    public filter(filter: string): Versions { return; }

}
Util.applyMixins(Versions, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);


/**
 * Describes a single Version instance
 * 
 */
export class Version extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    /**
     * Creates a new instance of the Version class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
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
    public select(...selects: string[]): Version { return; }
}
Util.applyMixins(Version, Mixins.Gettable, Mixins.Selectable);
