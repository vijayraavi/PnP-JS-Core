"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

export class QuickLaunch extends Queryable implements Mixins.Gettable {

    constructor(url: string | Queryable) {
        super(url, "QuickLaunch");
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }
}

Util.applyMixins(QuickLaunch, Mixins.Gettable);
