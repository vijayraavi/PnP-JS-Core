"use strict";

import { Queryable, QueryableCollection, QueryableInstance } from "./queryable";

/**
 * Describes a collection of webhook subscriptions
 * 
 */
export class Subscriptions extends QueryableCollection {

    /**
     * Creates a new instance of the Subscriptions class
     * 
     * @param baseUrl - The url or Queryable which forms the parent of this webhook subscriptions collection
     */
    constructor(baseUrl: string | Queryable, path = "subscriptions") {
        super(baseUrl, path);
    }

    /**
     * Returns all the webhook subscriptions or the specified webhook subscription
     *
     */
    public getById(subscriptionId: string): Promise<any> {
        let q = this;
        q.concat(`('${subscriptionId}')`);
        return q.get();
    }

    /**
     * Create a new webhook subscription
     *
     */
    public create(notificationUrl: string, expirationDate: string, clientState?: string): Promise<any> {
        let postBody = JSON.stringify({
            "resource": this.toUrl(),
            "notificationUrl": notificationUrl,
            "expirationDateTime": expirationDate,
            "clientState": clientState || "pnp-js-core-subscription",
        });
        return this.post({ body: postBody, headers: { "Content-Type": "application/json" } });
    }

    /**
     * Update a webhook subscription
     *
     */
    public update(subscriptionId: string, expirationDate: string): Promise<Subscription> {
        let postBody = JSON.stringify({
            "expirationDateTime": expirationDate,
        });

        let q = this;
        q.concat(`('${subscriptionId}')`);
        return q.patch({ body: postBody, headers: { "Content-Type": "application/json" } });
    }

    /**
     * Remove a webhook subscription
     *
     */
    public remove(subscriptionId: string): Promise<any> {
        let q = this;
        q.concat(`('${subscriptionId}')`);
        return q.delete();
    }
}

/**
 * Describes a single webhook subscription instance
 * 
 */
export class Subscription extends QueryableInstance {

    /**
     * Creates a new instance of the Subscription class
     * 
     * @param baseUrl - The url or Queryable which forms the parent of this webhook subscription instance
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }
}
