"use strict";

import { HttpClientImpl } from "./httpClient";

declare var global: any;

export class FetchClient implements HttpClientImpl {
    public fetch(url: string, options: any): Promise<Response> {
        return global.fetch(url, options);
    }
}
