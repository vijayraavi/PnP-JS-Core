import { GraphQueryable, GraphQueryableInstance, GraphQueryableCollection } from "./graphqueryable";
import { TypedHash } from "../collections/collections";

export class Calendars extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "calendars") {
        super(baseUrl, path);
    }
}

export class Calendar extends GraphQueryableInstance {

    public get events(): Events {
        return new Events(this);
    }
}

export class Events extends GraphQueryableCollection {

    constructor(baseUrl: string | GraphQueryable, path = "events") {
        super(baseUrl, path);
    }

    public getById(id: string): Event {
        return new Event(this, id);
    }

    /**
     * Adds a new event to the collection
     * 
     * @param properties The set of properties used to create the event
     */
    public add(properties: TypedHash<string | number | boolean> = {}): Promise<EventAddResult> {

        return this.post({
            body: JSON.stringify(properties),
        }).then(r => {
            return {
                data: r,
                event: this.getById(r.id),
            };
        });
    }
}

export interface EventAddResult {
    data: any;
    event: Event;
}

export class Event extends GraphQueryableInstance {

    /**
     * Update the properties of an event object
     * 
     * @param properties Set of properties of this event to update
     */
    public update(properties: TypedHash<string | number | boolean | string[]>): Promise<void> {

        return this.patch({
            body: JSON.stringify(properties),
        });
    }

    /**
     * Deletes this event
     */
    public delete(): Promise<void> {
        return this.delete();
    }
}

