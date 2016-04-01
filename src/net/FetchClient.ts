"use strict";

import { HttpClientImpl } from "./httpClient";

export class FetchClient implements HttpClientImpl {
    public fetch(url: string, options: any): Promise<Response> {
        return window.fetch(url, options);
    }
}
