"use strict";

var gulp = require("gulp"),
    typedoc = require("gulp-typedoc"),
    del = require('del'),
    handlebars = require('handlebars');

//******************************************************************************
//* CLEAN
//******************************************************************************

gulp.task("clean-docs", function () {
    return del("docs");
});

gulp.task("docs", ["clean-docs"], function () {

    var src = ["./src/**/*.ts", "./typings/index.d.ts"];

    handlebars.registerHelper("mainNav", renderMainNavigation);

    return gulp
        .src(src)
        .pipe(typedoc({
            module: "umd",
            target: "es5",
            out: "./docs",
            mode: "modules",
            name: "Patterns and Practices JS Core",
            theme: "./typedoctheme",
            hideGenerator: true
        }));
});

function renderMainNavigation(nav) {

    let tree = gatherNodes(nav);

    let navTemplate = handlebars.compile('<ul class="ms-ContextualMenu is-open">{{> navigation}}</ul>');

    return new handlebars.SafeString(navTemplate(tree));
    //return JSON.stringify(tree);
}

function gatherNodes(nav) {

    let tree = new navNode("root");

    nav.children.forEach((child) => {

        // if not visible or is a "label" don't bother including in our tree
        if (!child.isVisible || child.isLabel) {
            return;
        }

        let titleParts = child.title.replace(/^"/, "").replace(/"$/, "").split("/");

        let container = tree;
        let depth = 0;

        for (var i = 0; i < titleParts.length - 1; i++) {

            let candidateIndex = container.map[titleParts[i]];
            let candidate = null;

            if (candidateIndex === null || typeof candidateIndex === "undefined") {
                candidate = new navNode(depth, titleParts[i], "", child.isCurrent, child.isInPath, child.isGlobals);
                container.map[titleParts[i]] = container.nodes.length;
                container.nodes.push(candidate);
                depth++;
            } else {
                candidate = container.nodes[candidateIndex];
            }

            container = candidate;
        }

        let link = new navNode(depth + 1, titleParts[titleParts.length - 1], child.url, child.isCurrent, child.isInPath, child.isGlobals);

        // nothing seems to have children
        // if (child.children) {}

        container.nodes.push(link);
    });

    return tree;
}

function navNode(depth, name, url, current, inPath, isGlobals) {
    this.title = name;
    this.url = url;
    this.current = current;
    this.inPath = inPath;
    this.isGlobals = isGlobals;
    this.map = {};
    this.nodes = [];
    this.depth = depth;
    this.padding = (depth * 4) + 18;
}
