"use strict";

const ExtractTextPlugin = require("extract-text-webpack-plugin");

exports.tslint = {
    test: /\.ts$/,
    loader: "tslint",
    exclude: /node_modules/
};

exports.ts = {
    test: /\.ts$/,
    use: ["awesome-typescript-loader"],
    exclude: /(node_modules\/|\.test\.ts$|tests\.\w+\.ts$)/
};

exports.pug = {
    test: /\.pug$/,
    loader: "pug-loader"
};

exports.css = {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})
};

exports.sass = {
    test: /\.scss$/,
    exclude: /node_modules/,
    loader: ExtractTextPlugin.extract({fallback: "style-loader", use: ["css-loader", "sass-loader"]})
};

exports.embedHtml = {
    test: /\.(html)$/,
    loader: "raw-loader",
    exclude: /\.async\.(html)$/
};

exports.asyncHtml = {
    test: /\.async\.(html)$/,
    use: [
        {
            loader: "file?name=[name].[hash].[ext]"
        },
        {
            loader: "extract"
        }
    ]
};

exports.xlf = {
    test: /\.(xlf)$/,
    use: [
        {
            loader: "bundle-loader?name=[name]"
        },
        {
            loader: "raw-loader"
        }
    ]
};

exports.svg = makeUrlLoader(/\.svg$/);
exports.eot = makeUrlLoader(/\.eot$/);
exports.woff = makeUrlLoader(/\.woff$/);
exports.woff2 = makeUrlLoader(/\.woff2$/);
exports.ttf = makeUrlLoader(/\.ttf$/);

function makeUrlLoader(pattern) {
    return {
        test: pattern,
        loader: "url-loader",
        exclude: /node_modules/
    };
}
