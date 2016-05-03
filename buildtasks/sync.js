//******************************************************************************
//* sync.js
//*
//* Defines a custom gulp task for serving up content from the server-root 
//* local folder, setup file/folder watchers so that changes are reflected
//* on file save, and open the default browser to the default html page. 
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp");
 

function copyJstosharepoint(buildServeTaskName) {
   

    gulp.watch(global.TSWorkspace.Files, ["lint", buildServeTaskName]);

}

//******************************************************************************
//* SERVE
//******************************************************************************

gulp.task(["copyJsToSharePoint"], function() {
    copyJstosharepoint("copyJsToSharePoint");
});
