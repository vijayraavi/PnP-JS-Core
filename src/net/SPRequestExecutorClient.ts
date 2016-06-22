"use strict";

import { HttpClientImpl } from "./httpClient";

declare var global: any;

/**
 * Makes requests using the fetch API
 */
export class SPRequestExecutorClient implements HttpClientImpl {

    /**
     * One promise for loading the SP.RequestExecutor script file.
     */
    private static loadingPromise: Promise<void>;

    public fetch(url: string, options: any): Promise<Response> {
        let addinWebUrl = url.substring(0, url.indexOf("/_api"));
        return this.ensureSPRequestExecutor(addinWebUrl).then(() => {
            return this.executeRequest(addinWebUrl, url, options);
        });
    }

    private convertToResponse = (spResponse: SP.ResponseInfo): Response => {
        let responseHeaders = new Headers();
        for (let h in spResponse.headers) {
            if (spResponse.headers[h]) {
                responseHeaders.append(h, spResponse.headers[h]);
            }
        }

        return new Response(<any>spResponse.body, {
            headers: responseHeaders,
            status: spResponse.statusCode,
            statusText: spResponse.statusText,
        });
    };

    private ensureSPRequestExecutor = (addinWebUrl: string): Promise<void> => {
        if (!SPRequestExecutorClient.loadingPromise) {
            // Initialize new promise for loading the script
            SPRequestExecutorClient.loadingPromise = new Promise<void>((resolve, reject) => {
                if (typeof SP === "undefined" || typeof SP.RequestExecutor === "undefined") {
                    // load the SP.RequestExecutor from the addin web.
                    let head = document.getElementsByTagName("head")[0],
                        script = document.createElement("script");
                    script.type = "text/javascript";
                    script.onload = () => {
                        resolve();
                    };
                    script.src = addinWebUrl + "/_layouts/15/SP.RequestExecutor.js";
                    head.appendChild(script);
                } else {
                    // SP.RequestExecutor already loaded
                    resolve();
                }
            });
        }

        return SPRequestExecutorClient.loadingPromise;

    };

    private executeRequest = (addinWebUrl: string, url: string, options: any): Promise<Response> => {
        return new Promise((resolve, reject) => {
            let executor = new SP.RequestExecutor(addinWebUrl),
                headers: { [key: string]: string; } = {},
                iterator,
                temp;

            if (options.headers && options.headers instanceof Headers) {
                iterator = options.headers.entries();
                temp = iterator.next();
                while (!temp.done) {
                    headers[temp.value[0]] = temp.value[1];
                    temp = iterator.next();
                }
            } else {
                headers = options.headers;
            }

            executor.executeAsync(
                {
                    error: (error: SP.ResponseInfo) => {
                        reject(this.convertToResponse(error));
                    },
                    headers: headers,
                    method: options.method,
                    success: (response: SP.ResponseInfo) => {
                        resolve(this.convertToResponse(response));
                    },
                    url: url,
                }
            );
        });
    };
}
