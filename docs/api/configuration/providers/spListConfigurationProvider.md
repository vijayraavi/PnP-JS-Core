#PnP JavaScript Core#
##API Reference##

**Source**: [spListConfigurationProvider.ts](../../../../src/configuration/providers/spListConfigurationProvider.ts)

## Class: SPListConfigurationProvider

### Constructor ###
Creates a new SharePoint list based configuration provider

**Parameters**

**webUrl**: `string`, Url of the SharePoint site, where the configuration list is located

**listTitle**: `string`, Title of the SharePoint list, which contains the configuration settings (optional, default = "config")

### SPListConfigurationProvider.getWebUrl() 

Gets the url of the SharePoint site, where the configuration list is located

**Returns**: `string`, Url address of the site

### SPListConfigurationProvider.getListTitle() 

Gets the title of the SharePoint list, which contains the configuration settings

**Returns**: `string`, List title

### SPListConfigurationProvider.getConfiguration() 

Loads the configuration values from the SharePoint list

**Returns**: `Promise<ITypedHash<string>>`, Promise of loaded configuration values

### SPListConfigurationProvider.asCaching() 

Wraps the current provider in a cache enabled provider

**Returns**: `CachingConfigurationProvider`, Caching providers which wraps the current provider

