//******************************************************************************
//* travisci.js
//*
//* Defines a set of gulp tasks used to integrate with travisci
//******************************************************************************

var gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    tslint = require("gulp-tslint"),
    config = require('./@configuration.js');

gulp.task("travis:lint", function () {
    return gulp.src(config.paths.sourceGlob)
        .pipe(tslint({ formatter: "prose" }))
        .pipe(tslint.report({ emitError: true }));
});

gulp.task("travis:webtest", ["build:testing"], () => {

    // we shim up the global settings here from the environment vars configured for travis
    global.settings = {
        testing: {
            clientId: process.env.PnPTesting_ClientId,
            clientSecret: process.env.PnPTesting_ClientSecret,
            enableWebTests: true,
            siteUrl: process.env.PnPTesting_SiteUrl,
            notificationUrl: process.env.PnPTesting_NotificationUrl,
        }
    };

    return gulp.src(config.testing.testingTestsDestGlob)
        .pipe(mocha({ ui: 'bdd', reporter: 'dot', timeout: 15000 }));
});

gulp.task("travis:test", ["build:testing"], () => {

    // we shim up the global settings here from the environment vars configured for travis
    global.settings = {
        testing: {
            enableWebTests: false,
        }
    };

    return gulp.src(config.testing.testingTestsDestGlob)
        .pipe(mocha({ ui: 'bdd', reporter: 'dot', timeout: 15000 }));
});

// runs when someone executes a PR from a fork
gulp.task("travis:pull-request", ["clean", "travis:lint", "travis:test", "package:code", "package:defs"]);

// runs when things are pushed/merged
gulp.task("travis:push", ["clean", "travis:lint", "travis:webtest", "package:code", "package:defs"]);
