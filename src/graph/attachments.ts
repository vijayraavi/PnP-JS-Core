import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";

export interface AttachmentData {
    contentBytes?: Blob;
    contentId?: string;
    contentLocation?: string;
    contentType?: string;
    id?: string;
    isInline?: boolean;
    lastModifiedDateTime?: string;
    name?: string;
    size?: number;
}

export class Attachments extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "attachments") {
        super(baseUrl, path);
    }

    /**
     * Gets a member of the group by id
     * 
     * @param id Attachment id
     */
    public getById(id: string): Attachment {
        return new Attachment(this, id);
    }

    /**
     * Add attachment to this collection
     * 
     * @param name Name given to the attachment file
     * @param bytes File content
     */
    public addFile(name: string, bytes: string | Blob): Promise<AttachmentData> {

        return this.post({
            body: JSON.stringify({
                "@odata.type": "#microsoft.graph.fileAttachment",
                contentBytes: bytes,
                name: name,
            }),
        });
    }
}

export class Attachment extends GraphQueryableInstance {
}
