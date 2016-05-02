// import { Promise } from "es6-promise";
import * as Resources from "../../Resources/Resources";
import { Log } from "../../Provisioning";
import { HttpClient } from "../../../../net/HttpClient";

export class ObjectHandlerBase {
    public httpClient: HttpClient;
    private name: string;

    constructor(name: string) {
        this.name = name;
        this.httpClient = new HttpClient();
    }
    public ProvisionObjects(objects: any, parameters?) {
        return new Promise((resolve, reject) => { resolve("Not implemented."); });
    }
    public scope_started() {
        Log.info(this.name, Resources.Code_execution_started);
    }
    public scope_ended() {
        Log.info(this.name, Resources.Code_execution_ended);
    }
}
