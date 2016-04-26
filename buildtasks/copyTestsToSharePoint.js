//******************************************************************************
//* copyTestToSharePoint.js
//*
//* Defines a custom gulp task that copies the tests
//* to an Office 365/SharePoint Online site specified in the custom 
//* settings.json file in the root of this repository.
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    cache = require('gulp-cached'),
    spsave = require("gulp-spsave");

//******************************************************************************
//* COPYTESTSTOSHAREPOINT
//******************************************************************************
gulp.task("copyTestsToSharePoint", ["lint", "package", "build-tests", "copyRequireJsToSharePoint", "copyJsToSharePoint"], function() {

    if (global.settings.siteUrl === "") {
        throw "A required custom 'settings.js' file is not present in root of this repository. Make a copy of settings.example.js, rename it as settings.js, and fill out the appropriate settings for your site.";
    }
    
    return gulp.src("./lib/tests/**/*.js")
        .pipe(cache('PnPJsTests'))
        .pipe(spsave({
            username: global.settings.username,
            password: global.settings.password,
            siteUrl: global.settings.siteUrl,
            folder: "Style%20Library/pnp/tests"
        }));
});


gulp.task('watchTestsToSharePoint', function () {
    gulp.watch('./lib/tests/**/*.js', ['copyTestsToSharePoint']);
});
