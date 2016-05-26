"use strict";

import { Queryable, QueryableInstance, QueryableCollection } from "./Queryable";
import { SiteGroups } from "./sitegroups";
import { Util } from "../../utils/util";

/**
 * Properties that provide a getter, but no setter.
 *
 */
export interface UserReadOnlyProperties {
    id?: number;
    isHiddenInUI?: boolean;
    loginName?: string;
    principalType?: PrincipalType;
    userIdInfo?: { nameId?: string, nameIdIssuer?: string };
}

/**
 * Properties that provide both a getter, and a setter.
 *
 */
export interface UserWriteableProperties {
    isSiteAdmin?: string;
    email?: string;
    title?: string;
}

/**
 * Principal Type enum
 *
 */
export enum PrincipalType {
    None = 0,
    User = 1,
    DistributionList = 2,
    SecurityGroup = 4,
    SharePointGroup = 8,
    All = 15
}

/**
 * Properties that provide both a getter, and a setter.
 *
 */
export interface UserUpdateResult {
    user: SiteUser;
    data: any;
}

export interface UserProps extends UserReadOnlyProperties, UserWriteableProperties {
    __metadata: { id?: string, url?: string, type?: string };
}


/**
 * Describes a collection of all site collection users
 *
 */
export class SiteUsers extends QueryableCollection {

    /**
     * Creates a new instance of the Users class
     *
     * @param baseUrl The url or Queryable which forms the parent of this user collection
     */
    constructor(baseUrl: string | Queryable, path = "siteusers") {
        super(baseUrl, path);
    }

    /**
     * Gets a user from the collection by email
     *
     * @param email The email of the user
     * @param expandUsersGroups boolean Whether or not to expand the user's groups.  Default: false
     */
    public getByEmail(email: string, expandUsersGroups = false): SiteUser {
        return new SiteUser(this.toUrl(), `getByEmail('${email}')`);
    }

    /**
     * Gets a user from the collection by id
     *
     * @param id The id of the user
     */
    public getById(id: number, expandUsersGroups = false): SiteUser {
        return new SiteUser(this.toUrl(), `getById('${id}')`);
    }

    /**
     * Gets a user from the collection by login name
     *
     * @param loginName The email address of the user
     */
    public getByLoginName(loginName: string, expandUsersGroups = false): SiteUser {
        return new SiteUser(this.toUrl(), `getByloginName('${encodeURIComponent(loginName)}')`);
    }

    /**
     * Removes a user from the collection by id
     *
     * @param id The id of the user
     */
    public removeById(id: number | Queryable): Promise<void> {
        // t postBody = "{}";
        this.append(`removeById('${id}')`);
        return this.post();
    }

    /**
     * Removes a user from the collection by login name
     *
     * @param loginName The login name of the user
     */
    public removeByLoginName(loginName: string): Promise<any> {
        // let postBody = "{}";
        this.append(`removeByLoginName('${encodeURIComponent(loginName)}')`);
        return this.post();
    }
}


/**
 * Describes a single user
 *
 */
export class SiteUser extends QueryableInstance {
    /**
     * Creates a new instance of the User class
     *
     * @param baseUrl The url or Queryable which forms the parent of this fields collection
     * @param path Optional, passes the path to the user
     */
    constructor(baseUrl: string | Queryable, path?: string) {
        super(baseUrl, path);
    }

    /**
     * Get's the groups for this user.
     *
     */
    public get groups() { return new SiteGroups(this.toUrl(), "groups"); }

    /**
    * Updates this user instance with the supplied properties
    *
    * @param properties A plain object of property names and values to update for the user
    * @param eTag Value used in the IF-Match header, by default "*"
    */
    /* tslint:disable member-access */
    public update(properties: UserWriteableProperties, eTag = "*"): Promise<UserUpdateResult> {

        let postBody = Util.extend({"__metadata": { "type": "SP.User" }}, properties);

        return this.post({
            body: JSON.stringify(postBody),
            headers: {
                "IF-Match": eTag,
                "X-HTTP-Method": "MERGE",
            }
        })
            .then((data) => {

                let retUser: SiteUser = this;

                if (properties.hasOwnProperty("Title")) {
                    retUser = this.getParent(SiteUser);
                    retUser.append(`getByTitle('${properties["Title"]}') `);
                }

                return {
                    data: data,
                    user: retUser,
                };
            });
    }
    /* tslint:enable */

    /**
     * Delete this user
     *
     */
    public delete(): Promise<void> {
        return this.post({
            headers: {
                "X-HTTP-Method": "DELETE",
            },
        });
    }
}
