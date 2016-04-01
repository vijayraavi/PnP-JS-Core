"use strict";

import {IConfigurationProvider} from "../configuration/configuration";
import {ITypedHash} from "../collections/collections";

export default class MockConfigurationProvider implements IConfigurationProvider {
    public shouldThrow: boolean = false;
    public shouldReject: boolean = false;

    constructor(public mockValues?: ITypedHash<string>) { }

    public getConfiguration(): Promise<ITypedHash<string>> {
        if (this.shouldThrow) {
            throw new Error("Mocked error");
        }

        return new Promise<ITypedHash<string>>((resolve, reject) => {
            if (this.shouldReject) {
                reject("Mocked rejection");
            } else {
                resolve(this.mockValues);
            }
        });
    }
}
