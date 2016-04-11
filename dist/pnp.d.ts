declare module "utils/util" {
    /**
     * Gets a callback function which will maintain context across async calls.
     * Allows for the calling pattern getCtxCallback(thisobj, method, methodarg1, methodarg2, ...)
     *
     * @param context The object that will be the 'this' value in the callback
     * @param method The method to which we will apply the context and parameters
     * @param params Optional, additional arguments to supply to the wrapped method when it is invoked
     */
    export function getCtxCallback(context: any, method: Function, ...params: any[]): Function;
    /**
     * Tests if a url param exists
     *
     * @param name The name of the url paramter to check
     */
    export function urlParamExists(name: string): boolean;
    /**
     * Gets a url param value by name
     *
     * @param name The name of the paramter for which we want the value
     */
    export function getUrlParamByName(name: string): string;
    /**
     * Gets a url param by name and attempts to parse a bool value
     *
     * @param name The name of the paramter for which we want the boolean value
     */
    export function getUrlParamBoolByName(name: string): boolean;
    /**
     * Inserts the string s into the string target as the index specified by index
     *
     * @param target The string into which we will insert s
     * @param index The location in target to insert s (zero based)
     * @param s The string to insert into target at position index
     */
    export function stringInsert(target: string, index: number, s: string): string;
    /**
     * Adds a value to a date
     *
     * @param date The date to which we will add units, done in local time
     * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
     * @param units The amount to add to date of the given interval
     *
     * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
     */
    export function dateAdd(date: Date, interval: string, units: number): Date;
    /**
     * Loads a stylesheet into the current page
     *
     * @param path The url to the stylesheet
     * @param avoidCache If true a value will be appended as a query string to avoid browser caching issues
     */
    export function loadStylesheet(path: string, avoidCache: boolean): void;
    /**
     * Combines an arbitrary set of paths ensuring that the slashes are normalized
     *
     * @param paths 0 to n path parts to combine
     */
    export function combinePaths(...paths: string[]): string;
    /**
     * Gets a random string of chars length
     *
     * @param chars The length of the random string to generate
     */
    export function getRandomString(chars: number): string;
    /**
     * Gets a random GUID value
     *
     * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     */
    export function getGUID(): string;
    /**
     * Determines if a given value is a function
     *
     * @param candidateFunction The thing to test for being a function
     */
    export function isFunction(candidateFunction: any): boolean;
    /**
     * Determines if a string is null or empty or undefined
     *
     * @param s The string to test
     */
    export function stringIsNullOrEmpty(s: string): boolean;
    /**
     * Provides functionality to extend the given object by doign a shallow copy
     *
     * @param target The object to which properties will be copied
     * @param source The source object from which properties will be copied
     * @param noOverwrite If true existing properties on the target are not overwritten from the source
     *
     */
    export function extend<T, S>(target: T, source: S, noOverwrite?: Boolean): T & S;
    /**
     * Applies one or more mixins to the supplied target
     *
     * @param derivedCtor The classto which we will apply the mixins
     * @param baseCtors One or more mixin classes to apply
     */
    export function applyMixins(derivedCtor: any, ...baseCtors: any[]): void;
    /**
     * Determines if a given url is absolute
     *
     * @param url The url to check to see if it is absolute
     */
    export function isUrlAbsolute(url: string): boolean;
}
declare module "sharepoint/provisioning/core/provisioningstep" {
    export class ProvisioningStep {
        private name;
        private index;
        private objects;
        private parameters;
        private handler;
        execute(dependentPromise?: any): any;
        constructor(name: string, index: number, objects: any, parameters: any, handler: any);
    }
}
declare module "sharepoint/util" {
    /**
     * Retrieves the list ID of the current page from _spPageContextInfo
     */
    export function getListId(): string;
    /**
     * Make URL relative to host
     *
     * @param url The URL to make relative
     */
    export function getRelativeUrl(url: string): string;
    /**
     * Retrieves the node with the given title from a collection of SP.NavigationNode
     */
    export function getNodeFromCollectionByTitle(nodeCollection: Array<SP.NavigationNode>, title: string): SP.NavigationNode;
    /**
     * Replaces URL tokens in a string
     */
    export function replaceUrlTokens(url: string): string;
    export function encodePropertyKey(propKey: any): string;
}
declare module "sharepoint/provisioning/resources/resources" {
    export var Code_execution_started: string;
    export var Code_execution_ended: string;
    export var Template_invalid: string;
}
declare module "sharepoint/provisioning/objecthandlers/objecthandlerbase/objecthandlerbase" {
    export class ObjectHandlerBase {
        private name;
        constructor(name: string);
        ProvisionObjects(objects: any, parameters?: any): Promise<{}>;
        scope_started(): void;
        scope_ended(): void;
    }
}
declare module "sharepoint/provisioning/objecthandlers/objectnavigation/objectnavigation" {
    import { ObjectHandlerBase } from "sharepoint/provisioning/objecthandlers/objecthandlerbase/objecthandlerbase";
    export class ObjectNavigation extends ObjectHandlerBase {
        constructor();
        ProvisionObjects(object: INavigation): Promise<{}>;
        private ConfigureQuickLaunch(nodes, clientContext, navigation);
    }
}
declare module "sharepoint/provisioning/objecthandlers/objectpropertybagentries/objectpropertybagentries" {
    import { ObjectHandlerBase } from "sharepoint/provisioning/objecthandlers/objecthandlerbase/objecthandlerbase";
    export class ObjectPropertyBagEntries extends ObjectHandlerBase {
        constructor();
        ProvisionObjects(entries: Array<IPropertyBagEntry>): Promise<{}>;
    }
}
declare module "sharepoint/provisioning/objecthandlers/objectfeatures/objectfeatures" {
    import { ObjectHandlerBase } from "sharepoint/provisioning/objecthandlers/objecthandlerbase/objecthandlerbase";
    export class ObjectFeatures extends ObjectHandlerBase {
        constructor();
        ProvisionObjects(features: Array<IFeature>): Promise<{}>;
    }
}
declare module "sharepoint/provisioning/objecthandlers/objectwebsettings/objectwebsettings" {
    import { ObjectHandlerBase } from "sharepoint/provisioning/objecthandlers/objecthandlerbase/objecthandlerbase";
    export class ObjectWebSettings extends ObjectHandlerBase {
        constructor();
        ProvisionObjects(object: IWebSettings): Promise<{}>;
    }
}
declare module "sharepoint/provisioning/objecthandlers/objectcomposedlook/objectcomposedlook" {
    import { ObjectHandlerBase } from "sharepoint/provisioning/objecthandlers/objecthandlerbase/objecthandlerbase";
    export class ObjectComposedLook extends ObjectHandlerBase {
        constructor();
        ProvisionObjects(object: IComposedLook): Promise<{}>;
    }
}
declare module "sharepoint/provisioning/objecthandlers/objectcustomactions/objectcustomactions" {
    import { ObjectHandlerBase } from "sharepoint/provisioning/objecthandlers/objecthandlerbase/objecthandlerbase";
    export class ObjectCustomActions extends ObjectHandlerBase {
        constructor();
        ProvisionObjects(customactions: Array<ICustomAction>): Promise<{}>;
    }
}
declare module "sharepoint/provisioning/objecthandlers/objectfiles/objectfiles" {
    import { ObjectHandlerBase } from "sharepoint/provisioning/objecthandlers/objecthandlerbase/objecthandlerbase";
    export class ObjectFiles extends ObjectHandlerBase {
        constructor();
        ProvisionObjects(objects: Array<IFile>): Promise<{}>;
        private RemoveWebPartsFromFileIfSpecified(clientContext, limitedWebPartManager, shouldRemoveExisting);
        private GetWebPartXml(webParts);
        private AddWebPartsToWebPartPage(dest, src, webParts, shouldRemoveExisting);
        private ApplyFileProperties(dest, fileProperties);
        private GetViewFromCollectionByUrl(viewCollection, url);
        private ModifyHiddenViews(objects);
        private GetFolderFromFilePath(filePath);
        private GetFilenameFromFilePath(filePath);
    }
}
declare module "sharepoint/provisioning/sequencer/sequencer" {
    export class Sequencer {
        private functions;
        private parameter;
        private scope;
        constructor(__functions: Array<any>, __parameter: any, __scope: any);
        execute(): Promise<{}>;
        private deferredArray(__functions);
    }
}
declare module "sharepoint/provisioning/objecthandlers/objectlists/objectlists" {
    import { ObjectHandlerBase } from "sharepoint/provisioning/objecthandlers/objecthandlerbase/objecthandlerbase";
    export class ObjectLists extends ObjectHandlerBase {
        constructor();
        ProvisionObjects(objects: Array<IListInstance>): Promise<{}>;
        private EnsureLocationBasedMetadataDefaultsReceiver(clientContext, list);
        private CreateFolders(params);
        private ApplyContentTypeBindings(params);
        private ApplyListInstanceFieldRefs(params);
        private ApplyFields(params);
        private ApplyLookupFields(params);
        private GetFieldXmlAttr(fieldXml, attr);
        private GetFieldXml(field, lists, list);
        private ApplyListSecurity(params);
        private CreateViews(params);
        private InsertDataRows(params);
    }
}
declare module "sharepoint/provisioning/core/core" {
    export class Core {
        private handlers;
        private options;
        private startTime;
        private queueItems;
        constructor();
        applyTemplate(path: string, _options?: IOptions): Promise<{}>;
        private start(json, queue);
    }
}
declare module "sharepoint/provisioning/logger/logger" {
    export class Logger {
        private isLoggerDefined;
        private spacing;
        private template;
        constructor();
        info(object: string, message: string): void;
        debug(object: string, message: string): void;
        error(object: string, message: string): void;
        private print(msg);
    }
}
declare module "sharepoint/provisioning/provisioning" {
    import { Core } from "sharepoint/provisioning/core/core";
    import { Logger } from "sharepoint/provisioning/logger/logger";
    export class Provisioning {
        core: Core;
    }
    export var Log: Logger;
}
declare module "collections/collections" {
    /**
     * Interface defining an object with a known property type
     */
    export interface ITypedHash<T> {
        [key: string]: T;
    }
    /**
     * Generic dictionary
     */
    export class Dictionary<T> {
        /**
         * Creates a new instance of the Dictionary<T> class
         *
         * @constructor
         */
        constructor();
        /**
         * The array used to store all the keys
         */
        private keys;
        /**
         * The array used to store all the values
         */
        private values;
        /**
         * Gets a value from the collection using the specified key
         *
         * @param key The key whose value we want to return, returns null if the key does not exist
         */
        get(key: string): T;
        /**
         * Adds the supplied key and value to the dictionary
         *
         * @param key The key to add
         * @param o The value to add
         */
        add(key: string, o: T): void;
        /**
         * Merges the supplied typed hash into this dictionary instance. Existing values are updated and new ones are created as appropriate.
         */
        merge(source: ITypedHash<T> | Dictionary<T>): void;
        /**
         * Removes a value from the dictionary
         *
         * @param key The key of the key/value pair to remove. Returns null if the key was not found.
         */
        remove(key: string): T;
        /**
         * Returns all the keys currently in the dictionary as an array
         */
        getKeys(): string[];
        /**
         * Returns all the values currently in the dictionary as an array
         */
        getValues(): T[];
        /**
         * Clears the current dictionary
         */
        clear(): void;
        /**
         * Gets a count of the items currently in the dictionary
         */
        count(): number;
    }
}
declare module "sharepoint/rest/queryable" {
    import { Dictionary } from "collections/collections";
    /**
     * Queryable Base Class
     *
     */
    export class Queryable {
        /**
         * Creates a new instance of the Queryable class
         *
         * @constructor
         * @param baseUrl A string or Queryable that should form the base part of the url
         *
         */
        constructor(baseUrl: string | Queryable, path?: string);
        /**
         * Tracks the query parts of the url
         */
        protected _query: Dictionary<string>;
        /**
         * Tracks the url as it is built
         */
        private _url;
        /**
         * Directly concatonates the supplied string to the current url, not normalizing "/" chars
         *
         * @param pathPart The string to concatonate to the url
         */
        protected concat(pathPart: string): void;
        /**
         * Appends the given string and normalizes "/" chars
         *
         * @param pathPart The string to append
         */
        protected append(pathPart: string): void;
        /**
         * Provides access to the query builder for this url
         *
         */
        query: Dictionary<string>;
        /**
         * Gets the currentl url, made server relative or absolute based on the availability of the _spPageContextInfo object
         *
         */
        toUrl(): string;
        /**
         * Gets the full url with query information
         *
         */
        toUrlAndQuery(): string;
    }
}
declare module "net/FetchClient" {
    import { HttpClientImpl } from "net/httpClient";
    export class FetchClient implements HttpClientImpl {
        fetch(url: string, options: any): Promise<Response>;
    }
}
declare module "net/digestCache" {
    import { Dictionary } from "collections/collections";
    import { HttpClient } from "net/httpClient";
    export class CachedDigest {
        expiration: Date;
        value: string;
    }
    export class DigestCache {
        private _httpClient;
        private _digests;
        constructor(_httpClient: HttpClient, _digests?: Dictionary<CachedDigest>);
        getDigest(webUrl: string): Promise<string>;
        clear(): void;
    }
}
declare module "net/httpClient" {
    import { FetchClient } from "net/FetchClient";
    export class HttpClient {
        private _impl;
        constructor(_impl?: FetchClient);
        private _digestCache;
        fetch(url: string, options?: any): Promise<Response>;
        fetchRaw(url: string, options?: any): Promise<Response>;
        get(url: string, options?: any): Promise<Response>;
        post(url: string, options?: any): Promise<Response>;
    }
    export interface HttpClientImpl {
        fetch(url: string, options: any): Promise<Response>;
    }
}
declare module "sharepoint/rest/mixins" {
    import { Queryable } from "sharepoint/rest/queryable";
    /**
     * Implements the $select functionality on classes to which it is applied
     *
     */
    export class Selectable extends Queryable {
        select(...selects: string[]): any;
    }
    /**
     * Implements the $filter functionality on classes to which it is applied
     *
     */
    export class Filterable extends Queryable {
        filter(filter: string): any;
    }
    /**
     * Implements the get http request on classes to which it is applied
     *
     */
    export class Gettable extends Queryable {
        get(parser?: (r: Response) => Promise<any>): Promise<any>;
    }
    /**
     * Implements the $top and $skip functionality on classes to which it is applied
     *
     */
    export class Pageable extends Queryable {
        top(pageSize: number): any;
        skip(pageStart: number): any;
    }
}
declare module "sharepoint/rest/actionables" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    /**
     * A Queryable which only exposes the get method
     *
     */
    export class Gettable<T> extends Queryable implements Mixins.Gettable {
        /**
         * Creates a new instance of the Gettable class
         *
         * @param baseUrl The url or Queryable which forms the parent of this actionable
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Execute the get request
         *
         */
        get(): Promise<T>;
    }
    /**
     * A Queryable which only exposes the get and select methods
     *
     */
    export class SelectableGettable<T> extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the SelectableGettable class
         *
         * @param baseUrl The url or Queryable which forms the parent of this actionable
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Gettable<T>;
        /**
         * Execute the get request
         *
         */
        get(): Promise<T>;
    }
    /**
     * A Queryable which only exposes the get and filter methods
     *
     */
    export class FilterableGettable<T> extends Queryable implements Mixins.Gettable, Mixins.Filterable {
        /**
         * Creates a new instance of the FilterableGettable class
         *
         * @param baseUrl The url or Queryable which forms the parent of this actionable
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): Gettable<T>;
        /**
         * Execute the get request
         *
         */
        get(): Promise<T>;
    }
    /**
     * A Queryable which only exposes the get, select and filter methods
     *
     */
    export class FilterableSelectableGettable<T> extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {
        /**
         * Creates a new instance of the FilterableSelectableGettable class
         *
         * @param baseUrl The url or Queryable which forms the parent of this actionable
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): FilterableGettable<T>;
        /**
         * Execute the get request
         *
         */
        get(): Promise<T>;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): SelectableGettable<T>;
    }
}
declare module "sharepoint/rest/files" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    import { Gettable } from "sharepoint/rest/actionables";
    /**
     * Describes a collection of File objects
     *
     */
    export class Files extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {
        /**
         * Creates a new instance of the Files class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Gets a File by filename
         *
         * @param name The name of the file, including extension
         */
        getByName(name: string): File;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Files;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): Files;
    }
    /**
     * Describes a single File instance
     *
     */
    export class File extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the File class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param path Optional, if supplied will be appended to the supplied baseUrl
         */
        constructor(baseUrl: string | Queryable, path?: string);
        /**
         * Gets the contents of the file - If the file is not JSON a custom parser function should be used with the get call
         *
         */
        value: Gettable<any>;
        /**
         * Gets a result indicating the current user who has a file checked out
         *
         */
        checkedOutByUser: Gettable<any>;
        /**
         * Gets the current eTag of a file
         *
         */
        eTag: Gettable<any>;
        /**
         * Gets the server relative url of a file
         *
         */
        serverRelativeUrl: Gettable<any>;
        /**
         * Gets a collection of versions
         *
         */
        versions: Versions;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): File;
    }
    /**
     * Describes a collection of Version objects
     *
     */
    export class Versions extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {
        /**
         * Creates a new instance of the File class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Gets a version by id
         *
         * @param versionId The id of the version to retrieve
         */
        getById(versionId: number): Version;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Versions;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): Versions;
    }
    /**
     * Describes a single Version instance
     *
     */
    export class Version extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the Version class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param path Optional, if supplied will be appended to the supplied baseUrl
         */
        constructor(baseUrl: string | Queryable, path?: string);
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Version;
    }
}
declare module "sharepoint/rest/folders" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    import { Files } from "sharepoint/rest/files";
    import { Gettable, SelectableGettable } from "sharepoint/rest/actionables";
    /**
     * Describes a collection of Folder objects
     *
     */
    export class Folders extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {
        /**
         * Creates a new instance of the Folders class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Gets a folder by folder name
         *
         */
        getByName(name: string): Folder;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Folders;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): Folders;
    }
    /**
     * Describes a single Folder instance
     *
     */
    export class Folder extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the Folder class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param path Optional, if supplied will be appended to the supplied baseUrl
         */
        constructor(baseUrl: string | Queryable, path?: string);
        /**
         * Gets the parent folder, if available
         *
         */
        parentFolder: Folder;
        /**
         * Gets this folder's sub folders
         *
         */
        folders: Folders;
        /**
         * Gets the folders name
         *
         */
        name: Gettable<any>;
        /**
         * Gets this folder's properties
         *
         */
        properties: SelectableGettable<any>;
        /**
         * Gets this folder's server relative url
         *
         */
        serverRelativeUrl: Gettable<any>;
        /**
         * Gets this folder's files
         *
         */
        files: Files;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Folder;
    }
}
declare module "sharepoint/rest/contenttypes" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    /**
     * Describes a collection of content types
     *
     */
    export class ContentTypes extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {
        /**
         * Creates a new instance of the ContentTypes class
         *
         * @param baseUrl The url or Queryable which forms the parent of this content types collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Gets a ContentType by content type id
         */
        getById(id: string): ContentType;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): ContentTypes;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): ContentTypes;
    }
    /**
     * Describes a single ContentType instance
     *
     */
    export class ContentType extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the ContentType class
         *
         * @param baseUrl The url or Queryable which forms the parent of this content type instance
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): ContentType;
    }
}
declare module "sharepoint/rest/roleassignments" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    /**
     * Describes a set of role assignments for the current scope
     *
     */
    export class RoleAssignments extends Queryable implements Mixins.Gettable, Mixins.Filterable, Mixins.Selectable {
        /**
         * Creates a new instance of the RoleAssignments class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): RoleAssignments;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): RoleAssignments;
    }
}
declare module "sharepoint/rest/items" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    import { Gettable, SelectableGettable, FilterableSelectableGettable } from "sharepoint/rest/actionables";
    import { Folder } from "sharepoint/rest/folders";
    import { ContentType } from "sharepoint/rest/contenttypes";
    import { RoleAssignments } from "sharepoint/rest/roleassignments";
    /**
     * Describes a collection of Item objects
     *
     */
    export class Items extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {
        /**
         * Creates a new instance of the Items class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Gets an Item by id
         *
         * @param id The integer id of the item to retrieve
         */
        getById(id: number): Item;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Items;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): Items;
    }
    /**
     * Descrines a single Item instance
     *
     */
    export class Item extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the Items class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Gets the set of attachments for this item
         *
         */
        attachmentFiles: FilterableSelectableGettable<any>;
        /**
         * Gets the content type for this item
         *
         */
        contentType: ContentType;
        /**
         * Gets the effective base permissions for the item
         *
         */
        effectiveBasePermissions: Gettable<any>;
        /**
         * Gets the effective base permissions for the item in a UI context
         *
         */
        effectiveBasePermissionsForUI: Gettable<any>;
        /**
         * Gets the field values for this list item in their HTML representation
         *
         */
        fieldValuesAsHTML: SelectableGettable<any>;
        /**
         * Gets the field values for this list item in their text representation
         *
         */
        fieldValuesAsText: SelectableGettable<any>;
        /**
         * Gets the field values for this list item for use in editing controls
         *
         */
        fieldValuesForEdit: SelectableGettable<any>;
        /**
         * Gets the closest securable up the security hierarchy whose permissions are applied to this list item
         *
         */
        firstUniqueAncestorSecurableObject: SelectableGettable<any>;
        /**
         * Gets the folder associated with this list item (if this item represents a folder)
         *
         */
        folder: Folder;
        /**
         * Gets the effective permissions for the user supplied
         *
         * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
         */
        getUserEffectivePermissions(loginName: string): Gettable<any>;
        /**
         * Gets the set of role assignments for this item
         *
         */
        roleAssignments: RoleAssignments;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Item;
    }
}
declare module "sharepoint/rest/views" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    /**
     * Describes the views available in the current context
     *
     */
    export class Views extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {
        /**
         * Creates a new instance of the Views class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Gets a view by guid id
         *
         * @param id The GUID id of the view
         */
        getById(id: string): View;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Views;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): Views;
    }
    /**
     * Describes a single View instance
     *
     */
    export class View extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the View class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): View;
    }
}
declare module "sharepoint/rest/fields" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    /**
     * Describes a collection of Field objects
     *
     */
    export class Fields extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {
        /**
         * Creates a new instance of the Fields class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Fields;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): Fields;
    }
    /**
     * Describes a single of Field instance
     *
     */
    export class Field extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the Field class
         *
         * @param baseUrl The url or Queryable which forms the parent of this field instance
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Field;
    }
}
declare module "sharepoint/rest/lists" {
    import { Items } from "sharepoint/rest/items";
    import { Views, View } from "sharepoint/rest/views";
    import { ContentTypes } from "sharepoint/rest/contenttypes";
    import { Fields } from "sharepoint/rest/fields";
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    import { Gettable, FilterableSelectableGettable } from "sharepoint/rest/actionables";
    /**
     * Describes a collection of List objects
     *
     */
    export class Lists extends Queryable implements Mixins.Gettable, Mixins.Selectable, Mixins.Filterable {
        /**
         * Creates a new instance of the Lists class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Gets a list from the collection by title
         *
         * @param title The title of the list
         */
        getByTitle(title: string): List;
        /**
         * Gets a list from the collection by guid id
         *
         * @param title The Id of the list
         */
        getById(id: string): List;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Lists;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): Lists;
    }
    /**
     * Describes a single List instance
     *
     */
    export class List extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the Lists class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param path Optional, if supplied will be appended to the supplied baseUrl
         */
        constructor(baseUrl: string | Queryable, path?: string);
        /**
         * Gets the content types in this list
         *
         */
        contentTypes: ContentTypes;
        /**
         * Gets the items in this list
         *
         */
        items: Items;
        /**
         * Gets the views in this list
         *
         */
        views: Views;
        /**
         * Gets the fields in this list
         *
         */
        fields: Fields;
        /**
         * Gets the default view of this list
         *
         */
        defaultView: Gettable<any>;
        /**
         * Gets the effective base permissions of this list
         *
         */
        effectiveBasePermissions: Gettable<any>;
        /**
         * Gets the event receivers attached to this list
         *
         */
        eventReceivers: FilterableSelectableGettable<any>;
        /**
         * Gets the related fields of this list
         *
         */
        getRelatedFields: Gettable<any>;
        /**
         * Gets the effective permissions for the user supplied
         *
         * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
         */
        getUserEffectivePermissions(loginName: string): Gettable<any>;
        /**
         * Gets the IRM settings for this list
         *
         */
        informationRightsManagementSettings: Gettable<any>;
        /**
         * Gets the user custom actions attached to this list
         *
         */
        userCustomActions: Gettable<any>;
        /**
         * Gets a view by view guid id
         *
         */
        getView(viewId: string): View;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): List;
    }
}
declare module "sharepoint/rest/quicklaunch" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    /**
     * Describes the quick launch navigation
     *
     */
    export class QuickLaunch extends Queryable implements Mixins.Gettable {
        /**
         * Creates a new instance of the Lists class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
    }
}
declare module "sharepoint/rest/topnavigationbar" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    /**
     * Describes the top navigation on the site
     *
     */
    export class TopNavigationBar extends Queryable implements Mixins.Gettable {
        /**
         * Creates a new instance of the SiteUsers class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
    }
}
declare module "sharepoint/rest/navigation" {
    import { Queryable } from "sharepoint/rest/queryable";
    import { QuickLaunch } from "sharepoint/rest/quicklaunch";
    import { TopNavigationBar } from "sharepoint/rest/topnavigationbar";
    /**
     * Exposes the navigation components
     *
     */
    export class Navigation extends Queryable {
        /**
         * Creates a new instance of the Lists class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Gets the quicklaunch navigation for the current context
         *
         */
        quicklaunch: QuickLaunch;
        /**
         * Gets the top bar navigation navigation for the current context
         *
         */
        topNavigationBar: TopNavigationBar;
    }
}
declare module "sharepoint/rest/siteusers" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    /**
     * Describes a collection of site users
     *
     */
    export class SiteUsers extends Queryable implements Mixins.Gettable, Mixins.Filterable, Mixins.Selectable {
        /**
         * Creates a new instance of the SiteUsers class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string | Queryable);
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        filter(filter: string): SiteUsers;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): SiteUsers;
    }
}
declare module "sharepoint/rest/webs" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    import { Lists } from "sharepoint/rest/lists";
    import { RoleAssignments } from "sharepoint/rest/roleassignments";
    import { Navigation } from "sharepoint/rest/navigation";
    import { SiteUsers } from "sharepoint/rest/siteusers";
    import { ContentTypes } from "sharepoint/rest/contenttypes";
    import { Folders, Folder } from "sharepoint/rest/folders";
    import { File } from "sharepoint/rest/files";
    /**
     * Describes a web
     *
     */
    export class Web extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the View class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param webPath Optional, specifies the path used to query for the given web, meant for internal use
         */
        constructor(baseUrl: string | Queryable, webPath?: string);
        /**
         * Get the content types available in this web
         *
         */
        contentTypes: ContentTypes;
        /**
         * Get the role assignments applied to this web
         *
         */
        roleAssignments: RoleAssignments;
        /**
         * Get the lists in this web
         *
         */
        lists: Lists;
        /**
         * Get the navigation options in this web
         *
         */
        navigation: Navigation;
        /**
         * Gets the site users
         *
         */
        siteUsers: SiteUsers;
        /**
         * Get the folders in this web
         *
         */
        folders: Folders;
        /**
         * Get a folder by server relative url
         *
         * @param folderRelativeUrl the server relative path to the folder (including /sites/ if applicable)
         */
        getFolderByServerRelativeUrl(folderRelativeUrl: string): Folder;
        /**
         * Get a file by server relative url
         *
         * @param fileRelativeUrl the server relative path to the file (including /sites/ if applicable)
         */
        getFileByServerRelativeUrl(fileRelativeUrl: string): File;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Web;
    }
}
declare module "sharepoint/rest/site" {
    import { Queryable } from "sharepoint/rest/queryable";
    import * as Mixins from "sharepoint/rest/mixins";
    import { Web } from "sharepoint/rest/webs";
    /**
     * Describes a site collection
     *
     */
    export class Site extends Queryable implements Mixins.Gettable, Mixins.Selectable {
        /**
         * Creates a new instance of the RoleAssignments class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        constructor(baseUrl: string);
        /**
         * Gets the root web of the site collection
         *
         */
        rootWeb: Web;
        /**
         * Execute the get request
         *
         */
        get(): Promise<any>;
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        select(...selects: string[]): Site;
    }
}
declare module "sharepoint/rest/rest" {
    import { Site } from "sharepoint/rest/site";
    import { Web } from "sharepoint/rest/webs";
    /**
     * Root of the SharePoint REST module
     */
    export class Rest {
        /**
         * Begins a site collection scoped REST request
         *
         * @param url The base url for the request, optional if running in the context of a page
         */
        site: Site;
        /**
         * Begins a web scoped REST request
         *
         * @param url The base url for the request, optional if running in the context of a page
         */
        web: Web;
        /**
         * Begins a cross-domain, host site scoped REST request, for use in add-in webs
         *
         * @param addInWebUrl The absolute url of the add-in web
         * @param hostWebUrl The absolute url of the host web
         */
        crossDomainSite(addInWebUrl: string, hostWebUrl: string): Site;
        /**
         * Begins a cross-domain, host web scoped REST request, for use in add-in webs
         *
         * @param addInWebUrl The absolute url of the add-in web
         * @param hostWebUrl The absolute url of the host web
         */
        crossDomainWeb(addInWebUrl: string, hostWebUrl: string): Web;
        /**
         * Implements the creation of cross domain REST urls
         *
         * @param factory The constructor of the object to create Site | Web
         * @param addInWebUrl The absolute url of the add-in web
         * @param hostWebUrl The absolute url of the host web
         * @param urlPart String part to append to the url "site" | "web"
         */
        private _cdImpl<T>(factory, addInWebUrl, hostWebUrl, urlPart);
    }
}
declare module "sharepoint/sharepoint" {
    import { Provisioning } from "sharepoint/provisioning/provisioning";
    import { Rest } from "sharepoint/rest/rest";
    import * as Util from "sharepoint/util";
    export class SharePoint {
        /**
         * The REST base class for SharePoint
         */
        rest: Rest;
        /**
        * The Provisioning base class for SharePoint
        */
        provisioning: Provisioning;
        util: typeof Util;
    }
}
declare module "utils/storage" {
    /**
     * A wrapper class to provide a consistent interface to browser based storage
     *
     */
    export class PnPClientStorageWrapper implements PnPClientStore {
        private store;
        defaultTimeoutMinutes: number;
        /**
         * True if the wrapped storage is available; otherwise, false
         */
        enabled: boolean;
        /**
         * Creates a new instance of the PnPClientStorageWrapper class
         *
         * @constructor
         */
        constructor(store: Storage, defaultTimeoutMinutes?: number);
        /**
         * Get a value from storage, or null if that value does not exist
         *
         * @param key The key whose value we want to retrieve
         */
        get(key: string): any;
        /**
         * Adds a value to the underlying storage
         *
         * @param key The key to use when storing the provided value
         * @param o The value to store
         * @param expire Optional, if provided the expiration of the item, otherwise the default is used
         */
        put(key: string, o: any, expire?: Date): void;
        /**
         * Deletes a value from the underlying storage
         *
         * @param key The key of the pair we want to remove from storage
         */
        delete(key: string): void;
        /**
         * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
         *
         * @param key The key to use when storing the provided value
         * @param getter A function which will upon execution provide the desired value
         * @param expire Optional, if provided the expiration of the item, otherwise the default is used
         */
        getOrPut(key: string, getter: Function, expire?: Date): any;
        /**
         * Used to determine if the wrapped storage is available currently
         */
        private test();
        /**
         * Creates the persistable to store
         */
        private createPersistable(o, expire?);
    }
    /**
     * Interface which defines the operations provided by a client storage object
     */
    export interface PnPClientStore {
        /**
         * True if the wrapped storage is available; otherwise, false
         */
        enabled: boolean;
        /**
         * Get a value from storage, or null if that value does not exist
         *
         * @param key The key whose value we want to retrieve
         */
        get(key: string): any;
        /**
         * Adds a value to the underlying storage
         *
         * @param key The key to use when storing the provided value
         * @param o The value to store
         * @param expire Optional, if provided the expiration of the item, otherwise the default is used
         */
        put(key: string, o: any, expire?: Date): void;
        /**
         * Deletes a value from the underlying storage
         *
         * @param key The key of the pair we want to remove from storage
         */
        delete(key: string): void;
        /**
         * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
         *
         * @param key The key to use when storing the provided value
         * @param getter A function which will upon execution provide the desired value
         * @param expire Optional, if provided the expiration of the item, otherwise the default is used
         */
        getOrPut(key: string, getter: Function, expire?: Date): any;
    }
    /**
     * A class that will establish wrappers for both local and session storage
     */
    export class PnPClientStorage {
        /**
         * Creates a new instance of the PnPClientStorage class
         *
         * @constructor
         */
        constructor();
        /**
         * Provides access to the local storage of the browser
         */
        local: PnPClientStore;
        /**
         * Provides access to the session storage of the browser
         */
        session: PnPClientStore;
    }
}
declare module "configuration/providers/cachingConfigurationProvider" {
    import { IConfigurationProvider } from "configuration/configuration";
    import { ITypedHash } from "collections/collections";
    import * as storage from "utils/storage";
    /**
     * A caching provider which can wrap other non-caching providers
     *
     */
    export default class CachingConfigurationProvider implements IConfigurationProvider {
        private wrappedProvider;
        private store;
        private cacheKey;
        /**
         * Creates a new caching configuration provider
         * @constructor
         * @param {IConfigurationProvider} wrappedProvider Provider which will be used to fetch the configuration
         * @param {string} cacheKey Key that will be used to store cached items to the cache
         * @param {IPnPClientStore} cacheStore OPTIONAL storage, which will be used to store cached settings.
         */
        constructor(wrappedProvider: IConfigurationProvider, cacheKey: string, cacheStore?: storage.PnPClientStore);
        /**
         * Gets the wrapped configuration providers
         *
         * @return {IConfigurationProvider} Wrapped configuration provider
         */
        getWrappedProvider(): IConfigurationProvider;
        /**
         * Loads the configuration values either from the cache or from the wrapped provider
         *
         * @return {Promise<ITypedHash<string>>} Promise of loaded configuration values
         */
        getConfiguration(): Promise<ITypedHash<string>>;
        private selectPnPCache();
    }
}
declare module "utils/ajax" {
    /**
     * Combines an arbitrary set of paths ensuring that the slashes are normalized
     *
     * @param paths 0 to n path parts to combine
     */
    export function get(url: string): any;
}
declare module "configuration/providers/spListConfigurationProvider" {
    import { IConfigurationProvider } from "configuration/configuration";
    import { ITypedHash } from "collections/collections";
    import { default as CachingConfigurationProvider } from "configuration/providers/cachingConfigurationProvider";
    /**
     * A configuration provider which loads configuration values from a SharePoint list
     *
     */
    export default class SPListConfigurationProvider implements IConfigurationProvider {
        private webUrl;
        private listTitle;
        /**
         * Creates a new SharePoint list based configuration provider
         * @constructor
         * @param {string} webUrl Url of the SharePoint site, where the configuration list is located
         * @param {string} listTitle Title of the SharePoint list, which contains the configuration settings (optional, default = "config")
         */
        constructor(webUrl: string, listTitle?: string);
        /**
         * Gets the url of the SharePoint site, where the configuration list is located
         *
         * @return {string} Url address of the site
         */
        getWebUrl(): string;
        /**
         * Gets the title of the SharePoint list, which contains the configuration settings
         *
         * @return {string} List title
         */
        getListTitle(): string;
        /**
         * Loads the configuration values from the SharePoint list
         *
         * @return {Promise<ITypedHash<string>>} Promise of loaded configuration values
         */
        getConfiguration(): Promise<ITypedHash<string>>;
        /**
         * Wraps the current provider in a cache enabled provider
         *
         * @return {CachingConfigurationProvider} Caching providers which wraps the current provider
         */
        asCaching(): CachingConfigurationProvider;
    }
}
declare module "configuration/providers/providers" {
    import { default as cachingConfigurationProvider } from "configuration/providers/cachingConfigurationProvider";
    import { default as spListConfigurationProvider } from "configuration/providers/spListConfigurationProvider";
    export let CachingConfigurationProvider: typeof cachingConfigurationProvider;
    export let SPListConfigurationProvider: typeof spListConfigurationProvider;
}
declare module "configuration/configuration" {
    import * as Collections from "collections/collections";
    import * as providers from "configuration/providers/providers";
    /**
     * Set of pre-defined providers which are available from this library
     */
    export let Providers: typeof providers;
    /**
     * Interface for configuration providers
     *
     */
    export interface IConfigurationProvider {
        /**
         * Gets the configuration from the provider
         */
        getConfiguration(): Promise<Collections.ITypedHash<string>>;
    }
    /**
     * Class used to manage the current application settings
     *
     */
    export class Settings {
        /**
         * Creates a new instance of the settings class
         *
         * @constructor
         */
        constructor();
        /**
         * The settings currently stored in this instance
         */
        private _settings;
        /**
         * Adds a new single setting, or overwrites a previous setting with the same key
         *
         * @param {string} key The key used to store this setting
         * @param {string} value The setting value to store
         */
        add(key: string, value: string): void;
        /**
         * Adds a JSON value to the collection as a string, you must use getJSON to rehydrate the object when read
         *
         * @param {string} key The key used to store this setting
         * @param {any} value The setting value to store
         */
        addJSON(key: string, value: any): void;
        /**
         * Applies the supplied hash to the setting collection overwriting any existing value, or created new values
         *
         * @param {Collections.ITypedHash<any>} hash The set of values to add
         */
        apply(hash: Collections.ITypedHash<any>): void;
        /**
         * Loads configuration settings into the collection from the supplied provider and returns a Promise
         *
         * @param {IConfigurationProvider} provider The provider from which we will load the settings
         */
        load(provider: IConfigurationProvider): Promise<void>;
        /**
         * Gets a value from the configuration
         *
         * @param {string} key The key whose value we want to return. Returns null if the key does not exist
         * @return {string} string value from the configuration
         */
        get(key: string): string;
        /**
         * Gets a JSON value, rehydrating the stored string to the original object
         *
         * @param {string} key The key whose value we want to return. Returns null if the key does not exist
         * @return {any} object from the configuration
         */
        getJSON(key: string): any;
    }
}
declare module "utils/args" {
    /**
     * Throws an exception if the supplied string value is null or emptry
     *
     * @param value The string to test
     * @param parameterName The name of the parameter, included in the thrown exception message
     */
    export function stringIsNullOrEmpty(value: string, parameterName: string): void;
    /**
     * Throws an exception if the supplied object is null
     *
     * @param value The object to test
     * @param parameterName The name of the parameter, included in the thrown exception message
     */
    export function objectIsNull(value: Object, parameterName: string): void;
}
declare module "utils/logging" {
    import Collections = require("collections/collections");
    /**
     * A set of logging levels
     *
     */
    export enum LogLevel {
        Verbose = 0,
        Info = 1,
        Warning = 2,
        Error = 3,
        Off = 99,
    }
    /**
     * Interface that defines a log entry
     *
     */
    export interface LogEntry {
        /**
         * The main message to be logged
         */
        message: string;
        /**
         * The level of information this message represents
         */
        level: LogLevel;
        /**
         * Any associated data that a given logging listener may choose to log or ignore
         */
        data?: Collections.ITypedHash<string>;
    }
    /**
     * Interface that defines a log listner
     *
     */
    export interface LogListener {
        /**
         * Any associated data that a given logging listener may choose to log or ignore
         *
         * @param entry The information to be logged
         */
        log(entry: LogEntry): void;
    }
    /**
     * Class used to subscribe ILogListener and log messages throughout an application
     *
     */
    export class Logger {
        activeLogLevel: LogLevel;
        private subscribers;
        /**
         * Creates a new instance of the Logger class
         *
         * @constructor
         * @param activeLogLevel the level used to filter messages (Default: LogLevel.Warning)
         * @param subscribers [Optional] if provided will initialize the array of subscribed listeners
         */
        constructor(activeLogLevel?: LogLevel, subscribers?: LogListener[]);
        /**
         * Adds an ILogListener instance to the set of subscribed listeners
         *
         */
        subscribe(listener: LogListener): void;
        /**
         * Gets the current subscriber count
         */
        count(): number;
        /**
         * Writes the supplied string to the subscribed listeners
         *
         * @param message The message to write
         * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Verbose)
         */
        write(message: string, level?: LogLevel): void;
        /**
         * Logs the supplied entry to the subscribed listeners
         *
         * @param entry The message to log
         */
        log(entry: LogEntry): void;
        /**
         * Logs performance tracking data for the the execution duration of the supplied function using console.profile
         *
         * @param name The name of this profile boundary
         * @param f The function to execute and track within this performance boundary
         */
        measure<T>(name: string, f: () => T): T;
    }
    /**
     * Implementation of ILogListener which logs to the browser console
     *
     */
    export class ConsoleListener implements LogListener {
        /**
         * Any associated data that a given logging listener may choose to log or ignore
         *
         * @param entry The information to be logged
         */
        log(entry: LogEntry): void;
        /**
         * Formats the message
         *
         * @param entry The information to format into a string
         */
        private format(entry);
    }
    /**
     * Implementation of ILogListener which logs to Azure Insights
     *
     */
    export class AzureInsightsListener implements LogListener {
        private azureInsightsInstrumentationKey;
        /**
         * Creats a new instance of the AzureInsightsListener class
         *
         * @constructor
         * @param azureInsightsInstrumentationKey The instrumentation key created when the Azure Insights instance was created
         */
        constructor(azureInsightsInstrumentationKey: string);
        /**
         * Any associated data that a given logging listener may choose to log or ignore
         *
         * @param entry The information to be logged
         */
        log(entry: LogEntry): void;
        /**
         * Formats the message
         *
         * @param entry The information to format into a string
         */
        private format(entry);
    }
    /**
     * Implementation of ILogListener which logs to the supplied function
     *
     */
    export class FunctionListener implements LogListener {
        private method;
        /**
         * Creates a new instance of the FunctionListener class
         *
         * @constructor
         * @param  method The method to which any logging data will be passed
         */
        constructor(method: (entry: LogEntry) => void);
        /**
         * Any associated data that a given logging listener may choose to log or ignore
         *
         * @param entry The information to be logged
         */
        log(entry: LogEntry): void;
    }
}
declare module "pnp" {
    import * as Util from "utils/util";
    import { SharePoint } from "sharepoint/sharepoint";
    import { PnPClientStorage } from "utils/storage";
    import * as Configuration from "configuration/configuration";
    import { Logger } from "utils/logging";
    /**
     * Root class of the Patterns and Practices namespace, provides an entry point to the library
     */
    class PnP {
        /**
         * Utility methods
         */
        static util: typeof Util;
        /**
         * SharePoint
         */
        static sharepoint: SharePoint;
        /**
         * Provides access to local and session storage through
         */
        static storage: PnPClientStorage;
        /**
         * Configuration
         */
        static configuration: typeof Configuration;
        /**
         * Global logging instance to which subscribers can be registered and messages written
         */
        static logging: Logger;
    }
    export = PnP;
}
declare module "collections/collections.test" {
}
declare module "mocks/MockConfigurationProvider" {
    import { IConfigurationProvider } from "configuration/configuration";
    import { ITypedHash } from "collections/collections";
    export default class MockConfigurationProvider implements IConfigurationProvider {
        mockValues: ITypedHash<string>;
        shouldThrow: boolean;
        shouldReject: boolean;
        constructor(mockValues?: ITypedHash<string>);
        getConfiguration(): Promise<ITypedHash<string>>;
    }
}
declare module "configuration/configuration.test" {
}
declare module "mocks/MockLocation" {
    class MockLocation implements Location {
        hash: string;
        host: string;
        hostname: string;
        href: string;
        origin: string;
        pathname: string;
        port: string;
        protocol: string;
        search: string;
        assign(url: string): void;
        reload(forcedReload?: boolean): void;
        replace(url: string): void;
        toString(): string;
    }
    export = MockLocation;
}
declare module "mocks/MockStorage" {
    class MockStorage implements Storage {
        constructor();
        private _store;
        length: number;
        clear(): void;
        getItem(key: string): any;
        key(index: number): string;
        removeItem(key: string): void;
        setItem(key: string, data: string): void;
        [key: string]: any;
        [index: number]: string;
    }
    export = MockStorage;
}
declare module "utils/args.test" {
}
declare module "utils/logging.test" {
}
declare module "utils/storage.test" {
}
declare module "utils/util.test" {
}
declare module "configuration/providers/cachingConfigurationProvider.test" {
}
declare module "configuration/providers/spListConfigurationProvider.test" {
}
declare module "sharepoint/rest/tests/contenttypes.test" {
}
declare module "sharepoint/rest/tests/fields.test" {
}
declare module "sharepoint/rest/tests/items.test" {
}
declare module "sharepoint/rest/tests/lists.test" {
}
declare module "sharepoint/rest/tests/navigation.test" {
}
declare module "sharepoint/rest/tests/quicklaunch.test" {
}
declare module "sharepoint/rest/tests/roleassignments.test" {
}
declare module "sharepoint/rest/tests/siteusers.test" {
}
declare module "sharepoint/rest/tests/topnavigationbar.test" {
}
declare module "sharepoint/rest/tests/views.test" {
}
declare module "sharepoint/rest/tests/web.test" {
}
