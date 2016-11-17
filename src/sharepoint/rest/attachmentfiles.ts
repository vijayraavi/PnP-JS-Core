"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./queryable";
import { QueryableSecurable } from "./queryablesecurable";
import { TypedHash } from "../../collections/collections";
import { Util } from "../../utils/util";
import * as Types from "./types";
import { ODataParserBase } from "./odata";

/**
 * Describes a collection of Item objects
 *
 */
export class AttachmentFiles extends QueryableCollection {

    /**
     * Creates a new instance of the AttachmentFiles class
     *
     * @param baseUrl The url or Queryable which forms the parent of this attachments collection
     */
    constructor(baseUrl: string | Queryable, path = "AttachmentFiles") {
        super(baseUrl, path);
    }

    /**
     * Gets a Attachment File by filename
     * 
     * @param name The name of the file, including extension.
     */
    public getByName(name: string): AttachmentFile {
        let f = new AttachmentFile(this);
        f.concat(`(FileName='${name}')`);
        return f;
    }

    /**
     * Adds a new attachment to the collection
     *
     * @param name The name of the file, including extension.
     * @param content The Base64 file content.
     */
    public add(name: string, content: string): Promise<AttachmentFileAddResult> {
        return new AttachmentFiles(this, `add(FileName='${name}')`)
            .post({
                // binaryStringRequestBody: true,
                body: content
            }).then((response) => {
                return {
                    data: response,
                    file: this.getByName(name),
                };
            });
    }
}

/**
 * Descrines a single attachment file instance
 *
 */
export class AttachmentFile extends QueryableSecurable {

    /**
     * Creates a new instance of the AttachmentFile class
     *
     * @param baseUrl The url or Queryable which forms the parent of this attachment file
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Delete this attachment file
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
}

export interface AttachmentFileAddResult {
    file: AttachmentFile;
    data: any;
}