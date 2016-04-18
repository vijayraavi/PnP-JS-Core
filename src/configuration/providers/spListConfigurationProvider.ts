import {IConfigurationProvider} from "../configuration";
import {TypedHash} from "../../collections/collections";
import { default as CachingConfigurationProvider } from "./cachingConfigurationProvider";
import * as ajax from "../../Utils/Ajax";

/** 
 * A configuration provider which loads configuration values from a SharePoint list
 *
 */
export default class SPListConfigurationProvider implements IConfigurationProvider {
    /**
     * Creates a new SharePoint list based configuration provider
     * @constructor
     * @param {string} webUrl Url of the SharePoint site, where the configuration list is located
     * @param {string} listTitle Title of the SharePoint list, which contains the configuration settings (optional, default = "config")
     */
    constructor(private webUrl: string, private listTitle = "config") {
    }

    /**
     * Gets the url of the SharePoint site, where the configuration list is located
     * 
     * @return {string} Url address of the site
     */
    public getWebUrl(): string {
        return this.webUrl;
    }

    /**
     * Gets the title of the SharePoint list, which contains the configuration settings
     * 
     * @return {string} List title
     */
    public getListTitle(): string {
        return this.listTitle;
    }

    /**
     * Loads the configuration values from the SharePoint list
     * 
     * @return {Promise<TypedHash<string>>} Promise of loaded configuration values
     */
    public getConfiguration(): Promise<TypedHash<string>> {
        return new Promise((resolve, reject) => {
            let url = `${ this.webUrl }/_api/web/lists/getByTitle('${ this.listTitle }')/items?$select=Title,Value`;
            ajax.get(url).success(data => {
                let results: any = (data.d.hasOwnProperty("results")) ? data.d.results : data.d;
                let configuration: TypedHash<string> = {};
                results.forEach(i => {
                    configuration[i.Title] = i.Value;
                });
                resolve(configuration);
            });
        });
    }

    /**
     * Wraps the current provider in a cache enabled provider
     * 
     * @return {CachingConfigurationProvider} Caching providers which wraps the current provider
     */
    public asCaching(): CachingConfigurationProvider {
        let cacheKey = `splist_${ this.webUrl}+${ this.listTitle }`;
        return new CachingConfigurationProvider(this, cacheKey);
    }
}
