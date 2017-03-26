"use strict";

const gulp = require("gulp");
const ts = require("gulp-typescript");
const webpack = require("webpack");
const sourcemaps = require("gulp-sourcemaps");
const nodemon = require("gulp-nodemon");
const typedoc = require("gulp-typedoc");
const tslint = require("gulp-tslint");
const sasslint = require("gulp-sass-lint");
const gutil = require("gulp-util");
const mocha = require("gulp-mocha");
const KarmaServer = require("karma").Server;

/**
 * Configuring environmental tasks
 */
gulp.task("env:test", () => {
    process.env.NODE_ENV = "test";
});

/**
 * Configuring WebPack
 */
gulp.task("webpack", (callback) => {
    let webpackCompiler = webpack(Object.create(require("./webpack/webpack.config.js")));

    webpackCompiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true
        }));
        callback();
    });
});

/**
 * Register tasks
 */
gulp.task("ts", ["ts-server", "webpack"]);

gulp.task("ts-server", () => {
    return gulp.src([
        "./src/server/**/*.ts"
    ])
    .pipe(ts(require("./tsconfig.server.json")))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("compiled/server"));
});

gulp.task("watch", ["ts-server", "webpack"], () => {
    gulp.watch([
        "src/server/**/*.ts",
        "!node_modules"
    ], ["ts-server"]);

    gulp.watch([
        "src/client/**/*.ts",
        "src/client/**/*.html",
        "src/client/**/*.scss",
        "!node_modules"
    ], ["webpack"]);
});

gulp.task("dev-server", () => {
    nodemon({
        script: "./compiled/server/server.js",
        ext: "js ts",
        env: {"NODE_ENV": "development"}
    });
});

gulp.task("tslint", () => {
    gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});

gulp.task("sasslint", () => {
    gulp.src(["src/client/**/*.scss"])
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError());
});

gulp.task("tsdoc", () => {
    gulp.src(["./src/server/**/*.ts"])
        .pipe(typedoc({
            // TypeScript options (see typescript docs)
            module: "commonjs",
            target: "es6",
            includeDeclarations: false,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,

            // Output options (see typedoc docs)
            out: "./docs",

            // TypeDoc options (see typedoc docs)
            name: "Game",
            theme: "default",
            ignoreCompilerErrors: true,
            version: true,
            // exclude: "./node_modules",
            excludeExternals: true,
            readme: "./README.md"
        }));
});

gulp.task("mocha-test", () => {
    gulp.src("./compiled/server/**/*.spec.js", {read: false})
    // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            reporter: "spec"
        }));
});

gulp.task("karma-test", (done) => {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

/**
 * Set up common test tasks
 */
gulp.task("test", ["env:test", "mocha-test", "karma-test"]);
gulp.task("test-client", ["env:test", "karma-test"]);
gulp.task("test-server", ["env:test", "mocha-test"]);

gulp.task("default", ["watch", "tslint", "sasslint", "dev-server"]);
