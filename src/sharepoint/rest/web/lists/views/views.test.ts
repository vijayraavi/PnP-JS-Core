"use strict";

import { expect } from "chai";
import { Views } from "./Views";

describe("Views", () => {
    it("Should be an object", () => {
        let views = new Views(["_api/web/lists/getByTitle('Tasks')"]);
        expect(views).to.be.a("object");
    });
    describe("url", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/Views", () => {
            let views = new Views(["_api/web/lists/getByTitle('Tasks')"]);
            expect(views.url()).to.equal("_api/web/lists/getByTitle('Tasks')/Views");
        });
    });
    describe("getById", () => {
        it("Should return _api/web/lists/getByTitle('Tasks')/Views(guid'7b7c777e-b749-4f58-a825-53084f2941b0')", () => {
            let views = new Views(["_api/web/lists/getByTitle('Tasks')"]);
            let view = views.getById("7b7c777e-b749-4f58-a825-53084f2941b0");
            expect(view.url()).to.equal("_api/web/lists/getByTitle('Tasks')/Views(guid'7b7c777e-b749-4f58-a825-53084f2941b0')");
        });
    });
});
