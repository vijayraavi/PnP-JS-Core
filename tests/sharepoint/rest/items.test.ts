"use strict";

import { expect } from "chai";
import { Items } from "../../../src/sharepoint/rest/items";

describe("Items", () => {
    it("Should be an object", () => {
        let items = new Items("_api/web");
        expect(items).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/Items", () => {
            let items = new Items("_api/web/lists/getByTitle('Tasks')");
            expect(items.toUrl()).to.equal("_api/web/lists/getByTitle('Tasks')/items");
        });
    });
    describe("getById", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/Items(1)", () => {
            let items = new Items("_api/web/lists/getByTitle('Tasks')");
            let item = items.getById(1);
            expect(item.toUrl()).to.equal("_api/web/lists/getByTitle('Tasks')/items(1)");
        });
    });
});
