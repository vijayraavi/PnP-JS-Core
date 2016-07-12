"use strict";

import * as chai from "chai";
import pnp from "../src/pnp";
import { Util } from "../src/utils/util";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);


export let testSettings = {

};


before(function (done: MochaDone) {

    // this may take some time, don't timeout early
    this.timeout(30000);

    // establish the connection to sharepoint
    if (testSettings.enableWebTests) {

        pnp.setup({
            nodeClientOptions: {
                clientId: testSettings.clientId,
                clientSecret: testSettings.clientSecret,
                siteUrl: testSettings.siteUrl,
            },
        });
    }

    // create the web in which we will test
    let d = new Date();
    let g = Util.getGUID();

    pnp.sp.web.webs.add(`PnP-JS-Core Testing ${d.toDateString()}`, g).then(() => {

        let url = Util.combinePaths(testSettings.siteUrl, g);

        // re-setup the node client to use the new web
        pnp.setup({
            nodeClientOptions: {
                clientId: testSettings.clientId,
                clientSecret: testSettings.clientSecret,
                siteUrl: url,
            },
        });

        done();
    });
});

after(() => {

    // could remove the sub web here?
    // clean up other stuff?
});
