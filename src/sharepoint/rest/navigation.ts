"use strict";

import { Queryable } from "./queryable";
import { QuickLaunch } from "./quickLaunch";
import { TopNavigationBar } from "./topNavigationBar";

export class Navigation extends Queryable {

    constructor(url: string | Queryable) {
        super(url, "Navigation");

        this.quicklaunch = new QuickLaunch(this);
        this.topNavigationBar = new TopNavigationBar(this);

    }

    public quicklaunch: QuickLaunch;
    public topNavigationBar: TopNavigationBar;
}
