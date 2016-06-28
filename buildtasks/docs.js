var gulp = require("gulp"),
    typedoc = require("gulp-typedoc"),
    clean = require('gulp-clean');

//******************************************************************************
//* CLEAN
//******************************************************************************

gulp.task("clean-docs", function() {
    return gulp.src("docs", { read: false })
        .pipe(clean());
});

gulp.task("docs", ["clean-docs"], function () {

    var src = ["./src/**/*.ts", "./typings/index.d.ts"];

    return gulp
        .src(src)
        .pipe(typedoc({
            module: "umd",
            target: "es5",
            out: "./docs",
            mode: "modules",
            name: "Patterns and Practices JS Core #PnPJSCore",
            theme: "./typedoctheme"
        }));
});
