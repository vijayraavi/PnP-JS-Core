"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./Queryable";
import { Item } from "./items";

/**
 * Describes a collection of File objects
 * 
 */
export class Files extends QueryableCollection {

    //
    // TODO:
    //      Methods (https://msdn.microsoft.com/en-us/library/office/dn450841.aspx#bk_FileCollectionMethods)
    //          Add
    //          AddTemplateFile
    //          GetByUrl
    //

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
        return new File(this.toUrl().concat(`(\"${name}\")`));
    }
}


/**
 * Describes a single File instance
 * 
 */
export class File extends QueryableInstance {

    //
    // TODO:
    //      Methods (https://msdn.microsoft.com/en-us/library/office/dn450841.aspx#bk_FileMethods)
    //          Approve 
    //          CancelUpload 
    //          CheckIn 
    //          CheckOut 
    //          ContinueUpload 
    //          CopyTo 
    //          DeleteObject 
    //          Deny 
    //          FinishUpload 
    //          GetLimitedWebPartManager 
    //          MoveTo 
    //          OpenBinaryStream 
    //          Publish 
    //          Recycle 
    //          SaveBinaryStream 
    //          StartUpload 
    //          UndoCheckOut 
    //          Unpublish
    //      Properties
    //          Return enums where expected
    // 

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
     * Gets a value that specifies the user who added the file.
     * 
     */
    public get author(): Queryable {
        return new Queryable(this, "Author");
    }

    /**
     * Gets a result indicating the current user who has a file checked out
     * 
     */
    public get checkedOutByUser(): Queryable {
        return new Queryable(this, "CheckedOutByUser");
    }

    /**
     * Gets a value that returns the comment used when a document is checked in to a document library.
     * 
     */
    public get checkInComment(): Queryable {
        return new Queryable(this, "CheckInComment");
    }

    /**
     * Gets a value that indicates how the file is checked out of a document library.
     * The checkout state of a file is independent of its locked state.
     * 
     */
    public get checkOutType(): Queryable {
        return new Queryable(this, "CheckOutType");
    }

    /**
     * Returns internal version of content, used to validate document equality for read purposes.
     * 
     */
    public get contentTag(): Queryable {
        return new Queryable(this, "ContentTag");
    }

    /**
     * Gets a value that specifies the customization status of the file.
     * 
     */
    public get customizedPageStatus(): Queryable {
        return new Queryable(this, "CustomizedPageStatus");
    }

    /**
     * Gets the current eTag of a file
     * 
     */
    public get eTag(): Queryable {
        return new Queryable(this, "ETag");
    }

    /**
     * Gets a value that specifies whether the file exists.
     * 
     */
    public get exists(): Queryable {
        return new Queryable(this, "Exists");
    }

    /**
     * Gets the size of the file in bytes, excluding the size of any Web Parts that are used in the file.
     */
    public get length(): Queryable {
        return new Queryable(this, "Length");
    }

    /**
     * Gets a value that specifies the publishing level of the file.
     * 
     */
    public get level(): Queryable {
        return new Queryable(this, "level");
    }

    /**
     * Gets a value that specifies the list item field values for the list item corresponding to the file.
     * 
     */
    public get listItemAllFields(): Item {
        return new Item(this, "ListItemAllFields");
    }

    /**
     * Gets a value that returns the user that owns the current lock on the file.
     * 
     */
    public get lockedByUser(): Queryable {
        return new Queryable(this, "LockedByUser");
    }

    /**
     * Gets a value that specifies the major version of the file.
     * 
     */
    public get majorVersion(): Queryable {
        return new Queryable(this, "MajorVersion");
    }

    /**
     * Gets a value that specifies the minor version of the file.
     * 
     */
    public get minorVersion(): Queryable {
        return new Queryable(this, "MinorVersion");
    }

    /**
     * Gets a value that returns the user who last modified the file.
     * 
     */
    public get modifiedBy(): Queryable {
        return new Queryable(this, "ModifiedBy");
    }

    /**
     * Gets the name of the file including the extension.
     * 
     */
    public get name(): Queryable {
        return new Queryable(this, "Name");
    }

    /**
     * Gets the server relative url of a file
     * 
     */
    public get serverRelativeUrl(): Queryable {
        return new Queryable(this, "ServerRelativeUrl");
    }

    /**
     * Gets a value that specifies when the file was created.
     * 
     */
    public get timeCreated(): Queryable {
        return new Queryable(this, "TimeCreated");
    }

    /**
     * Gets a value that specifies when the file was last modified.
     * 
     */
    public get timeLastModified(): Queryable {
        return new Queryable(this, "TimeLastModified");
    }

    /**
     * Gets a value that specifies the display name of the file.
     * 
     */
    public get title(): Queryable {
        return new Queryable(this, "Title");
    }

    /**
     * Gets a value that specifies the implementation-specific version identifier of the file.
     * 
     */
    public get uiVersion(): Queryable {
        return new Queryable(this, "UiVersion");
    }

    /**
     * Gets a value that specifies the implementation-specific version identifier of the file.
     * 
     */
    public get uiVersionLabel(): Queryable {
        return new Queryable(this, "UiVersionLabel");
    }

    /**
     * Gets a collection of versions
     * 
     */
    public get versions(): Versions {
        return new Versions(this);
    }

    /**
     * Gets the contents of the file - If the file is not JSON a custom parser function should be used with the get call
     * 
     */
    public get value(): Queryable {
        return new Queryable(this, "$value");
    }
}


/**
 * Describes a collection of Version objects
 * 
 */
export class Versions extends QueryableCollection {

    //
    // TODO:
    //      Methods (https://msdn.microsoft.com/en-us/library/office/dn450841.aspx#bk_FileVersionCollectionMethods)
    //          DeleteAll 
    //          DeleteById 
    //          DeleteByLabel 
    //          RestoreByLabel
    //

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
        let v = new Version(this);
        v.concat(`(${versionId})`);
        return v;
    }
}


/**
 * Describes a single Version instance
 * 
 */
export class Version extends QueryableInstance {

    // TODO
    //      Properties (https://msdn.microsoft.com/en-us/library/office/dn450841.aspx#bk_FileVersionProperties)
    //          CheckInComment
    //          Created
    //          CreatedBy
    //          ID
    //          IsCurrentVersion
    //          Size
    //          Url
    //          VersionLabel
    //      Methods (https://msdn.microsoft.com/en-us/library/office/dn450841.aspx#bk_FileVersionMethods)
    //          DeleteObject
    //

    /**
     * Creates a new instance of the Version class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, if supplied will be appended to the supplied baseUrl
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }
}
