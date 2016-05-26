"use strict";

import { expect } from "chai";
import { SiteGroups } from "../../../src/sharepoint/rest/siteGroups";

describe("SiteGroups", () => {
    it("Should be an object", () => {
        let siteGroups = new SiteGroups("_api/web");
        expect(siteGroups).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/sitegroups", () => {
            let siteGroups = new SiteGroups("_api/web");
            expect(siteGroups.toUrl()).to.equal("_api/web/sitegroups");
        });
    });

    describe("getByLoginName", () => {
       it("Should return _api/web/sitegroups/getByloginName('i%3A0%23.f%7Cmembership%7Cuser%40devtenant.com')", () => {
           let user = new SiteGroups("_api/web").getByLoginName("i:0#.f|membership|user@devtenant.com");
           expect(user.toUrl()).to.equal("_api/web/sitegroups/getByloginName('i%3A0%23.f%7Cmembership%7Cuser%40devtenant.com')");
       });
    });

    describe("getById", () => {
       it("Should return _api/web/sitegroups/getById('12')", () => {
           let user = new SiteGroups("_api/web").getById(12);
           expect(user.toUrl()).to.equal("_api/web/sitegroups/getById('12')");
       });
    });

    describe("getByEmail", () => {
       it("Should return _api/web/sitegroups/getByName('Group Name')", () => {
           let user = new SiteGroups("_api/web").getByName("Group Name");
           expect(user.toUrl()).to.equal("_api/web/sitegroups/getByName('Group Name')");
       });
    });

    describe("users", () => {
       it("Should return _api/web/sitegroups/getByName('Group Name')/users", () => {
           let user = new SiteGroups("_api/web").getByName("Group Name").users;
           expect(user.toUrl()).to.equal("_api/web/sitegroups/getByName('Group Name')/users");
       });
    });
});
