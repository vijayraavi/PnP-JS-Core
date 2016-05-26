"use strict";

import { expect } from "chai";
import { SiteUsers } from "../../../src/sharepoint/rest/siteUsers";

describe("SiteUsers", () => {
    it("Should be an object", () => {
        let siteUsers = new SiteUsers("_api/web");
        expect(siteUsers).to.be.a("object");
    });

    describe("url", () => {
        it("Should return _api/web/siteusers", () => {
            let siteUsers = new SiteUsers("_api/web");
            expect(siteUsers.toUrl()).to.equal("_api/web/siteusers");
        });
    });

    describe("getByLoginName", () => {
        it("Should return _api/web/siteusers/getByloginName('i%3A0%23.f%7Cmembership%7Cuser%40devtenant.com')", () => {
            let user = new SiteUsers("_api/web").getByLoginName("i:0#.f|membership|user@devtenant.com");
            expect(user.toUrl()).to.equal("_api/web/siteusers/getByloginName('i%3A0%23.f%7Cmembership%7Cuser%40devtenant.com')");
        });
    });

    describe("getById", () => {
        it("Should return _api/web/siteusers/getById('12')", () => {
            let user = new SiteUsers("_api/web").getById(12);
            expect(user.toUrl()).to.equal("_api/web/siteusers/getById('12')");
        });
    });

    describe("getByEmail", () => {
        it("Should return _api/web/siteusers/getByEmail('user@user.com')", () => {
            let user = new SiteUsers("_api/web").getByEmail("user@user.com");
            expect(user.toUrl()).to.equal("_api/web/siteusers/getByEmail('user@user.com')");
        });
    });

    describe("groups", () => {
        it("Should return _api/web/siteusers/getByEmail('user@user.com')/groups", () => {
            let groups = new SiteUsers("_api/web").getByEmail("user@user.com").groups;
            expect(groups.toUrl()).to.equal("_api/web/siteusers/getByEmail('user@user.com')/groups");
        });
    });
});

