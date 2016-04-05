"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

export class TopNavigationBar extends Queryable implements Mixins.Gettable {

    constructor(url: string | Queryable) {
        super(url, "TopNavigationBar");
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }
}

Util.applyMixins(TopNavigationBar, Mixins.Gettable);
