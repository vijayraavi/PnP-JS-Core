//******************************************************************************
//* test.js
//*
//* Defines a custom gulp task for executing the unit tests (with mocha) and
//* also reporting on code coverage (with istanbul). 
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul");

//******************************************************************************
//* TEST
//******************************************************************************

gulp.task("test", ["build", "istanbul:hook"], function() {
    return gulp.src(global.TSCompiledOutput.JSTestFiles)
        .pipe(mocha({ ui: 'bdd', reporter: 'dot' }))
        .pipe(istanbul.writeReports());
});
