"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";
import { Lists } from "./lists";
import { RoleAssignments } from "./roleAssignments";
import { Navigation } from "./navigation";
import { SiteUsers } from "./siteUsers";
import { ContentTypes } from "./contentTypes";

export class Web extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    constructor(url: string) {
        super(url, "web");

        this.lists = new Lists(this);
        this.roleAssignments = new RoleAssignments(this);
        this.navigation = new Navigation(this);
        this.siteUsers = new SiteUsers(this);
        this.contentTypes = new ContentTypes(this);
    }

    public contentTypes: ContentTypes;
    public roleAssignments: RoleAssignments;
    public lists: Lists;
    public navigation: Navigation;
    public siteUsers: SiteUsers;

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): Web { return; }
}

Util.applyMixins(Web, Mixins.Gettable, Mixins.Selectable);
