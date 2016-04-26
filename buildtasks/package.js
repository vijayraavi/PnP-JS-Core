//******************************************************************************
//* package.js
//* 
//* Defines a custom gulp task for creaing pnp.js, pnp.min.js, 
//* and pnp.min.js.map in the dist folder
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    browserify = require("browserify"),
    uglify = require("gulp-uglify"),
    src = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    header = require('gulp-header'),
    srcmaps = require("gulp-sourcemaps");

function packageDefinitions() {

    console.log(global.TSDist.RootFolder + "/" + global.TSDist.DefinitionFileName);

    var src = global.TSWorkspace.Files.slice(0);
    src.push(global.TSTypings.Main);
    src.push("!src/*.test.ts");

    // create a project specific to our typings build and specify the outFile. This will result
    // in a single pnp.d.ts file being creating and piped to the typings folder
    var typingsProject = tsc.createProject('tsconfig.json', { declaration: true, outFile: "pnp.js" });

    return gulp.src(src)
        .pipe(tsc(typingsProject))
        .dts.pipe(gulp.dest(global.TSDist.RootFolder));
}

function packageBundle() {

    console.log(global.TSDist.RootFolder + "/" + global.TSDist.BundleFileName);

    return browserify('./lib/src/pnp.js', {
        debug: false,
        standalone: '$pnp',
        external: ["es6-promise", "jquery", "whatwg-fetch", "node-fetch"]
    }).ignore('*.d.ts').bundle()
        .pipe(src(global.TSDist.BundleFileName))
        .pipe(buffer())
        .pipe(header(banner, { pkg: global.pkg }))
        .pipe(gulp.dest(global.TSDist.RootFolder));
}

function packageBundleUglify() {

    console.log(global.TSDist.RootFolder + "/" + global.TSDist.MinifyFileName);
    console.log(global.TSDist.RootFolder + "/" + global.TSDist.MinifyFileName + ".map");

    return browserify('./lib/src/pnp.js', {
        debug: false,
        standalone: '$pnp',
        external: ["es6-promise", "jquery", "whatwg-fetch", "node-fetch"]
    }).ignore('*.d.ts').bundle()
        .pipe(src(global.TSDist.MinifyFileName))
        .pipe(buffer())
        .pipe(srcmaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(header(banner, { pkg: global.pkg }))
        .pipe(srcmaps.write('./'))
        .pipe(gulp.dest(global.TSDist.RootFolder))
}

//******************************************************************************
//* PACKAGE
//******************************************************************************

gulp.task("package", ["build"], function() {
    packageDefinitions();
    packageBundle();
    packageBundleUglify();
});