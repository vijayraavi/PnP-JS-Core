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
}
