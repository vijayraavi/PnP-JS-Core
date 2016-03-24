#PnP JavaScript Core#
##API Reference - Configuration##

Object, contains utilities to provide configuration settings for your application.

**Source**: [configuration.ts](../../../src/configuration/configuration.ts)

###Exports###

Name | Description
---- | -----------
[Providers](providers/providers.md) | Providers, which can be used to load configuration settings from various sources (for example from a SharePoint list)
[IConfigurationProvider](IConfigurationProvider.md) | TypeScript interface which needs to be implemented when creating a custom configuration provider
[Settings](settings.md) | Class, Entry-point for providing settings for your application

### Examples ####

#### Example 1 (JavaScript): Reading configuration values from a SharePoint list: ####

The following example loads the configuration settings from a list called 'Settings' which exists in a global configuration site collection. The list must contain two text fields: 'Title' and 'Value'. Note that this list is accessed in an asynchronous manner and therefore you must provide a callback function which should be executed when the loaded settings are available.

The example also utilizes the possibility to cache loaded configuration values. When a provider is utilized like this, the loaded settings are cached in the browser's local storage for a period of time (default xx minutes) from where they are automatically loaded in subsequent page requests.

```javascript
var webUrl = "https://contoso.sharepoint.com/sites/globalConfig";
var listTitle = "Settings";
var settings = new PnP.configuration.Settings();
var provider = (new PnP.configuration.Providers.SPListConfigurationProvider(webUrl, listTitle)).asCaching();
settings.load(provider).then(function() {
	var value1 = settings.get("key1");
	var value2 = settings.get("key2");
	...
});

```
