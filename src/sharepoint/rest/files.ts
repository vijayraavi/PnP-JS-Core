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
    //          AddTemplateFile
    //          GetByUrl
    //

    /**
     * Creates a new instance of the Files class
     * 
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     */
    constructor(baseUrl: string | Queryable, path = "files") {
        super(baseUrl, path);
    }

    /**
     * Gets a File by filename
     * 
     * @param name The name of the file, including extension
     */
    public getByName(name: string): File {
        let f = new File(this);
        f.concat(`('${name}')`);
        return f;
    }

    /**
     * Uploads a file.
     * 
     * @param url The folder-relative url of the file.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     * @param content The file contents blob.
     * @returns The new File and the raw response. 
     */
    public add(url: string, content: Blob, shouldOverWrite = true): Promise<FileAddResult> {
        return new Files(this, `add(overwrite=${shouldOverWrite},url='${url}')`)
            .post({ body: content }).then((response) => {
                return {
                    data: response,
                    file: this.getByName(url),
                };
            });
    }
}


/**
 * Describes a single File instance
 * 
 */
export class File extends QueryableInstance {

    //
    // TODO:
    //      Return typed things where expected
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
     * Gets a result indicating the current user who has the file checked out.
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
        return new Queryable(this, "Level");
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

    /**
     * Approves the file submitted for content approval with the specified comment.
     * Only documents in lists that are enabled for content approval can be approved.
     * 
     * @param comment The comment for the approval.
     */
    public approve(comment: string): Promise<void> {
        return new File(this, `approve(comment='${comment}')`).post();
    }

    /**
     * Stops the chunk upload session without saving the uploaded data.
     * If the file doesn’t already exist in the library, the partially uploaded file will be deleted.
     * Use this in response to user action (as in a request to cancel an upload) or an error or exception.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     * 
     * @param uploadId The unique identifier of the upload session.
     */
    public cancelUpload(uploadId: string): Promise<void> {
        return new File(this, `cancelupload(uploadId=guid'${uploadId}')`).post();
    }

    /**
     * Checks the file in to a document library based on the check-in type.
     * 
     * @param comment A comment for the check-in. Its length must be <= 1023.
     * @param checkinType The check-in type for the file.
     */
    public checkin(comment = "", checkinType = CheckinType.Major): Promise<void> {
        // TODO: Enforce comment length <= 1023
        return new File(this, `checkin(comment='${comment}',checkintype=${checkinType})`).post();
    }

    /**
     * Checks out the file from a document library.
     */
    public checkout(): Promise<void> {
        return new File(this, "checkout").post();
    }

    /**
     * Continues the chunk upload session with an additional fragment.
     * The current file content is not changed.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     * 
     * @param uploadId The unique identifier of the upload session.
     * @param fileOffset The size of the offset into the file where the fragment starts.
     * @param fragment The file contents.
     * @returns The size of the total uploaded data in bytes. 
     */
    public continueUpload(uploadId: string, fileOffset: number, fragment: Blob): Promise<number> {
        return new File(this, `continueupload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`).post({ body: fragment });
    }

    /**
     * Copies the file to the destination url.
     * 
     * @param url The absolute url or server relative url of the destination file path to copy to.
     * @param shouldOverWrite Should a file with the same name in the same location be overwritten?
     */
    public copyTo(url: string, shouldOverWrite = true): Promise<void> {
        return new File(this, `copyto(strnewurl='${url}',boverwrite=${shouldOverWrite})`).post();
    }

    /**
     * Delete this file.
     * 
     * @param eTag Value used in the IF-Match header, by default "*"
     */
    public delete(eTag = "*"): Promise<void> {
        return this.post({
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "DELETE",
            },
        });
    }

    /**
     * Denies approval for a file that was submitted for content approval.
     * Only documents in lists that are enabled for content approval can be denied.
     * 
     * @param comment The comment for the denial.
     */
    public deny(comment = ""): Promise<void> {
        return new File(this, `deny(comment='${comment}')`).post();
    }

    /**
     * Uploads the last file fragment and commits the file. The current file content is changed when this method completes.
     * Use the uploadId value that was passed to the StartUpload method that started the upload session.
     * This method is currently available only on Office 365.
     * 
     * @param uploadId The unique identifier of the upload session.
     * @param fileOffset The size of the offset into the file where the fragment starts.
     * @param fragment The file contents.
     * @returns The newly uploaded file. 
     */
    public finishUpload(uploadId: string, fileOffset: number, fragment: Blob): Promise<FileAddResult> {
        return new File(this, `finishupload(uploadId=guid'${uploadId}',fileOffset=${fileOffset})`)
            .post({ body: fragment }).then((response) => {
                return {
                    data: response,
                    file: new File(response.ServerRelativeUrl),
                };
            });
    }

    /**
     * Specifies the control set used to access, modify, or add Web Parts associated with this Web Part Page and view.
     * An exception is thrown if the file is not an ASPX page.
     * 
     * @param scope The WebPartsPersonalizationScope view on the Web Parts page.
     */
    public getLimitedWebPartManager(scope = WebPartsPersonalizationScope.User): Queryable {
        return new Queryable(this, `getlimitedwebpartmanager(scope=${scope})`);
    }

    /**
     * Moves the file to the specified destination url.
     * 
     * @param url The absolute url or server relative url of the destination file path to move to.
     * @param moveOperations The bitwise MoveOperations value for how to move the file.
     */
    public moveTo(url: string, moveOperations = MoveOperations.Overwrite): Promise<void> {
        return new File(this, `moveto(newurl='${url}',flags=${moveOperations})`).post();
    }

    /**
     * Opens the file as a stream.
     * 
     */
    public openBinaryStream(): Queryable {
        return new Queryable(this, "openbinarystream");
    }

    /**
     * Submits the file for content approval with the specified comment.
     * 
     * @param comment The comment for the published file. Its length must be <= 1023.
     */
    public publish(comment = ""): Promise<void> {
        return new File(this, `publish(comment='${comment}')`).post();
    }

    /**
     * Moves the file to the Recycle Bin and returns the identifier of the new Recycle Bin item.
     * 
     * @returns The GUID of the recycled file.
     */
    public recycle(): Promise<string> {
        return new File(this, "recycle").post();
    }

    /**
     * Uploads a binary file.
     * 
     * @data The file contents.
     */
    public saveBinaryStream(data: Blob): Promise<void> {
        return new File(this, "savebinary").post({ body: data });
    }

    /**
     * Starts a new chunk upload session and uploads the first fragment.
     * The current file content is not changed when this method completes.
     * The method is idempotent (and therefore does not change the result) as long as you use the same values for uploadId and stream.
     * The upload session ends either when you use the CancelUpload method or when you successfully
     * complete the upload session by passing the rest of the file contents through the ContinueUpload and FinishUpload methods.
     * The StartUpload and ContinueUpload methods return the size of the running total of uploaded data in bytes,
     * so you can pass those return values to subsequent uses of ContinueUpload and FinishUpload.
     * This method is currently available only on Office 365.
     * 
     * @param uploadId The unique identifier of the upload session.
     * @param fragment The file contents.
     * @returns The size of the total uploaded data in bytes. 
     */
    public startUpload(uploadId: string, fragment: Blob): Promise<number> {
        return new File(this, `startupload(uploadId=guid'${uploadId}')`).post({ body: fragment });
    }

    /**
     * Reverts an existing checkout for the file.
     * 
     */
    public undoCheckout(): Promise<void> {
        return new File(this, "undocheckout").post();
    }

    /**
     * Removes the file from content approval or unpublish a major version.
     * 
     * @param comment The comment for the unpublish operation. Its length must be <= 1023.
     */
    public unpublish(comment = ""): Promise<void> {
        // TODO: Enforce comment length <= 1023
        return new File(this, `unpublish(comment='${comment}')`).post();
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

export enum CheckinType {
    Minor = 0,
    Major = 1,
    Overwrite = 2
}

export interface FileAddResult {
    file: File;
    data: any;
}

export enum WebPartsPersonalizationScope {
    User = 0,
    Shared = 1
}

export enum MoveOperations {
    Overwrite = 1,
    AllowBrokenThickets = 8
}
