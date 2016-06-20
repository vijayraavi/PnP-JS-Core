"use strict";

import { HttpClientImpl } from "./httpClient";

declare var global: any;

/**
 * Makes requests using the fetch API
 */
export class SPRequestExecutorClient implements HttpClientImpl {
    public fetch(url: string, options: any): Promise<Response> {
        let addinWebUrl = url.substring(0, url.indexOf("/_api")),
            executor = new SP.RequestExecutor(addinWebUrl),
            headers: { [key: string]: string; } = {},
            iterator = options.headers.entries(),
            temp = iterator.next();

        while (!temp.done) {
            headers[temp.value[0]] = temp.value[1];
            temp = iterator.next();
        }

        return new Promise((resolve, reject) => {
            executor.executeAsync(
            {
                error: function (error: SP.ResponseInfo) {
                    reject(error);
                },
                headers: headers,
                method: options.method,
                success: (response: SP.ResponseInfo) => {
                    let responseHeaders = new Headers();
                    for (let h in response.headers) {
                        if (response.headers[h]) {
                            responseHeaders.append(h, response.headers[h]);
                        }
                    }

                    let result = new Response(<any>response.body, {
                        headers: responseHeaders,
                        status: response.statusCode,
                        statusText: response.statusText,
                    });

                    resolve(result);
                },
                url: url,
            }
        );
        });
    }
}
