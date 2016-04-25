"use strict";

import { expect } from "chai";
import { Fields } from "../../../src/sharepoint/rest/fields";

describe("Fields", () => {
    it("Should be an object", () => {
        let fields = new Fields("_api/web");
        expect(fields).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/fields", () => {
            let fields = new Fields("_api/web/lists/getByTitle('Tasks')");
            expect(fields.toUrl()).to.equal("_api/web/lists/getByTitle('Tasks')/fields");
        });
    });
});
