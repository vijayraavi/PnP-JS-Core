import { TypedHash } from "../collections/collections";
import { HttpClientImpl } from "../net/httpclient";
import { FetchClient } from "../net/fetchclient";
import { SPFXContext } from "./spfxContextInterface";
import { GraphHttpClientImpl } from "../net/graphclient";

export interface LibraryConfiguration {

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
     * If true a timeout expired items will be removed from the cache in intervals determined by cacheTimeoutInterval
     */
    enableCacheExpiration?: boolean;

    /**
     * Determines the interval in milliseconds at which the cache is checked to see if items have expired (min: 100)
     */
    cacheExpirationIntervalMilliseconds?: number;

    /**
     * SharePoint specific library settings
     */
    sp?: {

        /**
         * Any headers to apply to all requests
         */
        headers?: TypedHash<string>;

        /**
         * Defines a factory method used to create fetch clients
         */
        fetchClientFactory?: () => HttpClientImpl;

        /**
         * The base url used for all requests
         */
        baseUrl?: string;
    };

    /**
     * MS Graph specific library settings
     */
    graph?: {

        /**
         * Any headers to apply to all requests
         */
        headers?: TypedHash<string>;

        /**
         * Defines a factory method used to create fetch clients
         */
        fetchClientFactory?: () => GraphHttpClientImpl;
    };

    /**
     * Used to supply the current context from an SPFx webpart to the library
     */
    spfxContext?: any;
}

export class RuntimeConfigImpl {

    private _defaultCachingStore: "session" | "local";
    private _defaultCachingTimeoutSeconds: number;
    private _globalCacheDisable: boolean;
    private _enableCacheExpiration: boolean;
    private _cacheExpirationIntervalMilliseconds: number;
    private _spfxContext: SPFXContext;

    // sharepoint settings
    private _spFetchClientFactory: () => HttpClientImpl;
    private _spBaseUrl: string;
    private _spHeaders: TypedHash<string>;

    // graph settings
    private _graphHeaders: TypedHash<string>;
    private _graphFetchClientFactory: () => GraphHttpClientImpl;


    constructor() {
        // these are our default values for the library
        this._defaultCachingStore = "session";
        this._defaultCachingTimeoutSeconds = 60;
        this._globalCacheDisable = false;
        this._enableCacheExpiration = false;
        this._cacheExpirationIntervalMilliseconds = 750;
        this._spfxContext = null;

        // sharepoint settings
        this._spFetchClientFactory = () => new FetchClient();
        this._spBaseUrl = null;
        this._spHeaders = null;

        // ms graph settings
        this._graphHeaders = null;
        this._graphFetchClientFactory = () => null;
    }

    public set(config: LibraryConfiguration): void {

        if (config.hasOwnProperty("globalCacheDisable")) {
            this._globalCacheDisable = config.globalCacheDisable;
        }

        if (config.hasOwnProperty("defaultCachingStore")) {
            this._defaultCachingStore = config.defaultCachingStore;
        }

        if (config.hasOwnProperty("defaultCachingTimeoutSeconds")) {
            this._defaultCachingTimeoutSeconds = config.defaultCachingTimeoutSeconds;
        }

        if (config.hasOwnProperty("sp")) {

            if (config.sp.hasOwnProperty("fetchClientFactory")) {
                this._spFetchClientFactory = config.sp.fetchClientFactory;
            }

            if (config.sp.hasOwnProperty("baseUrl")) {
                this._spBaseUrl = config.sp.baseUrl;
            }

            if (config.sp.hasOwnProperty("headers")) {
                this._spHeaders = config.sp.headers;
            }
        }

        if (config.hasOwnProperty("spfxContext")) {

            this._spfxContext = config.spfxContext;

            if (typeof this._spfxContext.graphHttpClient !== "undefined") {
                this._graphFetchClientFactory = () => this._spfxContext.graphHttpClient;
            }
        }

        if (config.hasOwnProperty("graph")) {

            if (config.graph.hasOwnProperty("headers")) {
                this._graphHeaders = config.graph.headers;
            }

            // this comes after the default setting of the _graphFetchClientFactory client so it can be overwritten
            if (config.graph.hasOwnProperty("fetchClientFactory")) {
                this._graphFetchClientFactory = config.graph.fetchClientFactory;
            }
        }

        if (config.hasOwnProperty("enableCacheExpiration")) {
            this._enableCacheExpiration = config.enableCacheExpiration;
        }

        if (config.hasOwnProperty("cacheExpirationIntervalMilliseconds")) {
            // we don't let the interval be less than 300 milliseconds
            const interval = config.cacheExpirationIntervalMilliseconds < 300 ? 300 : config.cacheExpirationIntervalMilliseconds;
            this._cacheExpirationIntervalMilliseconds = interval;
        }
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

    public get spFetchClientFactory(): () => HttpClientImpl {
        return this._spFetchClientFactory;
    }

    public get spBaseUrl(): string {

        if (this._spBaseUrl !== null) {

            return this._spBaseUrl;

        } else if (this._spfxContext !== null) {

            return this._spfxContext.pageContext.web.absoluteUrl;
        }

        return null;
    }

    public get spHeaders(): TypedHash<string> {
        return this._spHeaders;
    }

    public get enableCacheExpiration(): boolean {
        return this._enableCacheExpiration;
    }

    public get cacheExpirationIntervalMilliseconds(): number {
        return this._cacheExpirationIntervalMilliseconds;
    }

    public get spfxContext(): SPFXContext {
        return this._spfxContext;
    }

    public get graphFetchClientFactory(): () => GraphHttpClientImpl {
        return this._graphFetchClientFactory;
    }

    public get graphHeaders(): TypedHash<string> {
        return this._graphHeaders;
    }
}

const _runtimeConfig = new RuntimeConfigImpl();

export let RuntimeConfig = _runtimeConfig;

export function setRuntimeConfig(config: LibraryConfiguration): void {
    _runtimeConfig.set(config);
}
