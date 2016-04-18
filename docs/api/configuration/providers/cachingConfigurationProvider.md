#PnP JavaScript Core#
##API Reference##


**Source**: [cachingConfigurationProvider.ts](../../../../src/configuration/providers/cachingConfigurationProvider.ts)

## Class: CachingConfigurationProvider

### Constructor ###
Creates a new caching configuration provider

**Parameters**

**wrappedProvider**: `IConfigurationProvider`, Provider which will be used to fetch the configuration

**cacheKey**: `string`, Key that will be used to store cached items to the cache

**cacheStore**: `IPnPClientStore`, OPTIONAL storage, which will be used to store cached settings. 

### CachingConfigurationProvider.getWrappedProvider() 

Gets the wrapped configuration providers

**Returns**: `IConfigurationProvider`, wrapped configuration provider

### CachingConfigurationProvider.getConfiguration() 

Loads the configuration values either from the cache or from the wrapped provider

**Returns**: `Promise<TypedHash<string>>`, , Promise of loaded configuration values
