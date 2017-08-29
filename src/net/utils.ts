import { Util } from "../utils/util";

export interface ConfigOptions {
    headers?: string[][] | { [key: string]: string };
    mode?: "navigate" | "same-origin" | "no-cors" | "cors";
    credentials?: "omit" | "same-origin" | "include";
    cache?: "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
}

export interface FetchOptions extends ConfigOptions {
    method?: string;
    body?: any;
}

export function mergeOptions(target: ConfigOptions, source: ConfigOptions): void {
    target.headers = target.headers || {};
    const headers = Util.extend(target.headers, source.headers);
    target = Util.extend(target, source);
    target.headers = headers;
}

export function mergeHeaders(target: Headers, source: any): void {
    if (typeof source !== "undefined" && source !== null) {
        const temp = <any>new Request("", { headers: source });
        temp.headers.forEach((value: string, name: string) => {
            target.append(name, value);
        });
    }
}
