"use strict";

import { Web } from "./web";

/**
 * Root of the SharePoint REST module
 */
export class Rest {
    public web = new Web("_api");
}
