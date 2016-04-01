"use strict";

import { Queryable } from "./Queryable";
import * as Util from "../../utils/util";
import * as Mixins from "./mixins";

export class Views extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {

    constructor(url: string | Queryable) {
        super(url, "views");
    }

    public getById(id: string): View {
        this.concat(`(guid'${id}')`);
        return this;
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): Views { return; }

    // filterable stub for mixin
    public filter(filter: string): Views { return; }
}

Util.applyMixins(Views, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);

export class View extends Queryable implements Mixins.Gettable, Mixins.Selectable {

    constructor(baseUrl: string | Queryable) {
        super(baseUrl);
    }

    // gettable stub for mixin
    public get(): Promise<any> { return; }

    // selectable stub for mixin
    public select(...selects: string[]): View { return; }
}

Util.applyMixins(View, Mixins.Gettable, Mixins.Selectable);
