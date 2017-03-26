"use strict";

const path = require("path");
const webpack = require("webpack");
const loaders = require("./loaders");
const plugins = require("./plugins");

module.exports = {
    context: __dirname,
    entry: {
        styles: "../src/client/styles/styles.js",
        app: "../src/client/bootstrap.ts"
    },
    output: {
        path: path.join(__dirname, "/../", "compiled/client"),
        publicPath: "/",
        filename: "[name].bundle.js"
    },
    devtool: "sourcemap",
    module: {
        rules: [
            loaders.ts,
            loaders.pug,
            loaders.svg,
            loaders.eot,
            loaders.woff,
            loaders.woff2,
            loaders.ttf,
            loaders.sass,
            loaders.css,
            loaders.embedHtml,
            loaders.asyncHtml,
            loaders.xlf
        ]
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".json", ".ts", ".css"]
    },
    plugins: plugins
};