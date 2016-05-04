"use strict";

// import { Promise } from "es6-promise";
import { ProvisioningStep } from "./ProvisioningStep";
import { ObjectNavigation } from "../ObjectHandlers/ObjectNavigation/ObjectNavigation";
import { ObjectPropertyBagEntries } from "../ObjectHandlers/ObjectPropertyBagEntries/ObjectPropertyBagEntries";
import { ObjectFeatures } from "../ObjectHandlers/ObjectFeatures/ObjectFeatures";
import { ObjectWebSettings } from "../ObjectHandlers/ObjectWebSettings/ObjectWebSettings";
import { ObjectComposedLook } from "../ObjectHandlers/ObjectComposedLook/ObjectComposedLook";
import { ObjectCustomActions } from "../ObjectHandlers/ObjectCustomActions/ObjectCustomActions";
import { ObjectFiles } from "../ObjectHandlers/ObjectFiles/ObjectFiles";
import { ObjectLists } from "../ObjectHandlers/ObjectLists/ObjectLists";
import { replaceUrlTokens } from "../../../sharepoint/util";
import * as Resources from "../Resources/Resources";
import { Log } from "../Provisioning";
import { SiteSchema } from "../schema/isiteschema";
import { IOptions } from "./ioptions";
import { HttpClient } from "../../../net/HttpClient";

export class Core {
    private handlers;
    private httpClient: HttpClient;
    private options: IOptions;
    private startTime;
    private queueItems: Array<ProvisioningStep>;
    constructor() {
        this.handlers = {
            "Navigation": ObjectNavigation,
            "PropertyBagEntries": ObjectPropertyBagEntries,
            "Features": ObjectFeatures,
            "WebSettings": ObjectWebSettings,
            "ComposedLook": ObjectComposedLook,
            "CustomActions": ObjectCustomActions,
            "Files": ObjectFiles,
            "Lists": ObjectLists,
        };
        this.httpClient = new HttpClient();
    }
    public applyTemplate(path: string, _options?: IOptions) {
        const url = replaceUrlTokens(path);
        this.options = _options || {};

        return new Promise((resolve, reject) => {
            this.httpClient.get(url).then((response) => {
                if (response.ok) {
                    response.json<SiteSchema>().then((template) => {
                        this.start(template, Object.keys(template)).then(resolve, reject);
                    });
                } else {
                    reject(response.statusText);
                }
            }, (error) => {
                Log.error("Provisioning", Resources.Template_invalid);
            });
        });
    }
    private start(json: SiteSchema, queue: Array<string>) {
        return new Promise((resolve, reject) => {
            this.startTime = new Date().getTime();
            this.queueItems = [];

            queue.forEach((q, index) => {
                if (!this.handlers[q]) {
                    return;
                }
                this.queueItems.push(new ProvisioningStep(q, index, json[q], json.Parameters, this.handlers[q]));
            });

            let promises = [];
            promises.push(new Promise(() => {
                Log.info("Provisioning", Resources.Code_execution_started);
            }));
            let index = 1;
            while (this.queueItems[index - 1] !== undefined) {
                let i = promises.length - 1;
                promises.push(this.queueItems[index - 1].execute(promises[i]));
                index++;
            };

            Promise.all(promises).then((value) => {
                Log.info("Provisioning", Resources.Code_execution_ended);
                resolve(value);
            }, (error) => {
                Log.info("Provisioning", Resources.Code_execution_ended);
                reject(error);
            });
        });
    }
}
