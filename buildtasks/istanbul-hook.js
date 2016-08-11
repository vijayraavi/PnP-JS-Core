//******************************************************************************
//* istanbul-hook.js
//*
//* Defines a custom gulp task for hooking up reporting on unit test coverage.
//* NOTE: This task just "hooks" it up.  The actual reporting is invoked in the
//* custom "test" gulp task. 
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    istanbul = require("gulp-istanbul");

//******************************************************************************
//* ISTANBUL:HOOK
//******************************************************************************

gulp.task("istanbul:hook", ["build"], function () {
    return gulp.src(global.TSCompiledOutput.JSCodeFiles)
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});
