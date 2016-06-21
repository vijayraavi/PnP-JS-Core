import { TypedHash } from "../collections/collections";

export interface LibraryConfiguration {
    headers?: TypedHash<string>;
    useSPRequestExecutor?: boolean;
}

export class RuntimeConfigImpl {
    private _headers: TypedHash<string>;

    private _useSPRequestExecutor: boolean;

    constructor() {
        this._headers = null;
        this._useSPRequestExecutor = false;
    }

    public set(config: LibraryConfiguration): void {

        // add any headers that are supplied
        if (config.hasOwnProperty("headers")) {
            this._headers = config.headers;
        }

        // set SP.RequestExecutor if configured
        if (config.hasOwnProperty("useSPRequestExecutor")) {
            this._useSPRequestExecutor = config.useSPRequestExecutor;
        }
    }

    public get headers(): TypedHash<string> {
        return this._headers;
    }

      public get useSPRequestExecutor(): boolean {
        return this._useSPRequestExecutor;
    }
}

let _runtimeConfig = new RuntimeConfigImpl();

export let RuntimeConfig = _runtimeConfig;

export function setRuntimeConfig(config: LibraryConfiguration): void {
    _runtimeConfig.set(config);
}
