"use strict";

import { Util } from "./utils/Util";
import { PnPClientStorage } from "./utils/Storage";
import { Settings } from "./configuration/configuration";
import { Logger } from "./utils/logging";
import { Rest } from "./SharePoint/Rest/rest";

import { ODataEntity, ODataArray } from "./sharepoint/rest/odata";
import { Item } from "./sharepoint/rest/items";

/**
 * Root class of the Patterns and Practices namespace, provides an entry point to the library
 */

/**
 * Utility methods
 */
export const util = Util;

/**
 * Provides access to the REST interface
 */
export const sp = new Rest();

/**
 * Provides access to local and session storage
 */
export const storage: PnPClientStorage = new PnPClientStorage();

/**
 * Global configuration instance to which providers can be added
 */
export const config = new Settings();

/**
 * Global logging instance to which subscribers can be registered and messages written
 */
export const log = Logger;



class MyItem extends Item {

    public Title: string;
    public Value: string;

}


export const thing = function (show: (s) => void) {

    sp.web.lists.get().then((g) => g.Title);

    sp.web.lists.get().then((g: any) => g.Title);

    sp.web.lists.getAs<any, { Title: string, Value: string }>().then((g: any) => g.Title);

    sp.web.lists.getByTitle("Config3").items.getById(2).getAs(ODataEntity(MyItem)).then(d => show(d.Title));

    sp.web.lists.getByTitle("Config3").items.getAs(ODataArray(MyItem)).then(d => {
        d.forEach(i => {
            show(i.Title);
        });
    });

};

/**
 * Enables use of the import pnp from syntax
 */
export default {
    /**
     * Global configuration instance to which providers can be added
     */
    config: config,
    /**
     * Global logging instance to which subscribers can be registered and messages written
     */
    log: log,
    /**
     * Provides access to the REST interface
     */
    sp: sp,
    /**
     * Provides access to local and session storage
     */
    storage: storage,


    thing: thing,


    /**
     * Utility methods
     */
    util: util,

}
