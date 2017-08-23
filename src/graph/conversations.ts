import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";
import { TypedHash } from "../collections/collections";

export class Conversations extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "conversations") {
        super(baseUrl, path);
    }

    /**
     * Create a new conversation by including a thread and a post.
     * 
     * @param properties Properties used to create the new conversation
     */
    public add(properties: TypedHash<any>): Promise<any> {

        return this.post({
            body: JSON.stringify(properties),
        });
    }

    /**
     * Gets a conversation from this collection by id
     * 
     * @param id Group member's id
     */
    public getById(id: string): Conversation {
        return new Conversation(this, id);
    }
}

export class Threads extends GraphQueryableCollection {
    constructor(baseUrl: string | GraphQueryable, path = "threads") {
        super(baseUrl, path);
    }
}

export class Conversation extends GraphQueryableInstance {

    /**
     * Get all the threads in a group conversation.
     */
    public get threads(): Threads {
        return new Threads(this);
    }

    /**
     * Deletes this member from the group
     */
    public delete(): Promise<void> {
        return super.delete();
    }
}
