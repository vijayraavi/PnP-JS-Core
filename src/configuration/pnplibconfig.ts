import { TypedHash } from "../collections/collections";

export interface LibraryConfiguration {

    /**
     * Any headers to apply to all requests
     */
    headers?: TypedHash<string>;

    /**
     * Allows caching to be global disabled, default: false
     */
    globalCacheDisable?: boolean;

    /**
     * Defines the default store used by the usingCaching method, default: session
     */
    defaultCachingStore?: "session" | "local";

    /**
     * Defines the default timeout in seconds used by the usingCaching method, default 30
     */
    defaultCachingTimeoutSeconds?: number;

    /**
     * If true the SP.RequestExecutor will be used to make the requests, you must include the required external libs
     */
    useSPRequestExecutor?: boolean;
}

export class RuntimeConfigImpl {

    constructor() {
        // these are our default values for the library
        this._headers = null;
        this._defaultCachingStore = "session";
        this._defaultCachingTimeoutSeconds = 30;
        this._globalCacheDisable = false;
        this._useSPRequestExecutor = false;
    }

    private _headers: TypedHash<string>;
    private _defaultCachingStore: "session" | "local";
    private _defaultCachingTimeoutSeconds: number;
    private _globalCacheDisable: boolean;
    private _useSPRequestExecutor;

    public set(config: LibraryConfiguration): void {

        if (config.hasOwnProperty("headers")) {
            this._headers = config.headers;
        }

        if (config.hasOwnProperty("globalCacheDisable")) {
            this._globalCacheDisable = config.globalCacheDisable;
        }

        if (config.hasOwnProperty("defaultCachingStore")) {
            this._defaultCachingStore = config.defaultCachingStore;
        }

        if (config.hasOwnProperty("defaultCachingTimeoutSeconds")) {
            this._defaultCachingTimeoutSeconds = config.defaultCachingTimeoutSeconds;
        }

        if (config.hasOwnProperty("useSPRequestExecutor")) {
            this._useSPRequestExecutor = config.useSPRequestExecutor;

        }
    }

    public get headers(): TypedHash<string> {
        return this._headers;
    }

    public get defaultCachingStore(): "session" | "local" {
        return this._defaultCachingStore;
    }

    public get defaultCachingTimeoutSeconds(): number {
        return this._defaultCachingTimeoutSeconds;
    }

    public get globalCacheDisable(): boolean {
        return this._globalCacheDisable;
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
