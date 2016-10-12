"use strict";

import { expect } from "chai";
import { Lists } from "../../../src/sharepoint/rest/lists";
import { testSettings } from "../../test-config.test";
import pnp from "../../../src/pnp";

describe("Lists", () => {

    let lists: Lists;

    beforeEach(() => {
        lists = new Lists("_api/web");
    });

    it("Should be an object", () => {
        expect(lists).to.be.a("object");
    });

    if (testSettings.enableWebTests) {

        describe("getByTitle", () => {
            it("Should get a list by title with the expected title", () => {

                // we are expecting that the OOTB list exists 
                return expect(pnp.sp.web.lists.getByTitle("Documents").get()).to.eventually.have.property("Title", "Documents");
            });
        });

        describe("getSubscriptions", () => {
            it("Should return the subscriptions of the current list", () => {
                // we are expecting that the OOTB list exists 
                let expectVal = expect(pnp.sp.web.lists.getByTitle("Documents").getSubscriptions());
                return expectVal.to.eventually.be.fulfilled;
            });
        });

        describe("createSubscription", () => {
            it("Should be able to create a new webhook subscription in the current list", () => {
                let today = new Date();
                let expirationDate = new Date(today.setDate(today.getDate() + 90)).toISOString();
                let expectVal = expect(pnp.sp.web.lists.getByTitle("Documents").createSubscriptions(testSettings.notificationUrl, expirationDate));
                return expectVal.to.eventually.be.fulfilled;
            });
        });

        describe("updateSubscription", () => {
            it("Should be able to update an existing webhook subscription in the current list", () => {
                pnp.sp.web.lists.getByTitle("Documents").getSubscriptions().then((data) => {
                    if (data !== null) {
                        if (data.length > 0) {
                            let today = new Date();
                            let expirationDate = new Date(today.setDate(today.getDate() + 90)).toISOString();
                            let expectVal = expect(pnp.sp.web.lists.getByTitle("Documents").updateSubscriptions(data[0].id, expirationDate));
                            return expectVal.to.eventually.be.fulfilled;
                        }
                    }
                });
            });
        });

        describe("deleteSubscription", () => {
            it("Should be able to delete an existing webhook subscription in the current list", () => {
                pnp.sp.web.lists.getByTitle("Documents").getSubscriptions().then((data) => {
                    if (data !== null) {
                        if (data.length > 0) {
                            let expectVal = expect(pnp.sp.web.lists.getByTitle("Documents").deleteSubscriptions(data[0].id));
                            return expectVal.to.eventually.be.fulfilled;
                        }
                    }
                });
            });
        });

    }
});
