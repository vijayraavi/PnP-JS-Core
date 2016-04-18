#PnP JavaScript Core#
##API Reference##

**Source**: [configuration.ts](../../../src/configuration/configuration.ts)

## Class: Settings
Creates a new instance of the settings class

### Settings.add(key, value) 

Adds a new single setting, or overwrites a previous setting with the same key

**Parameters**

**key**: `string`, The key used to store this setting

**value**: `string`, The setting value to store


### Settings.addJSON(key, value) 

Adds a JSON value to the collection as a string, you must use getJSON to rehydrate the object when read

**Parameters**

**key**: `string`, The key used to store this setting

**value**: `any`, The setting value to store


### Settings.apply(hash) 

Applies the supplied hash to the setting collection overwriting any existing value, or created new values

**Parameters**

**hash**: `Collections.TypedHash.&lt;any&gt;`, The set of values to add


### Settings.load(provider) 

Loads configuration settings into the collection from the supplied provider and returns a Promise

**Parameters**

**provider**: `IConfigurationProvider`, The provider from which we will load the settings


### Settings.get(key) 

Gets a value from the configuration

**Parameters**

**key**: `string`, The key whose value we want to return. Returns null if the key does not exist

**Returns**: `string`, string value from the configuration

### Settings.getJSON(key) 

Gets a JSON value, rehydrating the stored string to the original object

**Parameters**

**key**: `string`, The key whose value we want to return. Returns null if the key does not exist

**Returns**: `any`, object from the configuration