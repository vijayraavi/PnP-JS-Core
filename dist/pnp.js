/**
 * sp-pnp-js v0.0.5 - A reusable JavaScript library targeting SharePoint client-side development.
 * Copyright (c) 2016 Microsoft and other contributors
 * MIT
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.$pnp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./ProvisioningStep", "../ObjectHandlers/ObjectNavigation/ObjectNavigation", "../ObjectHandlers/ObjectPropertyBagEntries/ObjectPropertyBagEntries", "../ObjectHandlers/ObjectFeatures/ObjectFeatures", "../ObjectHandlers/ObjectWebSettings/ObjectWebSettings", "../ObjectHandlers/ObjectComposedLook/ObjectComposedLook", "../ObjectHandlers/ObjectCustomActions/ObjectCustomActions", "../ObjectHandlers/ObjectFiles/ObjectFiles", "../ObjectHandlers/ObjectLists/ObjectLists", "../../../sharepoint/util", "../Resources/Resources", "../Provisioning"], factory);
    }
})(function (require, exports) {
    "use strict";
    /// <reference path="..\schema\schema.d.ts" />
    /// <reference path="iwaitmessageoptions.d.ts" />
    /// <reference path="ioptions.d.ts" />
    /// <reference path="../../../utils/util" />
    // import { Promise } from "es6-promise";
    var ProvisioningStep_1 = require("./ProvisioningStep");
    var ObjectNavigation_1 = require("../ObjectHandlers/ObjectNavigation/ObjectNavigation");
    var ObjectPropertyBagEntries_1 = require("../ObjectHandlers/ObjectPropertyBagEntries/ObjectPropertyBagEntries");
    var ObjectFeatures_1 = require("../ObjectHandlers/ObjectFeatures/ObjectFeatures");
    var ObjectWebSettings_1 = require("../ObjectHandlers/ObjectWebSettings/ObjectWebSettings");
    var ObjectComposedLook_1 = require("../ObjectHandlers/ObjectComposedLook/ObjectComposedLook");
    var ObjectCustomActions_1 = require("../ObjectHandlers/ObjectCustomActions/ObjectCustomActions");
    var ObjectFiles_1 = require("../ObjectHandlers/ObjectFiles/ObjectFiles");
    var ObjectLists_1 = require("../ObjectHandlers/ObjectLists/ObjectLists");
    var util_1 = require("../../../sharepoint/util");
    var Resources = require("../Resources/Resources");
    var Provisioning_1 = require("../Provisioning");
    var Core = (function () {
        function Core() {
            this.handlers = {
                "Navigation": ObjectNavigation_1.ObjectNavigation,
                "PropertyBagEntries": ObjectPropertyBagEntries_1.ObjectPropertyBagEntries,
                "Features": ObjectFeatures_1.ObjectFeatures,
                "WebSettings": ObjectWebSettings_1.ObjectWebSettings,
                "ComposedLook": ObjectComposedLook_1.ObjectComposedLook,
                "CustomActions": ObjectCustomActions_1.ObjectCustomActions,
                "Files": ObjectFiles_1.ObjectFiles,
                "Lists": ObjectLists_1.ObjectLists,
            };
        }
        Core.prototype.applyTemplate = function (path, _options) {
            var _this = this;
            var url = util_1.replaceUrlTokens(path);
            this.options = _options || {};
            return new Promise(function (resolve, reject) {
                jQuery.getJSON(url, function (template) {
                    _this.start(template, Object.keys(template)).then(resolve, resolve);
                }).fail(function () {
                    Provisioning_1.Log.error("Provisioning", Resources.Template_invalid);
                });
            });
        };
        Core.prototype.start = function (json, queue) {
            var _this = this;
            Provisioning_1.Log.info("Provisioning", Resources.Code_execution_started);
            return new Promise(function (resolve, reject) {
                _this.startTime = new Date().getTime();
                _this.queueItems = [];
                queue.forEach(function (q, index) {
                    if (!_this.handlers[q]) {
                        return;
                    }
                    _this.queueItems.push(new ProvisioningStep_1.ProvisioningStep(q, index, json[q], json.Parameters, _this.handlers[q]));
                });
                var promises = [];
                promises.push(jQuery.Deferred());
                promises[0].resolve();
                promises[0].promise();
                var index = 1;
                while (_this.queueItems[index - 1] !== undefined) {
                    var i = promises.length - 1;
                    promises.push(_this.queueItems[index - 1].execute(promises[i]));
                    index++;
                }
                ;
                Promise.all(promises).then(function () {
                    Provisioning_1.Log.info("Provisioning", Resources.Code_execution_ended);
                }, function () {
                    Provisioning_1.Log.info("Provisioning", Resources.Code_execution_ended);
                });
            });
        };
        return Core;
    }());
    exports.Core = Core;
});

},{"../../../sharepoint/util":50,"../ObjectHandlers/ObjectComposedLook/ObjectComposedLook":4,"../ObjectHandlers/ObjectCustomActions/ObjectCustomActions":5,"../ObjectHandlers/ObjectFeatures/ObjectFeatures":6,"../ObjectHandlers/ObjectFiles/ObjectFiles":7,"../ObjectHandlers/ObjectLists/ObjectLists":9,"../ObjectHandlers/ObjectNavigation/ObjectNavigation":10,"../ObjectHandlers/ObjectPropertyBagEntries/ObjectPropertyBagEntries":11,"../ObjectHandlers/ObjectWebSettings/ObjectWebSettings":12,"../Provisioning":13,"../Resources/Resources":14,"./ProvisioningStep":2}],2:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ProvisioningStep = (function () {
        function ProvisioningStep(name, index, objects, parameters, handler) {
            this.name = name;
            this.index = index;
            this.objects = objects;
            this.parameters = parameters;
            this.handler = handler;
        }
        ProvisioningStep.prototype.execute = function (dependentPromise) {
            var _this = this;
            var _handler = new this.handler();
            if (!dependentPromise) {
                return _handler.ProvisionObjects(this.objects, this.parameters);
            }
            return new Promise(function (resolve, reject) {
                dependentPromise.then(function () {
                    return _handler.ProvisionObjects(_this.objects, _this.parameters).then(resolve, resolve);
                });
            });
        };
        return ProvisioningStep;
    }());
    exports.ProvisioningStep = ProvisioningStep;
});

},{}],3:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Logger = (function () {
        function Logger() {
            this.isLoggerDefined = false;
            if (console && console.log) {
                this.isLoggerDefined = true;
            }
            this.spacing = "\t\t";
            this.template = "{0} " + this.spacing + " [{1}] " + this.spacing + " [{2}] " + this.spacing + " {3}";
        }
        Logger.prototype.info = function (object, message) {
            this.print(String.format(this.template, new Date(), object, "Information", message));
        };
        Logger.prototype.debug = function (object, message) {
            this.print(String.format(this.template, new Date(), object, "Debug", message));
        };
        Logger.prototype.error = function (object, message) {
            this.print(String.format(this.template, new Date(), object, "Error", message));
        };
        Logger.prototype.print = function (msg) {
            if (this.isLoggerDefined) {
                console.log(msg);
            }
        };
        return Logger;
    }());
    exports.Logger = Logger;
});

},{}],4:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../util", "../ObjectHandlerBase/ObjectHandlerBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    /// <reference path="..\schema\icomposedlook.d.ts" />
    /// <reference path="../../../utils/util" />
    var util_1 = require("../../../util");
    var ObjectHandlerBase_1 = require("../ObjectHandlerBase/ObjectHandlerBase");
    var ObjectComposedLook = (function (_super) {
        __extends(ObjectComposedLook, _super);
        function ObjectComposedLook() {
            _super.call(this, "ComposedLook");
        }
        ObjectComposedLook.prototype.ProvisionObjects = function (object) {
            var _this = this;
            _super.prototype.scope_started.call(this);
            return new Promise(function (resolve, reject) {
                var clientContext = SP.ClientContext.get_current();
                var web = clientContext.get_web();
                var colorPaletteUrl = object.ColorPaletteUrl ? util_1.replaceUrlTokens(object.ColorPaletteUrl) : "";
                var fontSchemeUrl = object.FontSchemeUrl ? util_1.replaceUrlTokens(object.FontSchemeUrl) : "";
                var backgroundImageUrl = object.BackgroundImageUrl ? util_1.replaceUrlTokens(object.BackgroundImageUrl) : null;
                web.applyTheme(util_1.getRelativeUrl(colorPaletteUrl), util_1.getRelativeUrl(fontSchemeUrl), backgroundImageUrl, true);
                web.update();
                clientContext.executeQueryAsync(function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                }, function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                });
            });
        };
        return ObjectComposedLook;
    }(ObjectHandlerBase_1.ObjectHandlerBase));
    exports.ObjectComposedLook = ObjectComposedLook;
});

},{"../../../util":39,"../ObjectHandlerBase/ObjectHandlerBase":8}],5:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../ObjectHandlerBase/ObjectHandlerBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    /// <reference path="..\schema\icustomaction.d.ts" />
    // import { Promise } from "es6-promise";
    var ObjectHandlerBase_1 = require("../ObjectHandlerBase/ObjectHandlerBase");
    var ObjectCustomActions = (function (_super) {
        __extends(ObjectCustomActions, _super);
        function ObjectCustomActions() {
            _super.call(this, "CustomActions");
        }
        ObjectCustomActions.prototype.ProvisionObjects = function (customactions) {
            var _this = this;
            _super.prototype.scope_started.call(this);
            return new Promise(function (resolve, reject) {
                var clientContext = SP.ClientContext.get_current();
                var userCustomActions = clientContext.get_web().get_userCustomActions();
                clientContext.load(userCustomActions);
                clientContext.executeQueryAsync(function () {
                    customactions.forEach(function (obj) {
                        var objExists = jQuery.grep(userCustomActions.get_data(), function (userCustomAction) {
                            return userCustomAction.get_title() === obj.Title;
                        }).length > 0;
                        if (!objExists) {
                            var objCreationInformation = userCustomActions.add();
                            if (obj.Description) {
                                objCreationInformation.set_description(obj.Description);
                            }
                            if (obj.CommandUIExtension) {
                                objCreationInformation.set_commandUIExtension(obj.CommandUIExtension);
                            }
                            if (obj.Group) {
                                objCreationInformation.set_group(obj.Group);
                            }
                            if (obj.Title) {
                                objCreationInformation.set_title(obj.Title);
                            }
                            if (obj.Url) {
                                objCreationInformation.set_url(obj.Url);
                            }
                            if (obj.ScriptBlock) {
                                objCreationInformation.set_scriptBlock(obj.ScriptBlock);
                            }
                            if (obj.ScriptSrc) {
                                objCreationInformation.set_scriptSrc(obj.ScriptSrc);
                            }
                            if (obj.Location) {
                                objCreationInformation.set_location(obj.Location);
                            }
                            if (obj.ImageUrl) {
                                objCreationInformation.set_imageUrl(obj.ImageUrl);
                            }
                            if (obj.Name) {
                                objCreationInformation.set_name(obj.Name);
                            }
                            if (obj.RegistrationId) {
                                objCreationInformation.set_registrationId(obj.RegistrationId);
                            }
                            if (obj.RegistrationType) {
                                objCreationInformation.set_registrationType(obj.RegistrationType);
                            }
                            if (obj.Rights) {
                                objCreationInformation.set_rights(obj.Rights);
                            }
                            if (obj.Sequence) {
                                objCreationInformation.set_sequence(obj.Sequence);
                            }
                            objCreationInformation.update();
                        }
                    });
                    clientContext.executeQueryAsync(function () {
                        _super.prototype.scope_ended.call(_this);
                        resolve();
                    }, function () {
                        _super.prototype.scope_ended.call(_this);
                        resolve();
                    });
                }, function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                });
            });
        };
        return ObjectCustomActions;
    }(ObjectHandlerBase_1.ObjectHandlerBase));
    exports.ObjectCustomActions = ObjectCustomActions;
});

},{"../ObjectHandlerBase/ObjectHandlerBase":8}],6:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../ObjectHandlerBase/ObjectHandlerBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    /// <reference path="..\schema\ifeature.d.ts" />
    // import { Promise } from "es6-promise";
    var ObjectHandlerBase_1 = require("../ObjectHandlerBase/ObjectHandlerBase");
    var ObjectFeatures = (function (_super) {
        __extends(ObjectFeatures, _super);
        function ObjectFeatures() {
            _super.call(this, "Features");
        }
        ObjectFeatures.prototype.ProvisionObjects = function (features) {
            var _this = this;
            _super.prototype.scope_started.call(this);
            return new Promise(function (resolve, reject) {
                var clientContext = SP.ClientContext.get_current();
                var web = clientContext.get_web();
                var webFeatures = web.get_features();
                features.forEach(function (f) {
                    if (f.Deactivate === true) {
                        webFeatures.remove(new SP.Guid(f.ID), true);
                    }
                    else {
                        webFeatures.add(new SP.Guid(f.ID), true, SP.FeatureDefinitionScope.none);
                    }
                });
                web.update();
                clientContext.load(webFeatures);
                clientContext.executeQueryAsync(function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                }, function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                });
            });
        };
        return ObjectFeatures;
    }(ObjectHandlerBase_1.ObjectHandlerBase));
    exports.ObjectFeatures = ObjectFeatures;
});

},{"../ObjectHandlerBase/ObjectHandlerBase":8}],7:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../sharepoint/util", "../ObjectHandlerBase/ObjectHandlerBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    /// <reference path="..\schema\ifile.d.ts" />
    // import { Promise } from "es6-promise";
    /// <reference path="../../../utils/util" />
    var util_1 = require("../../../../sharepoint/util");
    var ObjectHandlerBase_1 = require("../ObjectHandlerBase/ObjectHandlerBase");
    var ObjectFiles = (function (_super) {
        __extends(ObjectFiles, _super);
        function ObjectFiles() {
            _super.call(this, "Files");
        }
        ObjectFiles.prototype.ProvisionObjects = function (objects) {
            var _this = this;
            _super.prototype.scope_started.call(this);
            return new Promise(function (resolve, reject) {
                var clientContext = SP.ClientContext.get_current();
                var web = clientContext.get_web();
                var fileInfos = [];
                var promises = [];
                objects.forEach(function (obj, index) {
                    var filename = _this.GetFilenameFromFilePath(obj.Dest);
                    var webServerRelativeUrl = _spPageContextInfo.webServerRelativeUrl;
                    var folder = web.getFolderByServerRelativeUrl(webServerRelativeUrl + "/" + _this.GetFolderFromFilePath(obj.Dest));
                    promises.push(jQuery.get(util_1.replaceUrlTokens(obj.Src), function (fileContents) {
                        var f = {};
                        jQuery.extend(f, obj, { "Filename": filename, "Folder": folder, "Contents": fileContents });
                        fileInfos.push(f);
                    }));
                });
                jQuery.when.apply(jQuery, promises).done(function () {
                    fileInfos.forEach(function (f, index) {
                        if (f.Filename.indexOf("Form.aspx") !== -1) {
                            return;
                        }
                        var objCreationInformation = new SP.FileCreationInformation();
                        objCreationInformation.set_overwrite(f.Overwrite !== undefined ? f.Overwrite : false);
                        objCreationInformation.set_url(f.Filename);
                        objCreationInformation.set_content(new SP.Base64EncodedByteArray());
                        for (var i = 0; i < f.Contents.length; i++) {
                            objCreationInformation.get_content().append(f.Contents.charCodeAt(i));
                        }
                        clientContext.load(f.Folder.get_files().add(objCreationInformation));
                    });
                    clientContext.executeQueryAsync(function () {
                        promises = [];
                        objects.forEach(function (obj) {
                            if (obj.Properties && Object.keys(obj.Properties).length > 0) {
                                promises.push(_this.ApplyFileProperties(obj.Dest, obj.Properties));
                            }
                            if (obj.WebParts && obj.WebParts.length > 0) {
                                promises.push(_this.AddWebPartsToWebPartPage(obj.Dest, obj.Src, obj.WebParts, obj.RemoveExistingWebParts));
                            }
                        });
                        Promise.all(promises).then(function () {
                            _this.ModifyHiddenViews(objects).then(function () {
                                _super.prototype.scope_ended.call(_this);
                                resolve();
                            }, function () {
                                _super.prototype.scope_ended.call(_this);
                                resolve();
                            });
                        });
                    }, function () {
                        _super.prototype.scope_ended.call(_this);
                        resolve();
                    });
                });
            });
        };
        ObjectFiles.prototype.RemoveWebPartsFromFileIfSpecified = function (clientContext, limitedWebPartManager, shouldRemoveExisting) {
            return new Promise(function (resolve, reject) {
                if (!shouldRemoveExisting) {
                    resolve();
                }
                var existingWebParts = limitedWebPartManager.get_webParts();
                clientContext.load(existingWebParts);
                clientContext.executeQueryAsync(function () {
                    existingWebParts.get_data().forEach(function (wp) {
                        wp.deleteWebPart();
                    });
                    clientContext.load(existingWebParts);
                    clientContext.executeQueryAsync(resolve, resolve);
                }, resolve);
            });
        };
        ObjectFiles.prototype.GetWebPartXml = function (webParts) {
            return new Promise(function (resolve, reject) {
                var promises = [];
                webParts.forEach(function (wp, index) {
                    if (wp.Contents.FileUrl) {
                        promises.push((function () {
                            return new Promise(function (res, rej) {
                                var fileUrl = util_1.replaceUrlTokens(wp.Contents.FileUrl);
                                jQuery.get(fileUrl, function (xml) {
                                    webParts[index].Contents.Xml = xml;
                                    res();
                                }).fail(rej);
                            });
                        })());
                    }
                });
                Promise.all(promises).then(function () {
                    resolve(webParts);
                });
            });
        };
        ObjectFiles.prototype.AddWebPartsToWebPartPage = function (dest, src, webParts, shouldRemoveExisting) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var clientContext = SP.ClientContext.get_current();
                var web = clientContext.get_web();
                var fileServerRelativeUrl = _spPageContextInfo.webServerRelativeUrl + "/" + dest;
                var file = web.getFileByServerRelativeUrl(fileServerRelativeUrl);
                clientContext.load(file);
                clientContext.executeQueryAsync(function () {
                    var limitedWebPartManager = file.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
                    _this.RemoveWebPartsFromFileIfSpecified(clientContext, limitedWebPartManager, shouldRemoveExisting).then(function () {
                        _this.GetWebPartXml(webParts).then(function (webPartsWithXml) {
                            webPartsWithXml.forEach(function (wp) {
                                if (!wp.Contents.Xml) {
                                    return;
                                }
                                var oWebPartDefinition = limitedWebPartManager.importWebPart(util_1.replaceUrlTokens(wp.Contents.Xml));
                                var oWebPart = oWebPartDefinition.get_webPart();
                                limitedWebPartManager.addWebPart(oWebPart, wp.Zone, wp.Order);
                            });
                            clientContext.executeQueryAsync(resolve, resolve);
                        });
                    });
                }, resolve);
            });
        };
        ObjectFiles.prototype.ApplyFileProperties = function (dest, fileProperties) {
            return new Promise(function (resolve, reject) {
                var clientContext = SP.ClientContext.get_current();
                var web = clientContext.get_web();
                var fileServerRelativeUrl = _spPageContextInfo.webServerRelativeUrl + "/" + dest;
                var file = web.getFileByServerRelativeUrl(fileServerRelativeUrl);
                var listItemAllFields = file.get_listItemAllFields();
                Object.keys(fileProperties).forEach(function (key) {
                    listItemAllFields.set_item(key, fileProperties[key]);
                });
                listItemAllFields.update();
                clientContext.executeQueryAsync(resolve, resolve);
            });
        };
        ObjectFiles.prototype.GetViewFromCollectionByUrl = function (viewCollection, url) {
            var serverRelativeUrl = _spPageContextInfo.webServerRelativeUrl + "/" + url;
            var viewCollectionEnumerator = viewCollection.getEnumerator();
            while (viewCollectionEnumerator.moveNext()) {
                var view = viewCollectionEnumerator.get_current();
                if (view.get_serverRelativeUrl().toString().toLowerCase() === serverRelativeUrl.toLowerCase()) {
                    return view;
                }
            }
            return null;
        };
        ObjectFiles.prototype.ModifyHiddenViews = function (objects) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var clientContext = SP.ClientContext.get_current();
                var web = clientContext.get_web();
                var mapping = {};
                var lists = [];
                var listViewCollections = [];
                objects.forEach(function (obj) {
                    if (!obj.Views) {
                        return;
                    }
                    obj.Views.forEach(function (v) {
                        mapping[v.List] = mapping[v.List] || [];
                        mapping[v.List].push(jQuery.extend(v, { "Url": obj.Dest }));
                    });
                });
                Object.keys(mapping).forEach(function (l, index) {
                    lists.push(web.get_lists().getByTitle(l));
                    listViewCollections.push(web.get_lists().getByTitle(l).get_views());
                    clientContext.load(lists[index]);
                    clientContext.load(listViewCollections[index]);
                });
                clientContext.executeQueryAsync(function () {
                    Object.keys(mapping).forEach(function (l, index) {
                        var views = mapping[l];
                        var list = lists[index];
                        var viewCollection = listViewCollections[index];
                        views.forEach(function (v) {
                            var view = _this.GetViewFromCollectionByUrl(viewCollection, v.Url);
                            if (view == null) {
                                return;
                            }
                            if (v.Paged) {
                                view.set_paged(v.Paged);
                            }
                            if (v.Query) {
                                view.set_viewQuery(v.Query);
                            }
                            if (v.RowLimit) {
                                view.set_rowLimit(v.RowLimit);
                            }
                            if (v.ViewFields && v.ViewFields.length > 0) {
                                var columns_1 = view.get_viewFields();
                                columns_1.removeAll();
                                v.ViewFields.forEach(function (vf) {
                                    columns_1.add(vf);
                                });
                            }
                            view.update();
                        });
                        clientContext.load(viewCollection);
                        list.update();
                    });
                    clientContext.executeQueryAsync(resolve, resolve);
                }, resolve);
            });
        };
        ObjectFiles.prototype.GetFolderFromFilePath = function (filePath) {
            var split = filePath.split("/");
            return split.splice(0, split.length - 1).join("/");
        };
        ObjectFiles.prototype.GetFilenameFromFilePath = function (filePath) {
            var split = filePath.split("/");
            return split[split.length - 1];
        };
        return ObjectFiles;
    }(ObjectHandlerBase_1.ObjectHandlerBase));
    exports.ObjectFiles = ObjectFiles;
    ;
});

},{"../../../../sharepoint/util":50,"../ObjectHandlerBase/ObjectHandlerBase":8}],8:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../Resources/Resources", "../../Provisioning"], factory);
    }
})(function (require, exports) {
    "use strict";
    // import { Promise } from "es6-promise";
    var Resources = require("../../Resources/Resources");
    var Provisioning_1 = require("../../Provisioning");
    var ObjectHandlerBase = (function () {
        function ObjectHandlerBase(name) {
            this.name = name;
        }
        ObjectHandlerBase.prototype.ProvisionObjects = function (objects, parameters) {
            return new Promise(function (resolve, reject) { resolve("Not implemented."); });
        };
        ObjectHandlerBase.prototype.scope_started = function () {
            Provisioning_1.Log.info(this.name, Resources.Code_execution_started);
        };
        ObjectHandlerBase.prototype.scope_ended = function () {
            Provisioning_1.Log.info(this.name, Resources.Code_execution_ended);
        };
        return ObjectHandlerBase;
    }());
    exports.ObjectHandlerBase = ObjectHandlerBase;
});

},{"../../Provisioning":13,"../../Resources/Resources":14}],9:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../Sequencer/Sequencer", "../ObjectHandlerBase/ObjectHandlerBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    /// <reference path="..\schema\ilistinstance.d.ts" />
    // import { Promise } from "es6-promise";
    var Sequencer_1 = require("../../Sequencer/Sequencer");
    var ObjectHandlerBase_1 = require("../ObjectHandlerBase/ObjectHandlerBase");
    var ObjectLists = (function (_super) {
        __extends(ObjectLists, _super);
        function ObjectLists() {
            _super.call(this, "Lists");
        }
        ObjectLists.prototype.ProvisionObjects = function (objects) {
            var _this = this;
            _super.prototype.scope_started.call(this);
            return new Promise(function (resolve, reject) {
                var clientContext = SP.ClientContext.get_current();
                var lists = clientContext.get_web().get_lists();
                var listInstances = [];
                clientContext.load(lists);
                clientContext.executeQueryAsync(function () {
                    objects.forEach(function (obj, index) {
                        var existingObj = jQuery.grep(lists.get_data(), function (list) {
                            return list.get_title() === obj.Title;
                        })[0];
                        if (existingObj) {
                            if (obj.Description) {
                                existingObj.set_description(obj.Description);
                            }
                            if (obj.EnableVersioning !== undefined) {
                                existingObj.set_enableVersioning(obj.EnableVersioning);
                            }
                            if (obj.EnableMinorVersions !== undefined) {
                                existingObj.set_enableMinorVersions(obj.EnableMinorVersions);
                            }
                            if (obj.EnableModeration !== undefined) {
                                existingObj.set_enableModeration(obj.EnableModeration);
                            }
                            if (obj.EnableFolderCreation !== undefined) {
                                existingObj.set_enableFolderCreation(obj.EnableFolderCreation);
                            }
                            if (obj.EnableAttachments !== undefined) {
                                existingObj.set_enableAttachments(obj.EnableAttachments);
                            }
                            if (obj.NoCrawl !== undefined) {
                                existingObj.set_noCrawl(obj.NoCrawl);
                            }
                            if (obj.DefaultDisplayFormUrl) {
                                existingObj.set_defaultDisplayFormUrl(obj.DefaultDisplayFormUrl);
                            }
                            if (obj.DefaultEditFormUrl) {
                                existingObj.set_defaultEditFormUrl(obj.DefaultEditFormUrl);
                            }
                            if (obj.DefaultNewFormUrl) {
                                existingObj.set_defaultNewFormUrl(obj.DefaultNewFormUrl);
                            }
                            if (obj.DraftVersionVisibility) {
                                existingObj.set_draftVersionVisibility(SP.DraftVisibilityType[obj.DraftVersionVisibility]);
                            }
                            if (obj.ImageUrl) {
                                existingObj.set_imageUrl(obj.ImageUrl);
                            }
                            if (obj.Hidden !== undefined) {
                                existingObj.set_hidden(obj.Hidden);
                            }
                            if (obj.ForceCheckout !== undefined) {
                                existingObj.set_forceCheckout(obj.ForceCheckout);
                            }
                            existingObj.update();
                            listInstances.push(existingObj);
                            clientContext.load(listInstances[index]);
                        }
                        else {
                            var objCreationInformation = new SP.ListCreationInformation();
                            if (obj.Description) {
                                objCreationInformation.set_description(obj.Description);
                            }
                            if (obj.OnQuickLaunch !== undefined) {
                                var value = obj.OnQuickLaunch ? SP.QuickLaunchOptions.on : SP.QuickLaunchOptions.off;
                                objCreationInformation.set_quickLaunchOption(value);
                            }
                            if (obj.TemplateType) {
                                objCreationInformation.set_templateType(obj.TemplateType);
                            }
                            if (obj.Title) {
                                objCreationInformation.set_title(obj.Title);
                            }
                            if (obj.Url) {
                                objCreationInformation.set_url(obj.Url);
                            }
                            var createdList = lists.add(objCreationInformation);
                            if (obj.EnableVersioning !== undefined) {
                                createdList.set_enableVersioning(obj.EnableVersioning);
                            }
                            if (obj.EnableMinorVersions !== undefined) {
                                createdList.set_enableMinorVersions(obj.EnableMinorVersions);
                            }
                            if (obj.EnableModeration !== undefined) {
                                createdList.set_enableModeration(obj.EnableModeration);
                            }
                            if (obj.EnableFolderCreation !== undefined) {
                                createdList.set_enableFolderCreation(obj.EnableFolderCreation);
                            }
                            if (obj.EnableAttachments !== undefined) {
                                createdList.set_enableAttachments(obj.EnableAttachments);
                            }
                            if (obj.NoCrawl !== undefined) {
                                createdList.set_noCrawl(obj.NoCrawl);
                            }
                            if (obj.DefaultDisplayFormUrl) {
                                createdList.set_defaultDisplayFormUrl(obj.DefaultDisplayFormUrl);
                            }
                            if (obj.DefaultEditFormUrl) {
                                createdList.set_defaultEditFormUrl(obj.DefaultEditFormUrl);
                            }
                            if (obj.DefaultNewFormUrl) {
                                createdList.set_defaultNewFormUrl(obj.DefaultNewFormUrl);
                            }
                            if (obj.DraftVersionVisibility) {
                                var value = SP.DraftVisibilityType[obj.DraftVersionVisibility.toLocaleLowerCase()];
                                createdList.set_draftVersionVisibility(value);
                            }
                            if (obj.ImageUrl) {
                                createdList.set_imageUrl(obj.ImageUrl);
                            }
                            if (obj.Hidden !== undefined) {
                                createdList.set_hidden(obj.Hidden);
                            }
                            if (obj.ForceCheckout !== undefined) {
                                createdList.set_forceCheckout(obj.ForceCheckout);
                            }
                            listInstances.push(createdList);
                            clientContext.load(listInstances[index]);
                        }
                    });
                    clientContext.executeQueryAsync(function () {
                        var sequencer = new Sequencer_1.Sequencer([
                            _this.ApplyContentTypeBindings,
                            _this.ApplyListInstanceFieldRefs,
                            _this.ApplyFields,
                            _this.ApplyLookupFields,
                            _this.ApplyListSecurity,
                            _this.CreateViews,
                            _this.InsertDataRows,
                            _this.CreateFolders,
                        ], { ClientContext: clientContext, ListInstances: listInstances, Objects: objects }, _this);
                        sequencer.execute().then(function () {
                            _super.prototype.scope_ended.call(_this);
                            resolve();
                        });
                    }, function () {
                        _super.prototype.scope_ended.call(_this);
                        resolve();
                    });
                }, function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                });
            });
        };
        ObjectLists.prototype.EnsureLocationBasedMetadataDefaultsReceiver = function (clientContext, list) {
            var eventReceivers = list.get_eventReceivers();
            var eventRecCreationInfo = new SP.EventReceiverDefinitionCreationInformation();
            eventRecCreationInfo.set_receiverName("LocationBasedMetadataDefaultsReceiver ItemAdded");
            eventRecCreationInfo.set_synchronization(1);
            eventRecCreationInfo.set_sequenceNumber(1000);
            eventRecCreationInfo.set_receiverAssembly("Microsoft.Office.DocumentManagement, Version=15.0.0.0, Culture=neutral, " +
                "PublicKeyToken=71e9bce111e9429c");
            eventRecCreationInfo.set_receiverClass("Microsoft.Office.DocumentManagement.LocationBasedMetadataDefaultsReceiver");
            eventRecCreationInfo.set_eventType(SP.EventReceiverType.itemAdded);
            eventReceivers.add(eventRecCreationInfo);
            list.update();
        };
        ObjectLists.prototype.CreateFolders = function (params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                params.ListInstances.forEach(function (l, index) {
                    var obj = params.Objects[index];
                    if (!obj.Folders) {
                        return;
                    }
                    var folderServerRelativeUrl = _spPageContextInfo.webServerRelativeUrl + "/" + obj.Url;
                    var rootFolder = l.get_rootFolder();
                    var metadataDefaults = "<MetadataDefaults>";
                    var setMetadataDefaults = false;
                    obj.Folders.forEach(function (f) {
                        var folderUrl = folderServerRelativeUrl + "/" + f.Name;
                        rootFolder.get_folders().add(folderUrl);
                        if (f.DefaultValues) {
                            var keys = Object.keys(f.DefaultValues).length;
                            if (keys > 0) {
                                metadataDefaults += "<a href='" + folderUrl + "'>";
                                Object.keys(f.DefaultValues).forEach(function (key) {
                                    metadataDefaults += "<DefaultValue FieldName=\"" + key + "\">" + f.DefaultValues[key] + "</DefaultValue>";
                                });
                                metadataDefaults += "</a>";
                            }
                            setMetadataDefaults = true;
                        }
                    });
                    metadataDefaults += "</MetadataDefaults>";
                    if (setMetadataDefaults) {
                        var metadataDefaultsFileCreateInfo = new SP.FileCreationInformation();
                        metadataDefaultsFileCreateInfo.set_url(folderServerRelativeUrl + "/Forms/client_LocationBasedDefaults.html");
                        metadataDefaultsFileCreateInfo.set_content(new SP.Base64EncodedByteArray());
                        metadataDefaultsFileCreateInfo.set_overwrite(true);
                        for (var i = 0; i < metadataDefaults.length; i++) {
                            metadataDefaultsFileCreateInfo.get_content().append(metadataDefaults.charCodeAt(i));
                        }
                        rootFolder.get_files().add(metadataDefaultsFileCreateInfo);
                        _this.EnsureLocationBasedMetadataDefaultsReceiver(params.ClientContext, l);
                    }
                });
                params.ClientContext.executeQueryAsync(resolve, resolve);
            });
        };
        ObjectLists.prototype.ApplyContentTypeBindings = function (params) {
            return new Promise(function (resolve, reject) {
                var webCts = params.ClientContext.get_site().get_rootWeb().get_contentTypes();
                var listCts = [];
                params.ListInstances.forEach(function (l, index) {
                    listCts.push(l.get_contentTypes());
                    params.ClientContext.load(listCts[index], "Include(Name,Id)");
                    if (params.Objects[index].ContentTypeBindings) {
                        l.set_contentTypesEnabled(true);
                        l.update();
                    }
                });
                params.ClientContext.load(webCts);
                params.ClientContext.executeQueryAsync(function () {
                    params.ListInstances.forEach(function (list, index) {
                        var obj = params.Objects[index];
                        if (!obj.ContentTypeBindings) {
                            return;
                        }
                        var listContentTypes = listCts[index];
                        var existingContentTypes = new Array();
                        if (obj.RemoveExistingContentTypes && obj.ContentTypeBindings.length > 0) {
                            listContentTypes.get_data().forEach(function (ct) {
                                existingContentTypes.push(ct);
                            });
                        }
                        obj.ContentTypeBindings.forEach(function (ctb) {
                            listContentTypes.addExistingContentType(webCts.getById(ctb.ContentTypeId));
                        });
                        if (obj.RemoveExistingContentTypes && obj.ContentTypeBindings.length > 0) {
                            for (var j = 0; j < existingContentTypes.length; j++) {
                                var ect = existingContentTypes[j];
                                ect.deleteObject();
                            }
                        }
                        list.update();
                    });
                    params.ClientContext.executeQueryAsync(resolve, resolve);
                }, resolve);
            });
        };
        ObjectLists.prototype.ApplyListInstanceFieldRefs = function (params) {
            return new Promise(function (resolve, reject) {
                var siteFields = params.ClientContext.get_site().get_rootWeb().get_fields();
                params.ListInstances.forEach(function (l, index) {
                    var obj = params.Objects[index];
                    if (obj.FieldRefs) {
                        obj.FieldRefs.forEach(function (fr) {
                            var field = siteFields.getByInternalNameOrTitle(fr.Name);
                            l.get_fields().add(field);
                        });
                        l.update();
                    }
                });
                params.ClientContext.executeQueryAsync(resolve, resolve);
            });
        };
        ObjectLists.prototype.ApplyFields = function (params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                params.ListInstances.forEach(function (l, index) {
                    var obj = params.Objects[index];
                    if (obj.Fields) {
                        obj.Fields.forEach(function (f) {
                            var fieldXml = _this.GetFieldXml(f, params.ListInstances, l);
                            var fieldType = _this.GetFieldXmlAttr(fieldXml, "Type");
                            if (fieldType !== "Lookup" && fieldType !== "LookupMulti") {
                                l.get_fields().addFieldAsXml(fieldXml, true, SP.AddFieldOptions.addToAllContentTypes);
                            }
                        });
                        l.update();
                    }
                });
                params.ClientContext.executeQueryAsync(resolve, resolve);
            });
        };
        ObjectLists.prototype.ApplyLookupFields = function (params) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                params.ListInstances.forEach(function (l, index) {
                    var obj = params.Objects[index];
                    if (obj.Fields) {
                        obj.Fields.forEach(function (f) {
                            var fieldXml = _this.GetFieldXml(f, params.ListInstances, l);
                            if (!fieldXml) {
                                return;
                            }
                            var fieldType = _this.GetFieldXmlAttr(fieldXml, "Type");
                            if (fieldType === "Lookup" || fieldType === "LookupMulti") {
                                l.get_fields().addFieldAsXml(fieldXml, true, SP.AddFieldOptions.addToAllContentTypes);
                            }
                        });
                        l.update();
                    }
                });
                params.ClientContext.executeQueryAsync(resolve, resolve);
            });
        };
        ObjectLists.prototype.GetFieldXmlAttr = function (fieldXml, attr) {
            return jQuery(jQuery.parseXML(fieldXml)).find("Field").attr(attr);
        };
        ObjectLists.prototype.GetFieldXml = function (field, lists, list) {
            var fieldXml = "";
            if (!field.SchemaXml) {
                var properties_1 = [];
                Object.keys(field).forEach(function (prop) {
                    var value = field[prop];
                    if (prop === "List") {
                        var targetList = jQuery.grep(lists, function (v) {
                            return v.get_title() === value;
                        });
                        if (targetList.length > 0) {
                            value = "{" + targetList[0].get_id().toString() + "}";
                        }
                        else {
                            return null;
                        }
                        properties_1.push(prop + "=\"" + value + "\"");
                    }
                });
                fieldXml = "<Field " + properties_1.join(" ") + ">";
                if (field.Type === "Calculated") {
                    fieldXml += "<Formula>" + field.Formula + "</Formula>";
                }
                fieldXml += "</Field>";
            }
            return fieldXml;
        };
        ObjectLists.prototype.ApplyListSecurity = function (params) {
            return new Promise(function (resolve, reject) {
                params.ListInstances.forEach(function (l, index) {
                    var obj = params.Objects[index];
                    if (!obj.Security) {
                        return;
                    }
                    if (obj.Security.BreakRoleInheritance) {
                        l.breakRoleInheritance(obj.Security.CopyRoleAssignments, obj.Security.ClearSubscopes);
                        l.update();
                        params.ClientContext.load(l.get_roleAssignments());
                    }
                });
                var web = params.ClientContext.get_web();
                var allProperties = web.get_allProperties();
                var siteGroups = web.get_siteGroups();
                var roleDefinitions = web.get_roleDefinitions();
                params.ClientContext.load(allProperties);
                params.ClientContext.load(roleDefinitions);
                params.ClientContext.executeQueryAsync(function () {
                    params.ListInstances.forEach(function (l, index) {
                        var obj = params.Objects[index];
                        if (!obj.Security) {
                            return;
                        }
                        obj.Security.RoleAssignments.forEach(function (ra) {
                            var roleDef = null;
                            if (typeof ra.RoleDefinition === "number") {
                                roleDef = roleDefinitions.getById(ra.RoleDefinition);
                            }
                            else {
                                roleDef = roleDefinitions.getByName(ra.RoleDefinition);
                            }
                            var roleBindings = SP.RoleDefinitionBindingCollection.newObject(params.ClientContext);
                            roleBindings.add(roleDef);
                            var principal = null;
                            if (ra.Principal.match(/\{[A-Za-z]*\}+/g)) {
                                var token = ra.Principal.substring(1, ra.Principal.length - 1);
                                var groupId = allProperties.get_fieldValues()[("vti_" + token)];
                                principal = siteGroups.getById(groupId);
                            }
                            else {
                                principal = siteGroups.getByName(principal);
                            }
                            l.get_roleAssignments().add(principal, roleBindings);
                        });
                        l.update();
                    });
                    params.ClientContext.executeQueryAsync(resolve, resolve);
                }, resolve);
            });
        };
        ObjectLists.prototype.CreateViews = function (params) {
            return new Promise(function (resolve, reject) {
                var listViewCollections = [];
                params.ListInstances.forEach(function (l, index) {
                    listViewCollections.push(l.get_views());
                    params.ClientContext.load(listViewCollections[index]);
                });
                params.ClientContext.executeQueryAsync(function () {
                    params.ListInstances.forEach(function (l, index) {
                        var obj = params.Objects[index];
                        if (!obj.Views) {
                            return;
                        }
                        listViewCollections.push(l.get_views());
                        params.ClientContext.load(listViewCollections[index]);
                        obj.Views.forEach(function (v) {
                            var viewExists = jQuery.grep(listViewCollections[index].get_data(), function (ev) {
                                if (obj.RemoveExistingViews && obj.Views.length > 0) {
                                    ev.deleteObject();
                                    return false;
                                }
                                return ev.get_title() === v.Title;
                            }).length > 0;
                            if (viewExists) {
                                var view = listViewCollections[index].getByTitle(v.Title);
                                if (v.Paged) {
                                    view.set_paged(v.Paged);
                                }
                                if (v.Query) {
                                    view.set_viewQuery(v.Query);
                                }
                                if (v.RowLimit) {
                                    view.set_rowLimit(v.RowLimit);
                                }
                                if (v.ViewFields && v.ViewFields.length > 0) {
                                    var columns_1 = view.get_viewFields();
                                    columns_1.removeAll();
                                    v.ViewFields.forEach(function (vf) {
                                        columns_1.add(vf);
                                    });
                                }
                                if (v.Scope) {
                                    view.set_scope(v.Scope);
                                }
                                view.update();
                            }
                            else {
                                var viewCreationInformation = new SP.ViewCreationInformation();
                                if (v.Title) {
                                    viewCreationInformation.set_title(v.Title);
                                }
                                if (v.PersonalView) {
                                    viewCreationInformation.set_personalView(v.PersonalView);
                                }
                                if (v.Paged) {
                                    viewCreationInformation.set_paged(v.Paged);
                                }
                                if (v.Query) {
                                    viewCreationInformation.set_query(v.Query);
                                }
                                if (v.RowLimit) {
                                    viewCreationInformation.set_rowLimit(v.RowLimit);
                                }
                                if (v.SetAsDefaultView) {
                                    viewCreationInformation.set_setAsDefaultView(v.SetAsDefaultView);
                                }
                                if (v.ViewFields) {
                                    viewCreationInformation.set_viewFields(v.ViewFields);
                                }
                                if (v.ViewTypeKind) {
                                    viewCreationInformation.set_viewTypeKind(SP.ViewType.html);
                                }
                                var view = l.get_views().add(viewCreationInformation);
                                if (v.Scope) {
                                    view.set_scope(v.Scope);
                                    view.update();
                                }
                                l.update();
                            }
                            params.ClientContext.load(l.get_views());
                        });
                    });
                    params.ClientContext.executeQueryAsync(resolve, resolve);
                }, resolve);
            });
        };
        ObjectLists.prototype.InsertDataRows = function (params) {
            return new Promise(function (resolve, reject) {
                params.ListInstances.forEach(function (l, index) {
                    var obj = params.Objects[index];
                    if (obj.DataRows) {
                        obj.DataRows.forEach(function (r) {
                            var item = l.addItem(new SP.ListItemCreationInformation());
                            Object.keys(r).forEach(function (key) {
                                item.set_item(key, r[key]);
                            });
                            item.update();
                            params.ClientContext.load(item);
                        });
                    }
                });
                params.ClientContext.executeQueryAsync(resolve, resolve);
            });
        };
        return ObjectLists;
    }(ObjectHandlerBase_1.ObjectHandlerBase));
    exports.ObjectLists = ObjectLists;
});

},{"../../Sequencer/Sequencer":15,"../ObjectHandlerBase/ObjectHandlerBase":8}],10:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../util", "../ObjectHandlerBase/ObjectHandlerBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    /// <reference path="..\schema\inavigation.d.ts" />
    // import { Promise } from "es6-promise";
    /// <reference path="../../../utils/util" />
    var util_1 = require("../../../util");
    var ObjectHandlerBase_1 = require("../ObjectHandlerBase/ObjectHandlerBase");
    var ObjectNavigation = (function (_super) {
        __extends(ObjectNavigation, _super);
        function ObjectNavigation() {
            _super.call(this, "Navigation");
        }
        ObjectNavigation.prototype.ProvisionObjects = function (object) {
            var _this = this;
            _super.prototype.scope_started.call(this);
            var clientContext = SP.ClientContext.get_current();
            var navigation = clientContext.get_web().get_navigation();
            return new Promise(function (resolve, reject) {
                _this.ConfigureQuickLaunch(object.QuickLaunch, clientContext, navigation).then(function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                }, function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                });
            });
        };
        ObjectNavigation.prototype.ConfigureQuickLaunch = function (nodes, clientContext, navigation) {
            return new Promise(function (resolve, reject) {
                if (nodes.length === 0) {
                    resolve();
                }
                else {
                    var quickLaunchNodeCollection_1 = navigation.get_quickLaunch();
                    clientContext.load(quickLaunchNodeCollection_1);
                    clientContext.executeQueryAsync(function () {
                        var temporaryQuickLaunch = [];
                        var index = quickLaunchNodeCollection_1.get_count() - 1;
                        while (index >= 0) {
                            var oldNode = quickLaunchNodeCollection_1.itemAt(index);
                            temporaryQuickLaunch.push(oldNode);
                            oldNode.deleteObject();
                            index--;
                        }
                        clientContext.executeQueryAsync(function () {
                            nodes.forEach(function (n) {
                                var existingNode = util_1.getNodeFromCollectionByTitle(temporaryQuickLaunch, n.Title);
                                var newNode = new SP.NavigationNodeCreationInformation();
                                newNode.set_title(n.Title);
                                newNode.set_url(existingNode ? existingNode.get_url() : util_1.replaceUrlTokens(n.Url));
                                newNode.set_asLastNode(true);
                                quickLaunchNodeCollection_1.add(newNode);
                            });
                            clientContext.executeQueryAsync(function () {
                                jQuery.ajax({
                                    "url": _spPageContextInfo.webAbsoluteUrl + "/_api/web/Navigation/QuickLaunch",
                                    "type": "get",
                                    "headers": {
                                        "accept": "application/json;odata=verbose",
                                    },
                                }).done(function (data) {
                                    data = data.d.results;
                                    data.forEach(function (d) {
                                        var node = navigation.getNodeById(d.Id);
                                        var childrenNodeCollection = node.get_children();
                                        var parentNode = jQuery.grep(nodes, function (value) { return value.Title === d.Title; })[0];
                                        if (parentNode && parentNode.Children) {
                                            parentNode.Children.forEach(function (n) {
                                                var existingNode = util_1.getNodeFromCollectionByTitle(temporaryQuickLaunch, n.Title);
                                                var newNode = new SP.NavigationNodeCreationInformation();
                                                newNode.set_title(n.Title);
                                                newNode.set_url(existingNode ? existingNode.get_url() : util_1.replaceUrlTokens(n.Url));
                                                newNode.set_asLastNode(true);
                                                childrenNodeCollection.add(newNode);
                                            });
                                        }
                                    });
                                    clientContext.executeQueryAsync(resolve, resolve);
                                });
                            }, resolve);
                        });
                    });
                }
            });
        };
        return ObjectNavigation;
    }(ObjectHandlerBase_1.ObjectHandlerBase));
    exports.ObjectNavigation = ObjectNavigation;
});

},{"../../../util":39,"../ObjectHandlerBase/ObjectHandlerBase":8}],11:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../../../sharepoint/util", "../ObjectHandlerBase/ObjectHandlerBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    // "use strict";
    // 
    // /// <reference path="..\schema\ipropertybagentry.d.ts" />
    // import { Promise } from "es6-promise";
    /// <reference path="../../../../utils/util" />
    var util_1 = require("../../../../sharepoint/util");
    var ObjectHandlerBase_1 = require("../ObjectHandlerBase/ObjectHandlerBase");
    var ObjectPropertyBagEntries = (function (_super) {
        __extends(ObjectPropertyBagEntries, _super);
        function ObjectPropertyBagEntries() {
            _super.call(this, "PropertyBagEntries");
        }
        ObjectPropertyBagEntries.prototype.ProvisionObjects = function (entries) {
            var _this = this;
            _super.prototype.scope_started.call(this);
            return new Promise(function (resolve, reject) {
                if (!entries || entries.length === 0) {
                    resolve();
                }
                else {
                    var clientContext_1 = SP.ClientContext.get_current();
                    var web_1 = clientContext_1.get_web();
                    var propBag_1 = web_1.get_allProperties();
                    var indexedProperties_1 = [];
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        propBag_1.set_item(entry.Key, entry.Value);
                        if (entry.Indexed) {
                            indexedProperties_1.push(util_1.encodePropertyKey(entry.Key));
                        }
                        ;
                    }
                    ;
                    web_1.update();
                    clientContext_1.load(propBag_1);
                    clientContext_1.executeQueryAsync(function () {
                        if (indexedProperties_1.length > 0) {
                            propBag_1.set_item("vti_indexedpropertykeys", indexedProperties_1.join("|"));
                            web_1.update();
                            clientContext_1.executeQueryAsync(function () {
                                _super.prototype.scope_ended.call(_this);
                                resolve();
                            }, function () {
                                _super.prototype.scope_ended.call(_this);
                                resolve();
                            });
                        }
                        else {
                            _super.prototype.scope_ended.call(_this);
                            resolve();
                        }
                    }, function () {
                        _super.prototype.scope_ended.call(_this);
                        resolve();
                    });
                }
            });
        };
        return ObjectPropertyBagEntries;
    }(ObjectHandlerBase_1.ObjectHandlerBase));
    exports.ObjectPropertyBagEntries = ObjectPropertyBagEntries;
});

},{"../../../../sharepoint/util":50,"../ObjectHandlerBase/ObjectHandlerBase":8}],12:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../ObjectHandlerBase/ObjectHandlerBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    /// <reference path="..\schema\iwebsettings.d.ts" />
    // import { Promise } from "es6-promise";
    var ObjectHandlerBase_1 = require("../ObjectHandlerBase/ObjectHandlerBase");
    var ObjectWebSettings = (function (_super) {
        __extends(ObjectWebSettings, _super);
        function ObjectWebSettings() {
            _super.call(this, "WebSettings");
        }
        ObjectWebSettings.prototype.ProvisionObjects = function (object) {
            var _this = this;
            _super.prototype.scope_started.call(this);
            return new Promise(function (resolve, reject) {
                var clientContext = SP.ClientContext.get_current();
                var web = clientContext.get_web();
                if (object.WelcomePage) {
                    web.get_rootFolder().set_welcomePage(object.WelcomePage);
                    web.get_rootFolder().update();
                }
                if (object.MasterUrl) {
                    web.set_masterUrl(object.MasterUrl);
                }
                if (object.CustomMasterUrl) {
                    web.set_customMasterUrl(object.CustomMasterUrl);
                }
                if (object.SaveSiteAsTemplateEnabled !== undefined) {
                    web.set_saveSiteAsTemplateEnabled(object.SaveSiteAsTemplateEnabled);
                }
                if (object.QuickLaunchEnabled !== undefined) {
                    web.set_saveSiteAsTemplateEnabled(object.QuickLaunchEnabled);
                }
                if (object.TreeViewEnabled !== undefined) {
                    web.set_treeViewEnabled(object.TreeViewEnabled);
                }
                web.update();
                clientContext.load(web);
                clientContext.executeQueryAsync(function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                }, function () {
                    _super.prototype.scope_ended.call(_this);
                    resolve();
                });
            });
        };
        return ObjectWebSettings;
    }(ObjectHandlerBase_1.ObjectHandlerBase));
    exports.ObjectWebSettings = ObjectWebSettings;
});

},{"../ObjectHandlerBase/ObjectHandlerBase":8}],13:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Core/Core", "./Logger/Logger"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Core_1 = require("./Core/Core");
    var Logger_1 = require("./Logger/Logger");
    var Provisioning = (function () {
        function Provisioning() {
            this.core = new Core_1.Core();
        }
        return Provisioning;
    }());
    exports.Provisioning = Provisioning;
    exports.Log = new Logger_1.Logger();
});

},{"./Core/Core":1,"./Logger/Logger":3}],14:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.Code_execution_started = "Code execution scope started";
    exports.Code_execution_ended = "Code execution scope ended";
    exports.Template_invalid = "The provided template is invalid";
});

},{}],15:[function(require,module,exports){
// import { Promise } from "es6-promise";
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Sequencer = (function () {
        function Sequencer(__functions, __parameter, __scope) {
            this.parameter = __parameter;
            this.scope = __scope;
            this.functions = this.deferredArray(__functions);
        }
        Sequencer.prototype.execute = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var promises = [];
                promises.push(jQuery.Deferred());
                promises[0].resolve();
                promises[0].promise();
                var index = 1;
                while (_this.functions[index - 1] !== undefined) {
                    var i = promises.length - 1;
                    promises.push(_this.functions[index - 1].execute(promises[i]));
                    index++;
                }
                ;
                Promise.all(promises).then(resolve, resolve);
            });
        };
        Sequencer.prototype.deferredArray = function (__functions) {
            var _this = this;
            var functions = [];
            __functions.forEach(function (f) { return functions.push(new DeferredObject(f, _this.parameter, _this.scope)); });
            return functions;
        };
        return Sequencer;
    }());
    exports.Sequencer = Sequencer;
    var DeferredObject = (function () {
        function DeferredObject(func, parameter, scope) {
            this.func = func;
            this.parameter = parameter;
            this.scope = scope;
        }
        DeferredObject.prototype.execute = function (depFunc) {
            var _this = this;
            if (!depFunc) {
                return this.func.apply(this.scope, [this.parameter]);
            }
            return new Promise(function (resolve, reject) {
                depFunc.then(function () {
                    _this.func.apply(_this.scope, [_this.parameter]).then(resolve, resolve);
                });
            });
        };
        return DeferredObject;
    }());
});

},{}],16:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../utils/util", "../../collections/collections"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Util = require("../../utils/util");
    var collections_1 = require("../../collections/collections");
    /**
     * Queryable Base Class
     *
     */
    var Queryable = (function () {
        /**
         * Creates a new instance of the Queryable class
         *
         * @constructor
         * @param baseUrl A string or Queryable that should form the base part of the url
         *
         */
        function Queryable(baseUrl, path) {
            this._query = new collections_1.Dictionary();
            if (typeof baseUrl === "string") {
                var s = baseUrl;
                this._url = Util.combinePaths(s, path);
            }
            else {
                var q = baseUrl;
                this._url = Util.combinePaths(q._url, path);
                this._query.merge(q._query);
            }
        }
        /**
         * Directly concatonates the supplied string to the current url, not normalizing "/" chars
         *
         * @param pathPart The string to concatonate to the url
         */
        Queryable.prototype.concat = function (pathPart) {
            this._url += pathPart;
        };
        /**
         * Appends the given string and normalizes "/" chars
         *
         * @param pathPart The string to append
         */
        Queryable.prototype.append = function (pathPart) {
            this._url = Util.combinePaths(this._url, pathPart);
        };
        Object.defineProperty(Queryable.prototype, "query", {
            /**
             * Provides access to the query builder for this url
             *
             */
            get: function () {
                return this._query;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the currentl url, made server relative or absolute based on the availability of the _spPageContextInfo object
         *
         */
        Queryable.prototype.toUrl = function () {
            if (!Util.isUrlAbsolute(this._url)) {
                if (typeof _spPageContextInfo !== "undefined") {
                    if (_spPageContextInfo.hasOwnProperty("webAbsoluteUrl")) {
                        return Util.combinePaths(_spPageContextInfo.webAbsoluteUrl, this._url);
                    }
                    else if (_spPageContextInfo.hasOwnProperty("webServerRelativeUrl")) {
                        return Util.combinePaths(_spPageContextInfo.webServerRelativeUrl, this._url);
                    }
                }
            }
            return this._url;
        };
        /**
         * Gets the full url with query information
         *
         */
        Queryable.prototype.toUrlAndQuery = function () {
            var _this = this;
            var url = this.toUrl();
            if (this._query.count() > 0) {
                url += "?";
                var keys = this._query.getKeys();
                url += keys.map(function (key, ix, arr) { return (key + "=" + _this._query.get(key)); }).join("&");
            }
            return url;
        };
        return Queryable;
    }());
    exports.Queryable = Queryable;
});

},{"../../collections/collections":41,"../../utils/util":56}],17:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./site", "./webs", "../../utils/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var site_1 = require("./site");
    var webs_1 = require("./webs");
    var Util = require("../../utils/util");
    /**
     * Root of the SharePoint REST module
     */
    var Rest = (function () {
        function Rest() {
        }
        Object.defineProperty(Rest.prototype, "site", {
            /**
             * Begins a site collection scoped REST request
             *
             * @param url The base url for the request, optional if running in the context of a page
             */
            get: function () {
                return new site_1.Site("_api");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rest.prototype, "web", {
            /**
             * Begins a web scoped REST request
             *
             * @param url The base url for the request, optional if running in the context of a page
             */
            get: function () {
                return new webs_1.Web("_api");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Begins a cross-domain, host site scoped REST request, for use in add-in webs
         *
         * @param addInWebUrl The absolute url of the add-in web
         * @param hostWebUrl The absolute url of the host web
         */
        Rest.prototype.crossDomainSite = function (addInWebUrl, hostWebUrl) {
            return this._cdImpl(site_1.Site, addInWebUrl, hostWebUrl, "site");
        };
        /**
         * Begins a cross-domain, host web scoped REST request, for use in add-in webs
         *
         * @param addInWebUrl The absolute url of the add-in web
         * @param hostWebUrl The absolute url of the host web
         */
        Rest.prototype.crossDomainWeb = function (addInWebUrl, hostWebUrl) {
            return this._cdImpl(webs_1.Web, addInWebUrl, hostWebUrl, "web");
        };
        /**
         * Implements the creation of cross domain REST urls
         *
         * @param factory The constructor of the object to create Site | Web
         * @param addInWebUrl The absolute url of the add-in web
         * @param hostWebUrl The absolute url of the host web
         * @param urlPart String part to append to the url "site" | "web"
         */
        Rest.prototype._cdImpl = function (factory, addInWebUrl, hostWebUrl, urlPart) {
            if (!Util.isUrlAbsolute(addInWebUrl)) {
                throw "The addInWebUrl parameter must be an absolute url.";
            }
            if (!Util.isUrlAbsolute(hostWebUrl)) {
                throw "The hostWebUrl parameter must be an absolute url.";
            }
            var url = Util.combinePaths(addInWebUrl, "_api/SP.AppContextSite(@target)", urlPart);
            var instance = new factory(url);
            instance.query.add("@target", encodeURIComponent(hostWebUrl));
            return instance;
        };
        return Rest;
    }());
    exports.Rest = Rest;
});

},{"../../utils/util":56,"./site":32,"./webs":36}],18:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./queryable", "./mixins", "../../utils/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var queryable_1 = require("./queryable");
    var Mixins = require("./mixins");
    var Util = require("../../utils/util");
    /**
     * A Queryable which only exposes the get method
     *
     */
    var Gettable = (function (_super) {
        __extends(Gettable, _super);
        /**
         * Creates a new instance of the Gettable class
         *
         * @param baseUrl The url or Queryable which forms the parent of this actionable
         */
        function Gettable(baseUrl) {
            _super.call(this, baseUrl);
        }
        /**
         * Execute the get request
         *
         */
        Gettable.prototype.get = function () { return; };
        return Gettable;
    }(queryable_1.Queryable));
    exports.Gettable = Gettable;
    Util.applyMixins(Gettable, Mixins.Gettable);
    /**
     * A Queryable which only exposes the get and select methods
     *
     */
    var SelectableGettable = (function (_super) {
        __extends(SelectableGettable, _super);
        /**
         * Creates a new instance of the SelectableGettable class
         *
         * @param baseUrl The url or Queryable which forms the parent of this actionable
         */
        function SelectableGettable(baseUrl) {
            _super.call(this, baseUrl);
        }
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        SelectableGettable.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Execute the get request
         *
         */
        SelectableGettable.prototype.get = function () { return; };
        return SelectableGettable;
    }(queryable_1.Queryable));
    exports.SelectableGettable = SelectableGettable;
    Util.applyMixins(SelectableGettable, Mixins.Gettable, Mixins.Selectable);
    /**
     * A Queryable which only exposes the get and filter methods
     *
     */
    var FilterableGettable = (function (_super) {
        __extends(FilterableGettable, _super);
        /**
         * Creates a new instance of the FilterableGettable class
         *
         * @param baseUrl The url or Queryable which forms the parent of this actionable
         */
        function FilterableGettable(baseUrl) {
            _super.call(this, baseUrl);
        }
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        FilterableGettable.prototype.filter = function (filter) { return; };
        /**
         * Execute the get request
         *
         */
        FilterableGettable.prototype.get = function () { return; };
        return FilterableGettable;
    }(queryable_1.Queryable));
    exports.FilterableGettable = FilterableGettable;
    Util.applyMixins(FilterableGettable, Mixins.Gettable, Mixins.Filterable);
    /**
     * A Queryable which only exposes the get, select and filter methods
     *
     */
    var FilterableSelectableGettable = (function (_super) {
        __extends(FilterableSelectableGettable, _super);
        /**
         * Creates a new instance of the FilterableSelectableGettable class
         *
         * @param baseUrl The url or Queryable which forms the parent of this actionable
         */
        function FilterableSelectableGettable(baseUrl) {
            _super.call(this, baseUrl);
        }
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        FilterableSelectableGettable.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Execute the get request
         *
         */
        FilterableSelectableGettable.prototype.get = function () { return; };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        FilterableSelectableGettable.prototype.filter = function (filter) { return; };
        return FilterableSelectableGettable;
    }(queryable_1.Queryable));
    exports.FilterableSelectableGettable = FilterableSelectableGettable;
    Util.applyMixins(FilterableSelectableGettable, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
});

},{"../../utils/util":56,"./mixins":26,"./queryable":28}],19:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    /**
     * Describes a collection of content types
     *
     */
    var ContentTypes = (function (_super) {
        __extends(ContentTypes, _super);
        /**
         * Creates a new instance of the ContentTypes class
         *
         * @param baseUrl The url or Queryable which forms the parent of this content types collection
         */
        function ContentTypes(baseUrl) {
            _super.call(this, baseUrl, "contentTypes");
        }
        /**
         * Gets a ContentType by content type id
         */
        ContentTypes.prototype.getById = function (id) {
            this.concat("(\"" + id + "\")");
            return new ContentType(this);
        };
        /**
         * Execute the get request
         *
         */
        ContentTypes.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        ContentTypes.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        ContentTypes.prototype.filter = function (filter) { return; };
        return ContentTypes;
    }(Queryable_1.Queryable));
    exports.ContentTypes = ContentTypes;
    Util.applyMixins(ContentTypes, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
    /**
     * Describes a single ContentType instance
     *
     */
    var ContentType = (function (_super) {
        __extends(ContentType, _super);
        /**
         * Creates a new instance of the ContentType class
         *
         * @param baseUrl The url or Queryable which forms the parent of this content type instance
         */
        function ContentType(baseUrl) {
            _super.call(this, baseUrl);
        }
        /**
         * Execute the get request
         *
         */
        ContentType.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        ContentType.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return ContentType;
    }(Queryable_1.Queryable));
    exports.ContentType = ContentType;
    Util.applyMixins(ContentType, Mixins.Gettable, Mixins.Selectable);
});

},{"../../utils/util":56,"./Queryable":16,"./mixins":26}],20:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"../../utils/util":56,"./Queryable":16,"./mixins":26,"dup":19}],21:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./queryable", "../../utils/util", "./mixins"], factory);
    }
})(function (require, exports) {
    "use strict";
    var queryable_1 = require("./queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    /**
     * Describes a collection of Field objects
     *
     */
    var Fields = (function (_super) {
        __extends(Fields, _super);
        /**
         * Creates a new instance of the Fields class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Fields(baseUrl) {
            _super.call(this, baseUrl, "fields");
        }
        /**
         * Execute the get request
         *
         */
        Fields.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Fields.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        Fields.prototype.filter = function (filter) { return; };
        return Fields;
    }(queryable_1.Queryable));
    exports.Fields = Fields;
    Util.applyMixins(Fields, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
    /**
     * Describes a single of Field instance
     *
     */
    var Field = (function (_super) {
        __extends(Field, _super);
        /**
         * Creates a new instance of the Field class
         *
         * @param baseUrl The url or Queryable which forms the parent of this field instance
         */
        function Field(baseUrl) {
            _super.call(this, baseUrl);
        }
        /**
         * Execute the get request
         *
         */
        Field.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Field.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return Field;
    }(queryable_1.Queryable));
    exports.Field = Field;
    Util.applyMixins(Field, Mixins.Gettable, Mixins.Selectable);
});

},{"../../utils/util":56,"./mixins":26,"./queryable":28}],22:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins", "./actionables"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    var actionables_1 = require("./actionables");
    /**
     * Describes a collection of File objects
     *
     */
    var Files = (function (_super) {
        __extends(Files, _super);
        /**
         * Creates a new instance of the Files class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Files(baseUrl) {
            _super.call(this, baseUrl, "files");
        }
        /**
         * Gets a File by filename
         *
         * @param name The name of the file, including extension
         */
        Files.prototype.getByName = function (name) {
            this.concat("('" + name + "')");
            return new File(this);
        };
        /**
         * Execute the get request
         *
         */
        Files.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Files.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        Files.prototype.filter = function (filter) { return; };
        return Files;
    }(Queryable_1.Queryable));
    exports.Files = Files;
    Util.applyMixins(Files, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
    /**
     * Describes a single File instance
     *
     */
    var File = (function (_super) {
        __extends(File, _super);
        /**
         * Creates a new instance of the File class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param path Optional, if supplied will be appended to the supplied baseUrl
         */
        function File(baseUrl, path) {
            _super.call(this, baseUrl, path);
        }
        Object.defineProperty(File.prototype, "value", {
            /**
             * Gets the contents of the file - If the file is not JSON a custom parser function should be used with the get call
             *
             */
            get: function () {
                this.append("$value");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(File.prototype, "checkedOutByUser", {
            /**
             * Gets a result indicating the current user who has a file checked out
             *
             */
            get: function () {
                this.append("CheckedOutByUser");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(File.prototype, "eTag", {
            /**
             * Gets the current eTag of a file
             *
             */
            get: function () {
                this.append("ETag");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(File.prototype, "serverRelativeUrl", {
            /**
             * Gets the server relative url of a file
             *
             */
            get: function () {
                this.append("ServerRelativeUrl");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(File.prototype, "versions", {
            /**
             * Gets a collection of versions
             *
             */
            get: function () {
                return new Versions(this);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Execute the get request
         *
         */
        File.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        File.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return File;
    }(Queryable_1.Queryable));
    exports.File = File;
    Util.applyMixins(File, Mixins.Gettable, Mixins.Selectable);
    /**
     * Describes a collection of Version objects
     *
     */
    var Versions = (function (_super) {
        __extends(Versions, _super);
        /**
         * Creates a new instance of the File class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Versions(baseUrl) {
            _super.call(this, baseUrl, "versions");
        }
        /**
         * Gets a version by id
         *
         * @param versionId The id of the version to retrieve
         */
        Versions.prototype.getById = function (versionId) {
            this.concat("(" + versionId + ")");
            return new Version(this);
        };
        /**
         * Execute the get request
         *
         */
        Versions.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Versions.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        Versions.prototype.filter = function (filter) { return; };
        return Versions;
    }(Queryable_1.Queryable));
    exports.Versions = Versions;
    Util.applyMixins(Versions, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
    /**
     * Describes a single Version instance
     *
     */
    var Version = (function (_super) {
        __extends(Version, _super);
        /**
         * Creates a new instance of the Version class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param path Optional, if supplied will be appended to the supplied baseUrl
         */
        function Version(baseUrl, path) {
            _super.call(this, baseUrl, path);
        }
        /**
         * Execute the get request
         *
         */
        Version.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Version.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return Version;
    }(Queryable_1.Queryable));
    exports.Version = Version;
    Util.applyMixins(Version, Mixins.Gettable, Mixins.Selectable);
});

},{"../../utils/util":56,"./Queryable":16,"./actionables":18,"./mixins":26}],23:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins", "./files", "./actionables"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    var files_1 = require("./files");
    var actionables_1 = require("./actionables");
    /**
     * Describes a collection of Folder objects
     *
     */
    var Folders = (function (_super) {
        __extends(Folders, _super);
        /**
         * Creates a new instance of the Folders class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Folders(baseUrl) {
            _super.call(this, baseUrl, "folders");
        }
        /**
         * Gets a folder by folder name
         *
         */
        Folders.prototype.getByName = function (name) {
            this.concat("('" + name + "')");
            return new Folder(this);
        };
        /**
         * Execute the get request
         *
         */
        Folders.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Folders.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        Folders.prototype.filter = function (filter) { return; };
        return Folders;
    }(Queryable_1.Queryable));
    exports.Folders = Folders;
    Util.applyMixins(Folders, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
    /**
     * Describes a single Folder instance
     *
     */
    var Folder = (function (_super) {
        __extends(Folder, _super);
        /**
         * Creates a new instance of the Folder class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param path Optional, if supplied will be appended to the supplied baseUrl
         */
        function Folder(baseUrl, path) {
            _super.call(this, baseUrl, path);
        }
        Object.defineProperty(Folder.prototype, "parentFolder", {
            /**
             * Gets the parent folder, if available
             *
             */
            get: function () {
                return new Folder(this, "ParentFolder");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "folders", {
            /**
             * Gets this folder's sub folders
             *
             */
            get: function () {
                return new Folders(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "name", {
            /**
             * Gets the folders name
             *
             */
            get: function () {
                this.append("Name");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "properties", {
            /**
             * Gets this folder's properties
             *
             */
            get: function () {
                this.append("Properties");
                return new actionables_1.SelectableGettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "serverRelativeUrl", {
            /**
             * Gets this folder's server relative url
             *
             */
            get: function () {
                this.append("ServerRelativeUrl");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Folder.prototype, "files", {
            /**
             * Gets this folder's files
             *
             */
            get: function () {
                return new files_1.Files(this);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Execute the get request
         *
         */
        Folder.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Folder.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return Folder;
    }(Queryable_1.Queryable));
    exports.Folder = Folder;
    Util.applyMixins(Folder, Mixins.Gettable, Mixins.Selectable);
});

},{"../../utils/util":56,"./Queryable":16,"./actionables":18,"./files":22,"./mixins":26}],24:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins", "./actionables", "./folders", "./contenttypes", "./roleassignments"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    var actionables_1 = require("./actionables");
    var folders_1 = require("./folders");
    var contenttypes_1 = require("./contenttypes");
    var roleassignments_1 = require("./roleassignments");
    /**
     * Describes a collection of Item objects
     *
     */
    var Items = (function (_super) {
        __extends(Items, _super);
        /**
         * Creates a new instance of the Items class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Items(baseUrl) {
            _super.call(this, baseUrl, "items");
        }
        /**
         * Gets an Item by id
         *
         * @param id The integer id of the item to retrieve
         */
        Items.prototype.getById = function (id) {
            this.concat("(" + id + ")");
            return new Item(this);
        };
        /**
         * Execute the get request
         *
         */
        Items.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Items.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        Items.prototype.filter = function (filter) { return; };
        return Items;
    }(Queryable_1.Queryable));
    exports.Items = Items;
    Util.applyMixins(Items, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
    /**
     * Descrines a single Item instance
     *
     */
    var Item = (function (_super) {
        __extends(Item, _super);
        /**
         * Creates a new instance of the Items class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Item(baseUrl) {
            _super.call(this, baseUrl);
        }
        Object.defineProperty(Item.prototype, "attachmentFiles", {
            /**
             * Gets the set of attachments for this item
             *
             */
            get: function () {
                this.append("AttachmentFiles");
                return new actionables_1.FilterableSelectableGettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "contentType", {
            /**
             * Gets the content type for this item
             *
             */
            get: function () {
                this.append("ContentType");
                return new contenttypes_1.ContentType(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "effectiveBasePermissions", {
            /**
             * Gets the effective base permissions for the item
             *
             */
            get: function () {
                this.append("EffectiveBasePermissions");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "effectiveBasePermissionsForUI", {
            /**
             * Gets the effective base permissions for the item in a UI context
             *
             */
            get: function () {
                this.append("EffectiveBasePermissionsForUI");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "fieldValuesAsHTML", {
            /**
             * Gets the field values for this list item in their HTML representation
             *
             */
            get: function () {
                this.append("FieldValuesAsHTML");
                return new actionables_1.SelectableGettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "fieldValuesAsText", {
            /**
             * Gets the field values for this list item in their text representation
             *
             */
            get: function () {
                this.append("FieldValuesAsText");
                return new actionables_1.SelectableGettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "fieldValuesForEdit", {
            /**
             * Gets the field values for this list item for use in editing controls
             *
             */
            get: function () {
                this.append("FieldValuesForEdit");
                return new actionables_1.SelectableGettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "firstUniqueAncestorSecurableObject", {
            /**
             * Gets the closest securable up the security hierarchy whose permissions are applied to this list item
             *
             */
            get: function () {
                this.append("FirstUniqueAncestorSecurableObject");
                return new actionables_1.SelectableGettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "folder", {
            /**
             * Gets the folder associated with this list item (if this item represents a folder)
             *
             */
            get: function () {
                return new folders_1.Folder(this, "Folder");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the effective permissions for the user supplied
         *
         * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
         */
        Item.prototype.getUserEffectivePermissions = function (loginName) {
            this.append("getUserEffectivePermissions(@user)");
            this._query.add("@user", "'" + encodeURIComponent(loginName) + "'");
            return new actionables_1.Gettable(this);
        };
        Object.defineProperty(Item.prototype, "roleAssignments", {
            /**
             * Gets the set of role assignments for this item
             *
             */
            get: function () {
                return new roleassignments_1.RoleAssignments(this);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Execute the get request
         *
         */
        Item.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Item.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return Item;
    }(Queryable_1.Queryable));
    exports.Item = Item;
    Util.applyMixins(Item, Mixins.Gettable, Mixins.Selectable);
});

},{"../../utils/util":56,"./Queryable":16,"./actionables":18,"./contenttypes":20,"./folders":23,"./mixins":26,"./roleassignments":31}],25:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./items", "./views", "./contenttypes", "./fields", "./queryable", "../../utils/util", "./mixins", "./actionables"], factory);
    }
})(function (require, exports) {
    "use strict";
    var items_1 = require("./items");
    var views_1 = require("./views");
    var contenttypes_1 = require("./contenttypes");
    var fields_1 = require("./fields");
    var queryable_1 = require("./queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    var actionables_1 = require("./actionables");
    /**
     * Describes a collection of List objects
     *
     */
    var Lists = (function (_super) {
        __extends(Lists, _super);
        /**
         * Creates a new instance of the Lists class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Lists(baseUrl) {
            _super.call(this, baseUrl, "lists");
        }
        /**
         * Gets a list from the collection by title
         *
         * @param title The title of the list
         */
        Lists.prototype.getByTitle = function (title) {
            return new List(this, "getByTitle('" + title + "')");
        };
        /**
         * Gets a list from the collection by guid id
         *
         * @param title The Id of the list
         */
        Lists.prototype.getById = function (id) {
            this.concat("(guid'" + id + "')");
            return new List(this);
        };
        /**
         * Execute the get request
         *
         */
        Lists.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Lists.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        Lists.prototype.filter = function (filter) { return; };
        return Lists;
    }(queryable_1.Queryable));
    exports.Lists = Lists;
    Util.applyMixins(Lists, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
    /**
     * Describes a single List instance
     *
     */
    var List = (function (_super) {
        __extends(List, _super);
        /**
         * Creates a new instance of the Lists class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param path Optional, if supplied will be appended to the supplied baseUrl
         */
        function List(baseUrl, path) {
            _super.call(this, baseUrl, path);
        }
        Object.defineProperty(List.prototype, "contentTypes", {
            /**
             * Gets the content types in this list
             *
             */
            get: function () {
                return new contenttypes_1.ContentTypes(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "items", {
            /**
             * Gets the items in this list
             *
             */
            get: function () {
                return new items_1.Items(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "views", {
            /**
             * Gets the views in this list
             *
             */
            get: function () {
                return new views_1.Views(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "fields", {
            /**
             * Gets the fields in this list
             *
             */
            get: function () {
                return new fields_1.Fields(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "defaultView", {
            /**
             * Gets the default view of this list
             *
             */
            get: function () {
                this.append("DefaultView");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "effectiveBasePermissions", {
            /**
             * Gets the effective base permissions of this list
             *
             */
            get: function () {
                this.append("EffectiveBasePermissions");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "eventReceivers", {
            /**
             * Gets the event receivers attached to this list
             *
             */
            get: function () {
                this.append("EventReceivers");
                return new actionables_1.FilterableSelectableGettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "getRelatedFields", {
            /**
             * Gets the related fields of this list
             *
             */
            get: function () {
                this.append("getRelatedFields");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the effective permissions for the user supplied
         *
         * @param loginName The claims username for the user (ex: i:0#.f|membership|user@domain.com)
         */
        List.prototype.getUserEffectivePermissions = function (loginName) {
            this.append("getUserEffectivePermissions(@user)");
            this._query.add("@user", "'" + encodeURIComponent(loginName) + "'");
            return new actionables_1.Gettable(this);
        };
        Object.defineProperty(List.prototype, "informationRightsManagementSettings", {
            /**
             * Gets the IRM settings for this list
             *
             */
            get: function () {
                this.append("InformationRightsManagementSettings");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "userCustomActions", {
            /**
             * Gets the user custom actions attached to this list
             *
             */
            get: function () {
                this.append("UserCustomActions");
                return new actionables_1.Gettable(this);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets a view by view guid id
         *
         */
        List.prototype.getView = function (viewId) {
            this.append("getView('" + viewId + "')");
            return new views_1.View(this);
        };
        /**
         * Execute the get request
         *
         */
        List.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        List.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return List;
    }(queryable_1.Queryable));
    exports.List = List;
    Util.applyMixins(List, Mixins.Gettable, Mixins.Selectable);
});

},{"../../utils/util":56,"./actionables":18,"./contenttypes":20,"./fields":21,"./items":24,"./mixins":26,"./queryable":28,"./views":35}],26:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./queryable", "../../net/httpClient"], factory);
    }
})(function (require, exports) {
    "use strict";
    var queryable_1 = require("./queryable");
    var httpClient_1 = require("../../net/httpClient");
    /**
     * Implements the $select functionality on classes to which it is applied
     *
     */
    var Selectable = (function (_super) {
        __extends(Selectable, _super);
        function Selectable() {
            _super.apply(this, arguments);
        }
        Selectable.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            this._query.add("$select", selects.join(","));
            return this;
        };
        return Selectable;
    }(queryable_1.Queryable));
    exports.Selectable = Selectable;
    /**
     * Implements the $filter functionality on classes to which it is applied
     *
     */
    var Filterable = (function (_super) {
        __extends(Filterable, _super);
        function Filterable() {
            _super.apply(this, arguments);
        }
        Filterable.prototype.filter = function (filter) {
            this._query.add("$filter", filter);
            return this;
        };
        return Filterable;
    }(queryable_1.Queryable));
    exports.Filterable = Filterable;
    /**
     * Implements the get http request on classes to which it is applied
     *
     */
    var Gettable = (function (_super) {
        __extends(Gettable, _super);
        function Gettable() {
            _super.apply(this, arguments);
        }
        Gettable.prototype.get = function (parser) {
            if (parser === void 0) { parser = function (r) { return r.json(); }; }
            var client = new httpClient_1.HttpClient();
            return client.get(this.toUrlAndQuery()).then(function (response) {
                if (response.status !== 200) {
                    throw "Error making GET request: " + response.statusText;
                }
                return parser(response);
            }).then(function (parsed) {
                return parsed.hasOwnProperty("d") ? parsed.d.hasOwnProperty("results") ? parsed.d.results : parsed.d : parsed;
            });
        };
        return Gettable;
    }(queryable_1.Queryable));
    exports.Gettable = Gettable;
    /**
     * Implements the $top and $skip functionality on classes to which it is applied
     *
     */
    var Pageable = (function (_super) {
        __extends(Pageable, _super);
        function Pageable() {
            _super.apply(this, arguments);
        }
        Pageable.prototype.top = function (pageSize) {
            this._query.add("$top", pageSize.toString());
            return this;
        };
        Pageable.prototype.skip = function (pageStart) {
            this._query.add("$skip", pageStart.toString());
            return this;
        };
        return Pageable;
    }(queryable_1.Queryable));
    exports.Pageable = Pageable;
});

},{"../../net/httpClient":48,"./queryable":28}],27:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./queryable", "./quickLaunch", "./topNavigationBar"], factory);
    }
})(function (require, exports) {
    "use strict";
    var queryable_1 = require("./queryable");
    var quickLaunch_1 = require("./quickLaunch");
    var topNavigationBar_1 = require("./topNavigationBar");
    /**
     * Exposes the navigation components
     *
     */
    var Navigation = (function (_super) {
        __extends(Navigation, _super);
        /**
         * Creates a new instance of the Lists class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Navigation(baseUrl) {
            _super.call(this, baseUrl, "Navigation");
        }
        Object.defineProperty(Navigation.prototype, "quicklaunch", {
            /**
             * Gets the quicklaunch navigation for the current context
             *
             */
            get: function () {
                return new quickLaunch_1.QuickLaunch(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Navigation.prototype, "topNavigationBar", {
            /**
             * Gets the top bar navigation navigation for the current context
             *
             */
            get: function () {
                return new topNavigationBar_1.TopNavigationBar(this);
            },
            enumerable: true,
            configurable: true
        });
        return Navigation;
    }(queryable_1.Queryable));
    exports.Navigation = Navigation;
});

},{"./queryable":28,"./quickLaunch":29,"./topNavigationBar":34}],28:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"../../collections/collections":41,"../../utils/util":56,"dup":16}],29:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    /**
     * Describes the quick launch navigation
     *
     */
    var QuickLaunch = (function (_super) {
        __extends(QuickLaunch, _super);
        /**
         * Creates a new instance of the Lists class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function QuickLaunch(baseUrl) {
            _super.call(this, baseUrl, "QuickLaunch");
        }
        /**
         * Execute the get request
         *
         */
        QuickLaunch.prototype.get = function () { return; };
        return QuickLaunch;
    }(Queryable_1.Queryable));
    exports.QuickLaunch = QuickLaunch;
    Util.applyMixins(QuickLaunch, Mixins.Gettable);
});

},{"../../utils/util":56,"./Queryable":16,"./mixins":26}],30:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    /**
     * Describes a set of role assignments for the current scope
     *
     */
    var RoleAssignments = (function (_super) {
        __extends(RoleAssignments, _super);
        /**
         * Creates a new instance of the RoleAssignments class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function RoleAssignments(baseUrl) {
            _super.call(this, baseUrl, "RoleAssignments");
        }
        /**
         * Execute the get request
         *
         */
        RoleAssignments.prototype.get = function () { return; };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        RoleAssignments.prototype.filter = function (filter) { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        RoleAssignments.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return RoleAssignments;
    }(Queryable_1.Queryable));
    exports.RoleAssignments = RoleAssignments;
    Util.applyMixins(RoleAssignments, Mixins.Gettable, Mixins.Filterable, Mixins.Selectable);
});

},{"../../utils/util":56,"./Queryable":16,"./mixins":26}],31:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"../../utils/util":56,"./Queryable":16,"./mixins":26,"dup":30}],32:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins", "./webs"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    var webs_1 = require("./webs");
    /**
     * Describes a site collection
     *
     */
    var Site = (function (_super) {
        __extends(Site, _super);
        /**
         * Creates a new instance of the RoleAssignments class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Site(baseUrl) {
            _super.call(this, baseUrl, "site");
        }
        Object.defineProperty(Site.prototype, "rootWeb", {
            /**
             * Gets the root web of the site collection
             *
             */
            get: function () {
                return new webs_1.Web(this, "rootweb");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Execute the get request
         *
         */
        Site.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Site.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return Site;
    }(Queryable_1.Queryable));
    exports.Site = Site;
    Util.applyMixins(Site, Mixins.Gettable, Mixins.Selectable);
});

},{"../../utils/util":56,"./Queryable":16,"./mixins":26,"./webs":36}],33:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    /**
     * Describes a collection of site users
     *
     */
    var SiteUsers = (function (_super) {
        __extends(SiteUsers, _super);
        /**
         * Creates a new instance of the SiteUsers class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function SiteUsers(baseUrl) {
            _super.call(this, baseUrl, "SiteUsers");
        }
        /**
         * Execute the get request
         *
         */
        SiteUsers.prototype.get = function () { return; };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        SiteUsers.prototype.filter = function (filter) { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        SiteUsers.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return SiteUsers;
    }(Queryable_1.Queryable));
    exports.SiteUsers = SiteUsers;
    Util.applyMixins(SiteUsers, Mixins.Gettable, Mixins.Filterable, Mixins.Selectable);
});

},{"../../utils/util":56,"./Queryable":16,"./mixins":26}],34:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    /**
     * Describes the top navigation on the site
     *
     */
    var TopNavigationBar = (function (_super) {
        __extends(TopNavigationBar, _super);
        /**
         * Creates a new instance of the SiteUsers class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function TopNavigationBar(baseUrl) {
            _super.call(this, baseUrl, "TopNavigationBar");
        }
        /**
         * Execute the get request
         *
         */
        TopNavigationBar.prototype.get = function () { return; };
        return TopNavigationBar;
    }(Queryable_1.Queryable));
    exports.TopNavigationBar = TopNavigationBar;
    Util.applyMixins(TopNavigationBar, Mixins.Gettable);
});

},{"../../utils/util":56,"./Queryable":16,"./mixins":26}],35:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    /**
     * Describes the views available in the current context
     *
     */
    var Views = (function (_super) {
        __extends(Views, _super);
        /**
         * Creates a new instance of the Views class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function Views(baseUrl) {
            _super.call(this, baseUrl, "views");
        }
        /**
         * Gets a view by guid id
         *
         * @param id The GUID id of the view
         */
        Views.prototype.getById = function (id) {
            this.concat("(guid'" + id + "')");
            return new View(this);
        };
        /**
         * Execute the get request
         *
         */
        Views.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Views.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        /**
         * Applies a filter to the request
         *
         * @param filter The filter string (docs: https://msdn.microsoft.com/en-us/library/office/fp142385.aspx)
         */
        Views.prototype.filter = function (filter) { return; };
        return Views;
    }(Queryable_1.Queryable));
    exports.Views = Views;
    Util.applyMixins(Views, Mixins.Gettable, Mixins.Selectable, Mixins.Filterable);
    /**
     * Describes a single View instance
     *
     */
    var View = (function (_super) {
        __extends(View, _super);
        /**
         * Creates a new instance of the View class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         */
        function View(baseUrl) {
            _super.call(this, baseUrl);
        }
        /**
         * Execute the get request
         *
         */
        View.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        View.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return View;
    }(Queryable_1.Queryable));
    exports.View = View;
    Util.applyMixins(View, Mixins.Gettable, Mixins.Selectable);
});

},{"../../utils/util":56,"./Queryable":16,"./mixins":26}],36:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Queryable", "../../utils/util", "./mixins", "./lists", "./roleAssignments", "./navigation", "./siteUsers", "./contentTypes", "./folders", "./files"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Queryable_1 = require("./Queryable");
    var Util = require("../../utils/util");
    var Mixins = require("./mixins");
    var lists_1 = require("./lists");
    var roleAssignments_1 = require("./roleAssignments");
    var navigation_1 = require("./navigation");
    var siteUsers_1 = require("./siteUsers");
    var contentTypes_1 = require("./contentTypes");
    var folders_1 = require("./folders");
    var files_1 = require("./files");
    /**
     * Describes a web
     *
     */
    var Web = (function (_super) {
        __extends(Web, _super);
        /**
         * Creates a new instance of the View class
         *
         * @param baseUrl The url or Queryable which forms the parent of this fields collection
         * @param webPath Optional, specifies the path used to query for the given web, meant for internal use
         */
        function Web(baseUrl, webPath) {
            if (webPath === void 0) { webPath = "web"; }
            _super.call(this, baseUrl, webPath);
        }
        Object.defineProperty(Web.prototype, "contentTypes", {
            /**
             * Get the content types available in this web
             *
             */
            get: function () {
                return new contentTypes_1.ContentTypes(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Web.prototype, "roleAssignments", {
            /**
             * Get the role assignments applied to this web
             *
             */
            get: function () {
                return new roleAssignments_1.RoleAssignments(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Web.prototype, "lists", {
            /**
             * Get the lists in this web
             *
             */
            get: function () {
                return new lists_1.Lists(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Web.prototype, "navigation", {
            /**
             * Get the navigation options in this web
             *
             */
            get: function () {
                return new navigation_1.Navigation(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Web.prototype, "siteUsers", {
            /**
             * Gets the site users
             *
             */
            get: function () {
                return new siteUsers_1.SiteUsers(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Web.prototype, "folders", {
            /**
             * Get the folders in this web
             *
             */
            get: function () {
                return new folders_1.Folders(this);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Get a folder by server relative url
         *
         * @param folderRelativeUrl the server relative path to the folder (including /sites/ if applicable)
         */
        Web.prototype.getFolderByServerRelativeUrl = function (folderRelativeUrl) {
            return new folders_1.Folder(this, "getFolderByServerRelativeUrl('" + folderRelativeUrl + "')");
        };
        /**
         * Get a file by server relative url
         *
         * @param fileRelativeUrl the server relative path to the file (including /sites/ if applicable)
         */
        Web.prototype.getFileByServerRelativeUrl = function (fileRelativeUrl) {
            return new files_1.File(this, "getFileByServerRelativeUrl('" + fileRelativeUrl + "')");
        };
        /**
         * Execute the get request
         *
         */
        Web.prototype.get = function () { return; };
        /**
         * Select the fields to return
         *
         * @param selects One or more fields to return
         */
        Web.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            return;
        };
        return Web;
    }(Queryable_1.Queryable));
    exports.Web = Web;
    Util.applyMixins(Web, Mixins.Gettable, Mixins.Selectable);
});

},{"../../utils/util":56,"./Queryable":16,"./contentTypes":19,"./files":22,"./folders":23,"./lists":25,"./mixins":26,"./navigation":27,"./roleAssignments":30,"./siteUsers":33}],37:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Provisioning/Provisioning", "./Rest/Rest", "./Util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Provisioning_1 = require("./Provisioning/Provisioning");
    var Rest_1 = require("./Rest/Rest");
    var Util = require("./Util");
    var SharePoint = (function () {
        function SharePoint() {
            /**
             * The REST base class for SharePoint
             */
            this.rest = new Rest_1.Rest();
            /**
            * The Provisioning base class for SharePoint
            */
            this.provisioning = new Provisioning_1.Provisioning();
            this.util = Util;
        }
        return SharePoint;
    }());
    exports.SharePoint = SharePoint;
});

},{"./Provisioning/Provisioning":13,"./Rest/Rest":17,"./Util":38}],38:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * Retrieves the list ID of the current page from _spPageContextInfo
     */
    function getListId() {
        return _spPageContextInfo.hasOwnProperty("pageListId") ? _spPageContextInfo.pageListId.substring(1, 37) : "";
    }
    exports.getListId = getListId;
    /**
     * Make URL relative to host
     *
     * @param url The URL to make relative
     */
    function getRelativeUrl(url) {
        return url.replace(document.location.protocol + "//" + document.location.hostname, "");
    }
    exports.getRelativeUrl = getRelativeUrl;
    /**
     * Retrieves the node with the given title from a collection of SP.NavigationNode
     */
    function getNodeFromCollectionByTitle(nodeCollection, title) {
        var f = jQuery.grep(nodeCollection, function (val) {
            return val.get_title() === title;
        });
        return f[0] || null;
    }
    exports.getNodeFromCollectionByTitle = getNodeFromCollectionByTitle;
    ;
    /**
     * Replaces URL tokens in a string
     */
    function replaceUrlTokens(url) {
        return url.replace(/{site}/g, _spPageContextInfo.webAbsoluteUrl)
            .replace(/{sitecollection}/g, _spPageContextInfo.siteAbsoluteUrl);
    }
    exports.replaceUrlTokens = replaceUrlTokens;
    ;
    function encodePropertyKey(propKey) {
        var bytes = [];
        for (var i = 0; i < propKey.length; ++i) {
            bytes.push(propKey.charCodeAt(i));
            bytes.push(0);
        }
        var b64encoded = window.btoa(String.fromCharCode.apply(null, bytes));
        return b64encoded;
    }
    exports.encodePropertyKey = encodePropertyKey;
});

},{}],39:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],40:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * Combines an arbitrary set of paths ensuring that the slashes are normalized
     *
     * @param paths 0 to n path parts to combine
     */
    function get(url) {
        return jQuery.ajax({
            "url": url,
            "type": "get",
            "headers": { "accept": "application/json;odata=verbose" },
        });
    }
    exports.get = get;
});

},{}],41:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * Generic dictionary
     */
    var Dictionary = (function () {
        /**
         * Creates a new instance of the Dictionary<T> class
         *
         * @constructor
         */
        function Dictionary() {
            this.keys = [];
            this.values = [];
        }
        /**
         * Gets a value from the collection using the specified key
         *
         * @param key The key whose value we want to return, returns null if the key does not exist
         */
        Dictionary.prototype.get = function (key) {
            var index = this.keys.indexOf(key);
            if (index < 0) {
                return null;
            }
            return this.values[index];
        };
        /**
         * Adds the supplied key and value to the dictionary
         *
         * @param key The key to add
         * @param o The value to add
         */
        Dictionary.prototype.add = function (key, o) {
            var index = this.keys.indexOf(key);
            if (index > -1) {
                this.values[index] = o;
            }
            else {
                this.keys.push(key);
                this.values.push(o);
            }
        };
        /**
         * Merges the supplied typed hash into this dictionary instance. Existing values are updated and new ones are created as appropriate.
         */
        Dictionary.prototype.merge = function (source) {
            console.log("Type of source: " + typeof source);
            if (typeof source === "ITypedHash<T>") {
                var sourceAsHash = source;
                for (var key in sourceAsHash) {
                    if (sourceAsHash.hasOwnProperty(key)) {
                        this.add(key, source[key]);
                    }
                }
            }
            else {
                var sourceAsDictionary = source;
                var keys = sourceAsDictionary.getKeys();
                var l = keys.length;
                for (var i = 0; i < l; i++) {
                    this.add(keys[i], sourceAsDictionary.get(keys[i]));
                }
            }
        };
        /**
         * Removes a value from the dictionary
         *
         * @param key The key of the key/value pair to remove. Returns null if the key was not found.
         */
        Dictionary.prototype.remove = function (key) {
            var index = this.keys.indexOf(key);
            if (index < 0) {
                // could throw an exception here
                return null;
            }
            var val = this.values[index];
            this.keys.splice(index, 1);
            this.values.splice(index, 1);
            return val;
        };
        /**
         * Returns all the keys currently in the dictionary as an array
         */
        Dictionary.prototype.getKeys = function () {
            return this.keys;
        };
        /**
         * Returns all the values currently in the dictionary as an array
         */
        Dictionary.prototype.getValues = function () {
            return this.values;
        };
        /**
         * Clears the current dictionary
         */
        Dictionary.prototype.clear = function () {
            this.keys = [];
            this.values = [];
        };
        /**
         * Gets a count of the items currently in the dictionary
         */
        Dictionary.prototype.count = function () {
            return this.keys.length;
        };
        return Dictionary;
    }());
    exports.Dictionary = Dictionary;
});

},{}],42:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../collections/collections", "./providers/providers"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Collections = require("../collections/collections");
    var providers = require("./providers/providers");
    /**
     * Set of pre-defined providers which are available from this library
     */
    exports.Providers = providers;
    /**
     * Class used to manage the current application settings
     *
     */
    var Settings = (function () {
        /**
         * Creates a new instance of the settings class
         *
         * @constructor
         */
        function Settings() {
            this._settings = new Collections.Dictionary();
        }
        /**
         * Adds a new single setting, or overwrites a previous setting with the same key
         *
         * @param {string} key The key used to store this setting
         * @param {string} value The setting value to store
         */
        Settings.prototype.add = function (key, value) {
            this._settings.add(key, value);
        };
        /**
         * Adds a JSON value to the collection as a string, you must use getJSON to rehydrate the object when read
         *
         * @param {string} key The key used to store this setting
         * @param {any} value The setting value to store
         */
        Settings.prototype.addJSON = function (key, value) {
            this._settings.add(key, JSON.stringify(value));
        };
        /**
         * Applies the supplied hash to the setting collection overwriting any existing value, or created new values
         *
         * @param {Collections.ITypedHash<any>} hash The set of values to add
         */
        Settings.prototype.apply = function (hash) {
            this._settings.merge(hash);
        };
        /**
         * Loads configuration settings into the collection from the supplied provider and returns a Promise
         *
         * @param {IConfigurationProvider} provider The provider from which we will load the settings
         */
        Settings.prototype.load = function (provider) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                provider.getConfiguration().then(function (value) {
                    _this._settings.merge(value);
                    resolve();
                }).catch(function (reason) {
                    reject(reason);
                });
            });
        };
        /**
         * Gets a value from the configuration
         *
         * @param {string} key The key whose value we want to return. Returns null if the key does not exist
         * @return {string} string value from the configuration
         */
        Settings.prototype.get = function (key) {
            return this._settings.get(key);
        };
        /**
         * Gets a JSON value, rehydrating the stored string to the original object
         *
         * @param {string} key The key whose value we want to return. Returns null if the key does not exist
         * @return {any} object from the configuration
         */
        Settings.prototype.getJSON = function (key) {
            var o = this.get(key);
            if (typeof o === "undefined" || o === null) {
                return o;
            }
            return JSON.parse(o);
        };
        return Settings;
    }());
    exports.Settings = Settings;
});

},{"../collections/collections":41,"./providers/providers":44}],43:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../../utils/storage"], factory);
    }
})(function (require, exports) {
    "use strict";
    var storage = require("../../utils/storage");
    /**
     * A caching provider which can wrap other non-caching providers
     *
     */
    var CachingConfigurationProvider = (function () {
        /**
         * Creates a new caching configuration provider
         * @constructor
         * @param {IConfigurationProvider} wrappedProvider Provider which will be used to fetch the configuration
         * @param {string} cacheKey Key that will be used to store cached items to the cache
         * @param {IPnPClientStore} cacheStore OPTIONAL storage, which will be used to store cached settings.
         */
        function CachingConfigurationProvider(wrappedProvider, cacheKey, cacheStore) {
            this.wrappedProvider = wrappedProvider;
            this.store = (cacheStore) ? cacheStore : this.selectPnPCache();
            this.cacheKey = "_configcache_" + cacheKey;
        }
        /**
         * Gets the wrapped configuration providers
         *
         * @return {IConfigurationProvider} Wrapped configuration provider
         */
        CachingConfigurationProvider.prototype.getWrappedProvider = function () {
            return this.wrappedProvider;
        };
        /**
         * Loads the configuration values either from the cache or from the wrapped provider
         *
         * @return {Promise<ITypedHash<string>>} Promise of loaded configuration values
         */
        CachingConfigurationProvider.prototype.getConfiguration = function () {
            var _this = this;
            // Cache not available, pass control to  the wrapped provider
            if ((!this.store) || (!this.store.enabled)) {
                return this.wrappedProvider.getConfiguration();
            }
            // Value is found in cache, return it directly
            var cachedConfig = this.store.get(this.cacheKey);
            if (cachedConfig) {
                return new Promise(function (resolve, reject) {
                    resolve(cachedConfig);
                });
            }
            // Get and cache value from the wrapped provider
            var providerPromise = this.wrappedProvider.getConfiguration();
            providerPromise.then(function (providedConfig) {
                _this.store.put(_this.cacheKey, providedConfig);
            });
            return providerPromise;
        };
        CachingConfigurationProvider.prototype.selectPnPCache = function () {
            var pnpCache = new storage.PnPClientStorage();
            if ((pnpCache.local) && (pnpCache.local.enabled)) {
                return pnpCache.local;
            }
            if ((pnpCache.session) && (pnpCache.session.enabled)) {
                return pnpCache.session;
            }
            throw new Error("Cannot create a caching configuration provider since cache is not available.");
        };
        return CachingConfigurationProvider;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CachingConfigurationProvider;
});

},{"../../utils/storage":55}],44:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./cachingConfigurationProvider", "./spListConfigurationProvider"], factory);
    }
})(function (require, exports) {
    "use strict";
    var cachingConfigurationProvider_1 = require("./cachingConfigurationProvider");
    var spListConfigurationProvider_1 = require("./spListConfigurationProvider");
    exports.CachingConfigurationProvider = cachingConfigurationProvider_1.default;
    exports.SPListConfigurationProvider = spListConfigurationProvider_1.default;
});

},{"./cachingConfigurationProvider":43,"./spListConfigurationProvider":45}],45:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./cachingConfigurationProvider", "../../Utils/Ajax"], factory);
    }
})(function (require, exports) {
    "use strict";
    var cachingConfigurationProvider_1 = require("./cachingConfigurationProvider");
    var ajax = require("../../Utils/Ajax");
    /**
     * A configuration provider which loads configuration values from a SharePoint list
     *
     */
    var SPListConfigurationProvider = (function () {
        /**
         * Creates a new SharePoint list based configuration provider
         * @constructor
         * @param {string} webUrl Url of the SharePoint site, where the configuration list is located
         * @param {string} listTitle Title of the SharePoint list, which contains the configuration settings (optional, default = "config")
         */
        function SPListConfigurationProvider(webUrl, listTitle) {
            if (listTitle === void 0) { listTitle = "config"; }
            this.webUrl = webUrl;
            this.listTitle = listTitle;
        }
        /**
         * Gets the url of the SharePoint site, where the configuration list is located
         *
         * @return {string} Url address of the site
         */
        SPListConfigurationProvider.prototype.getWebUrl = function () {
            return this.webUrl;
        };
        /**
         * Gets the title of the SharePoint list, which contains the configuration settings
         *
         * @return {string} List title
         */
        SPListConfigurationProvider.prototype.getListTitle = function () {
            return this.listTitle;
        };
        /**
         * Loads the configuration values from the SharePoint list
         *
         * @return {Promise<ITypedHash<string>>} Promise of loaded configuration values
         */
        SPListConfigurationProvider.prototype.getConfiguration = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var url = _this.webUrl + "/_api/web/lists/getByTitle('" + _this.listTitle + "')/items?$select=Title,Value";
                ajax.get(url).success(function (data) {
                    var results = (data.d.hasOwnProperty("results")) ? data.d.results : data.d;
                    var configuration = {};
                    results.forEach(function (i) {
                        configuration[i.Title] = i.Value;
                    });
                    resolve(configuration);
                });
            });
        };
        /**
         * Wraps the current provider in a cache enabled provider
         *
         * @return {CachingConfigurationProvider} Caching providers which wraps the current provider
         */
        SPListConfigurationProvider.prototype.asCaching = function () {
            var cacheKey = "splist_" + this.webUrl + "+" + this.listTitle;
            return new cachingConfigurationProvider_1.default(this, cacheKey);
        };
        return SPListConfigurationProvider;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SPListConfigurationProvider;
});

},{"../../Utils/Ajax":40,"./cachingConfigurationProvider":43}],46:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../collections/collections", "../utils/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var collections_1 = require("../collections/collections");
    var Util = require("../utils/util");
    var CachedDigest = (function () {
        function CachedDigest() {
        }
        return CachedDigest;
    }());
    exports.CachedDigest = CachedDigest;
    var DigestCache = (function () {
        function DigestCache(_httpClient, _digests) {
            if (_digests === void 0) { _digests = new collections_1.Dictionary(); }
            this._httpClient = _httpClient;
            this._digests = _digests;
        }
        DigestCache.prototype.getDigest = function (webUrl) {
            var self = this;
            var cachedDigest = this._digests.get(webUrl);
            if (cachedDigest !== null) {
                var now = new Date();
                if (now < cachedDigest.expiration) {
                    return Promise.resolve(cachedDigest.value);
                }
            }
            var url = Util.combinePaths(webUrl, "/_api/contextinfo");
            return self._httpClient.fetchRaw(url, {
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json;odata=verbose;charset=utf-8",
                },
                method: "POST",
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                var newCachedDigest = new CachedDigest();
                newCachedDigest.value = data.FormDigestValue;
                var seconds = data.FormDigestTimeoutSeconds;
                var expiration = new Date();
                expiration.setTime(expiration.getTime() + 1000 * seconds);
                newCachedDigest.expiration = expiration;
                self._digests.add(webUrl, newCachedDigest);
                return newCachedDigest.value;
            });
        };
        DigestCache.prototype.clear = function () {
            this._digests.clear();
        };
        return DigestCache;
    }());
    exports.DigestCache = DigestCache;
});

},{"../collections/collections":41,"../utils/util":56}],47:[function(require,module,exports){
(function (global){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var FetchClient = (function () {
        function FetchClient() {
        }
        FetchClient.prototype.fetch = function (url, options) {
            return global.fetch(url, options);
        };
        return FetchClient;
    }());
    exports.FetchClient = FetchClient;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],48:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./fetchClient", "./digestCache", "../utils/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var fetchClient_1 = require("./fetchClient");
    var digestCache_1 = require("./digestCache");
    var Util = require("../utils/util");
    var HttpClient = (function () {
        function HttpClient(_impl) {
            if (_impl === void 0) { _impl = new fetchClient_1.FetchClient(); }
            this._impl = _impl;
            this._digestCache = new digestCache_1.DigestCache(this);
        }
        HttpClient.prototype.fetch = function (url, options) {
            if (options === void 0) { options = {}; }
            var self = this;
            var opts = Util.extend(options, { cache: "no-cache", credentials: "same-origin" }, true);
            var headers = new Headers();
            if (typeof options.headers !== "undefined") {
                var temp = new Request("", { headers: options.headers });
                temp.headers.forEach(function (value, name) {
                    headers.append(name, value);
                });
            }
            if (!headers.has("Accept")) {
                headers.append("Accept", "application/json");
            }
            if (!headers.has("Content-type")) {
                headers.append("Content-type", "application/json;odata=verbose;charset=utf-8");
            }
            opts = Util.extend(opts, { headers: headers });
            if (opts.method && opts.method.toUpperCase() !== "GET") {
                if (!headers.has("X-RequestDigest")) {
                    var index = url.indexOf("/_api/");
                    if (index < 0) {
                        throw new Error("Unable to determine API url");
                    }
                    var webUrl = url.substr(0, index);
                    return this._digestCache.getDigest(webUrl)
                        .then(function (digest) {
                        headers.append("X-RequestDigest", digest);
                        return self.fetchRaw(url, opts);
                    });
                }
            }
            return self.fetchRaw(url, opts);
        };
        HttpClient.prototype.fetchRaw = function (url, options) {
            if (options === void 0) { options = {}; }
            return this._impl.fetch(url, options);
        };
        HttpClient.prototype.get = function (url, options) {
            if (options === void 0) { options = {}; }
            var opts = Util.extend(options, { method: "GET" });
            return this.fetch(url, opts);
        };
        HttpClient.prototype.post = function (url, options) {
            if (options === void 0) { options = {}; }
            var opts = Util.extend(options, { method: "POST" });
            return this.fetch(url, opts);
        };
        return HttpClient;
    }());
    exports.HttpClient = HttpClient;
});

},{"../utils/util":56,"./digestCache":46,"./fetchClient":47}],49:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./utils/Util", "./SharePoint/SharePoint", "./utils/Storage", "./configuration/configuration", "./utils/logging"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Util = require("./utils/Util");
    var SharePoint_1 = require("./SharePoint/SharePoint");
    var Storage_1 = require("./utils/Storage");
    var Configuration = require("./configuration/configuration");
    var logging_1 = require("./utils/logging");
    /**
     * Root class of the Patterns and Practices namespace, provides an entry point to the library
     */
    var PnP = (function () {
        function PnP() {
        }
        /**
         * Utility methods
         */
        PnP.util = Util;
        /**
         * SharePoint
         */
        PnP.sharepoint = new SharePoint_1.SharePoint();
        /**
         * Provides access to local and session storage through
         */
        PnP.storage = new Storage_1.PnPClientStorage();
        /**
         * Configuration
         */
        PnP.configuration = Configuration;
        /**
         * Global logging instance to which subscribers can be registered and messages written
         */
        PnP.logging = new logging_1.Logger();
        return PnP;
    }());
    return PnP;
});

},{"./SharePoint/SharePoint":37,"./configuration/configuration":42,"./utils/Storage":51,"./utils/Util":52,"./utils/logging":54}],50:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],51:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./Util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Util = require("./Util");
    /**
     * A wrapper class to provide a consistent interface to browser based storage
     *
     */
    var PnPClientStorageWrapper = (function () {
        /**
         * Creates a new instance of the PnPClientStorageWrapper class
         *
         * @constructor
         */
        function PnPClientStorageWrapper(store, defaultTimeoutMinutes) {
            this.store = store;
            this.defaultTimeoutMinutes = defaultTimeoutMinutes;
            this.defaultTimeoutMinutes = (defaultTimeoutMinutes === void 0) ? 5 : defaultTimeoutMinutes;
            this.enabled = this.test();
        }
        /**
         * Get a value from storage, or null if that value does not exist
         *
         * @param key The key whose value we want to retrieve
         */
        PnPClientStorageWrapper.prototype.get = function (key) {
            if (!this.enabled) {
                return null;
            }
            var o = this.store.getItem(key);
            if (o == null) {
                return o;
            }
            var persistable = JSON.parse(o);
            if (new Date(persistable.expiration) <= new Date()) {
                this.delete(key);
                o = null;
            }
            else {
                o = persistable.value;
            }
            return o;
        };
        /**
         * Adds a value to the underlying storage
         *
         * @param key The key to use when storing the provided value
         * @param o The value to store
         * @param expire Optional, if provided the expiration of the item, otherwise the default is used
         */
        PnPClientStorageWrapper.prototype.put = function (key, o, expire) {
            if (this.enabled) {
                this.store.setItem(key, this.createPersistable(o, expire));
            }
        };
        /**
         * Deletes a value from the underlying storage
         *
         * @param key The key of the pair we want to remove from storage
         */
        PnPClientStorageWrapper.prototype.delete = function (key) {
            if (this.enabled) {
                this.store.removeItem(key);
            }
        };
        /**
         * Gets an item from the underlying storage, or adds it if it does not exist using the supplied getter function
         *
         * @param key The key to use when storing the provided value
         * @param getter A function which will upon execution provide the desired value
         * @param expire Optional, if provided the expiration of the item, otherwise the default is used
         */
        PnPClientStorageWrapper.prototype.getOrPut = function (key, getter, expire) {
            if (!this.enabled) {
                return getter();
            }
            if (!Util.isFunction(getter)) {
                throw "Function expected for parameter 'getter'.";
            }
            var o = this.get(key);
            if (o == null) {
                o = getter();
                this.put(key, o);
            }
            return o;
        };
        /**
         * Used to determine if the wrapped storage is available currently
         */
        PnPClientStorageWrapper.prototype.test = function () {
            var str = "test";
            try {
                this.store.setItem(str, str);
                this.store.removeItem(str);
                return true;
            }
            catch (e) {
                return false;
            }
        };
        /**
         * Creates the persistable to store
         */
        PnPClientStorageWrapper.prototype.createPersistable = function (o, expire) {
            if (typeof expire === "undefined") {
                expire = Util.dateAdd(new Date(), "minute", this.defaultTimeoutMinutes);
            }
            return JSON.stringify({ expiration: expire, value: o });
        };
        return PnPClientStorageWrapper;
    }());
    exports.PnPClientStorageWrapper = PnPClientStorageWrapper;
    /**
     * A class that will establish wrappers for both local and session storage
     */
    var PnPClientStorage = (function () {
        /**
         * Creates a new instance of the PnPClientStorage class
         *
         * @constructor
         */
        function PnPClientStorage() {
            this.local = typeof localStorage !== "undefined" ? new PnPClientStorageWrapper(localStorage) : null;
            this.session = typeof sessionStorage !== "undefined" ? new PnPClientStorageWrapper(sessionStorage) : null;
        }
        return PnPClientStorage;
    }());
    exports.PnPClientStorage = PnPClientStorage;
});

},{"./Util":52}],52:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    /**
     * Gets a callback function which will maintain context across async calls.
     * Allows for the calling pattern getCtxCallback(thisobj, method, methodarg1, methodarg2, ...)
     *
     * @param context The object that will be the 'this' value in the callback
     * @param method The method to which we will apply the context and parameters
     * @param params Optional, additional arguments to supply to the wrapped method when it is invoked
     */
    function getCtxCallback(context, method) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        return function () {
            method.apply(context, params);
        };
    }
    exports.getCtxCallback = getCtxCallback;
    /**
     * Tests if a url param exists
     *
     * @param name The name of the url paramter to check
     */
    function urlParamExists(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        return regex.test(location.search);
    }
    exports.urlParamExists = urlParamExists;
    /**
     * Gets a url param value by name
     *
     * @param name The name of the paramter for which we want the value
     */
    function getUrlParamByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    exports.getUrlParamByName = getUrlParamByName;
    /**
     * Gets a url param by name and attempts to parse a bool value
     *
     * @param name The name of the paramter for which we want the boolean value
     */
    function getUrlParamBoolByName(name) {
        var p = getUrlParamByName(name);
        var isFalse = (p === "" || /false|0/i.test(p));
        return !isFalse;
    }
    exports.getUrlParamBoolByName = getUrlParamBoolByName;
    /**
     * Inserts the string s into the string target as the index specified by index
     *
     * @param target The string into which we will insert s
     * @param index The location in target to insert s (zero based)
     * @param s The string to insert into target at position index
     */
    function stringInsert(target, index, s) {
        if (index > 0) {
            return target.substring(0, index) + s + target.substring(index, target.length);
        }
        return s + target;
    }
    exports.stringInsert = stringInsert;
    /**
     * Adds a value to a date
     *
     * @param date The date to which we will add units, done in local time
     * @param interval The name of the interval to add, one of: ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']
     * @param units The amount to add to date of the given interval
     *
     * http://stackoverflow.com/questions/1197928/how-to-add-30-minutes-to-a-javascript-date-object
     */
    function dateAdd(date, interval, units) {
        var ret = new Date(date.toLocaleString()); // don't change original date
        switch (interval.toLowerCase()) {
            case "year":
                ret.setFullYear(ret.getFullYear() + units);
                break;
            case "quarter":
                ret.setMonth(ret.getMonth() + 3 * units);
                break;
            case "month":
                ret.setMonth(ret.getMonth() + units);
                break;
            case "week":
                ret.setDate(ret.getDate() + 7 * units);
                break;
            case "day":
                ret.setDate(ret.getDate() + units);
                break;
            case "hour":
                ret.setTime(ret.getTime() + units * 3600000);
                break;
            case "minute":
                ret.setTime(ret.getTime() + units * 60000);
                break;
            case "second":
                ret.setTime(ret.getTime() + units * 1000);
                break;
            default:
                ret = undefined;
                break;
        }
        return ret;
    }
    exports.dateAdd = dateAdd;
    /**
     * Loads a stylesheet into the current page
     *
     * @param path The url to the stylesheet
     * @param avoidCache If true a value will be appended as a query string to avoid browser caching issues
     */
    function loadStylesheet(path, avoidCache) {
        if (avoidCache) {
            path += "?" + encodeURIComponent((new Date()).getTime().toString());
        }
        var head = document.getElementsByTagName("head");
        if (head.length > 1) {
            var e = document.createElement("link");
            head[0].appendChild(e);
            e.setAttribute("type", "text/css");
            e.setAttribute("rel", "stylesheet");
            e.setAttribute("href", path);
        }
    }
    exports.loadStylesheet = loadStylesheet;
    /**
     * Combines an arbitrary set of paths ensuring that the slashes are normalized
     *
     * @param paths 0 to n path parts to combine
     */
    function combinePaths() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i - 0] = arguments[_i];
        }
        var parts = [];
        for (var i = 0; i < paths.length; i++) {
            if (typeof paths[i] !== "undefined" && paths[i] !== null) {
                parts.push(paths[i].replace(/^[\\|\/]/, "").replace(/[\\|\/]$/, ""));
            }
        }
        return parts.join("/").replace(/\\/, "/");
    }
    exports.combinePaths = combinePaths;
    /**
     * Gets a random string of chars length
     *
     * @param chars The length of the random string to generate
     */
    function getRandomString(chars) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < chars; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    exports.getRandomString = getRandomString;
    /**
     * Gets a random GUID value
     *
     * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     */
    function getGUID() {
        var d = new Date().getTime();
        var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return guid;
    }
    exports.getGUID = getGUID;
    /**
     * Determines if a given value is a function
     *
     * @param candidateFunction The thing to test for being a function
     */
    function isFunction(candidateFunction) {
        return typeof candidateFunction === "function";
    }
    exports.isFunction = isFunction;
    /**
     * Determines if a string is null or empty or undefined
     *
     * @param s The string to test
     */
    function stringIsNullOrEmpty(s) {
        return typeof s === "undefined" || s === null || s === "";
    }
    exports.stringIsNullOrEmpty = stringIsNullOrEmpty;
    /**
     * Provides functionality to extend the given object by doign a shallow copy
     *
     * @param target The object to which properties will be copied
     * @param source The source object from which properties will be copied
     * @param noOverwrite If true existing properties on the target are not overwritten from the source
     *
     */
    /* tslint:disable:forin */
    function extend(target, source, noOverwrite) {
        if (noOverwrite === void 0) { noOverwrite = false; }
        var result = {};
        for (var id in target) {
            result[id] = target[id];
        }
        // ensure we don't overwrite things we don't want overwritten
        var check = noOverwrite ? function (o, i) { return !o.hasOwnProperty(i); } : function (o, i) { return true; };
        for (var id in source) {
            if (check(result, id)) {
                result[id] = source[id];
            }
        }
        return result;
    }
    exports.extend = extend;
    /* tslint:enable */
    /**
     * Applies one or more mixins to the supplied target
     *
     * @param derivedCtor The classto which we will apply the mixins
     * @param baseCtors One or more mixin classes to apply
     */
    function applyMixins(derivedCtor) {
        var baseCtors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            baseCtors[_i - 1] = arguments[_i];
        }
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
    exports.applyMixins = applyMixins;
    /**
     * Determines if a given url is absolute
     *
     * @param url The url to check to see if it is absolute
     */
    function isUrlAbsolute(url) {
        return /^https?:\/\/|^\/\//i.test(url);
    }
    exports.isUrlAbsolute = isUrlAbsolute;
});

},{}],53:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./util"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Util = require("./util");
    /**
     * Throws an exception if the supplied string value is null or emptry
     *
     * @param value The string to test
     * @param parameterName The name of the parameter, included in the thrown exception message
     */
    function stringIsNullOrEmpty(value, parameterName) {
        if (Util.stringIsNullOrEmpty(value)) {
            throw "Parameter '" + parameterName + "' cannot be null or empty.";
        }
    }
    exports.stringIsNullOrEmpty = stringIsNullOrEmpty;
    /**
     * Throws an exception if the supplied object is null
     *
     * @param value The object to test
     * @param parameterName The name of the parameter, included in the thrown exception message
     */
    function objectIsNull(value, parameterName) {
        if (typeof value === "undefined" || value === null) {
            throw "Parameter '" + parameterName + "' cannot be null.";
        }
    }
    exports.objectIsNull = objectIsNull;
});

},{"./util":56}],54:[function(require,module,exports){
(function (factory) {/* istanbul ignore next */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./args"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Args = require("./args");
    /**
     * A set of logging levels
     *
     */
    (function (LogLevel) {
        LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
        LogLevel[LogLevel["Info"] = 1] = "Info";
        LogLevel[LogLevel["Warning"] = 2] = "Warning";
        LogLevel[LogLevel["Error"] = 3] = "Error";
        LogLevel[LogLevel["Off"] = 99] = "Off";
    })(exports.LogLevel || (exports.LogLevel = {}));
    var LogLevel = exports.LogLevel;
    /**
     * Class used to subscribe ILogListener and log messages throughout an application
     *
     */
    var Logger = (function () {
        /**
         * Creates a new instance of the Logger class
         *
         * @constructor
         * @param activeLogLevel the level used to filter messages (Default: LogLevel.Warning)
         * @param subscribers [Optional] if provided will initialize the array of subscribed listeners
         */
        function Logger(activeLogLevel, subscribers) {
            if (activeLogLevel === void 0) { activeLogLevel = LogLevel.Warning; }
            if (subscribers === void 0) { subscribers = []; }
            this.activeLogLevel = activeLogLevel;
            this.subscribers = subscribers;
        }
        /**
         * Adds an ILogListener instance to the set of subscribed listeners
         *
         */
        Logger.prototype.subscribe = function (listener) {
            Args.objectIsNull(listener, "listener");
            this.subscribers.push(listener);
        };
        /**
         * Gets the current subscriber count
         */
        Logger.prototype.count = function () {
            return this.subscribers.length;
        };
        /**
         * Writes the supplied string to the subscribed listeners
         *
         * @param message The message to write
         * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Verbose)
         */
        Logger.prototype.write = function (message, level) {
            if (level === void 0) { level = LogLevel.Verbose; }
            this.log({ level: level, message: message });
        };
        /**
         * Logs the supplied entry to the subscribed listeners
         *
         * @param entry The message to log
         */
        Logger.prototype.log = function (entry) {
            Args.objectIsNull(entry, "entry");
            if (entry.level < this.activeLogLevel) {
                return;
            }
            for (var i = 0; i < this.subscribers.length; i++) {
                this.subscribers[i].log(entry);
            }
        };
        /**
         * Logs performance tracking data for the the execution duration of the supplied function using console.profile
         *
         * @param name The name of this profile boundary
         * @param f The function to execute and track within this performance boundary
         */
        Logger.prototype.measure = function (name, f) {
            console.profile(name);
            try {
                return f();
            }
            finally {
                console.profileEnd();
            }
        };
        return Logger;
    }());
    exports.Logger = Logger;
    /**
     * Implementation of ILogListener which logs to the browser console
     *
     */
    var ConsoleListener = (function () {
        function ConsoleListener() {
        }
        /**
         * Any associated data that a given logging listener may choose to log or ignore
         *
         * @param entry The information to be logged
         */
        ConsoleListener.prototype.log = function (entry) {
            var msg = this.format(entry);
            switch (entry.level) {
                case LogLevel.Verbose:
                case LogLevel.Info:
                    console.log(msg);
                    break;
                case LogLevel.Warning:
                    console.warn(msg);
                    break;
                case LogLevel.Error:
                    console.error(msg);
                    break;
            }
        };
        /**
         * Formats the message
         *
         * @param entry The information to format into a string
         */
        ConsoleListener.prototype.format = function (entry) {
            return "Message: " + entry.message + ". Data: " + JSON.stringify(entry.data);
        };
        return ConsoleListener;
    }());
    exports.ConsoleListener = ConsoleListener;
    /* tslint:disable */
    /**
     * Implementation of ILogListener which logs to Azure Insights
     *
     */
    var AzureInsightsListener = (function () {
        /**
         * Creats a new instance of the AzureInsightsListener class
         *
         * @constructor
         * @param azureInsightsInstrumentationKey The instrumentation key created when the Azure Insights instance was created
         */
        function AzureInsightsListener(azureInsightsInstrumentationKey) {
            this.azureInsightsInstrumentationKey = azureInsightsInstrumentationKey;
            Args.stringIsNullOrEmpty(azureInsightsInstrumentationKey, "azureInsightsInstrumentationKey");
            var appInsights = window["appInsights"] || function (config) {
                function r(config) {
                    t[config] = function () {
                        var i = arguments;
                        t.queue.push(function () { t[config].apply(t, i); });
                    };
                }
                var t = { config: config }, u = document, e = window, o = "script", s = u.createElement(o), i, f;
                for (s.src = config.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js", u.getElementsByTagName(o)[0].parentNode.appendChild(s), t.cookie = u.cookie, t.queue = [], i = ["Event", "Exception", "Metric", "PageView", "Trace"]; i.length;) {
                    r("track" + i.pop());
                }
                return r("setAuthenticatedUserContext"), r("clearAuthenticatedUserContext"), config.disableExceptionTracking || (i = "onerror", r("_" + i), f = e[i], e[i] = function (config, r, u, e, o) {
                    var s = f && f(config, r, u, e, o);
                    return s !== !0 && t["_" + i](config, r, u, e, o), s;
                }), t;
            }({
                instrumentationKey: this.azureInsightsInstrumentationKey
            });
            window["appInsights"] = appInsights;
        }
        /**
         * Any associated data that a given logging listener may choose to log or ignore
         *
         * @param entry The information to be logged
         */
        AzureInsightsListener.prototype.log = function (entry) {
            var ai = window["appInsights"];
            var msg = this.format(entry);
            if (entry.level === LogLevel.Error) {
                ai.trackException(msg);
            }
            else {
                ai.trackEvent(msg);
            }
        };
        /**
         * Formats the message
         *
         * @param entry The information to format into a string
         */
        AzureInsightsListener.prototype.format = function (entry) {
            return "Message: " + entry.message + ". Data: " + JSON.stringify(entry.data);
        };
        return AzureInsightsListener;
    }());
    exports.AzureInsightsListener = AzureInsightsListener;
    /* tslint:enable */
    /**
     * Implementation of ILogListener which logs to the supplied function
     *
     */
    var FunctionListener = (function () {
        /**
         * Creates a new instance of the FunctionListener class
         *
         * @constructor
         * @param  method The method to which any logging data will be passed
         */
        function FunctionListener(method) {
            this.method = method;
        }
        /**
         * Any associated data that a given logging listener may choose to log or ignore
         *
         * @param entry The information to be logged
         */
        FunctionListener.prototype.log = function (entry) {
            this.method(entry);
        };
        return FunctionListener;
    }());
    exports.FunctionListener = FunctionListener;
});

},{"./args":53}],55:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"./Util":52,"dup":51}],56:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}]},{},[49])(49)
});