const { watch, series, src, dest } = require("gulp");
var browserSync = require("browser-sync").create();
var postcss = require("gulp-postcss");
var ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const imagemin = import('gulp-imagemin');

// Generate HTML from ejs
function generateHTML(cb) {
    src("./views/**.ejs")
        .pipe(ejs({
            title: "Hello!",
        }))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(dest("app"));
    cb();
}

// Task for compiling our CSS files using PostCSS
function cssTask(cb) {
    return src("./src/*.css") // read .css files from ./src/ folder
        .pipe(postcss()) // compile using postcss
        .pipe(dest("./app/css")) // paste them in ./app/css folder
        .pipe(browserSync.stream());
    cb();
}

// Task for minifying images
function imageminTask(cb) {
    return src("./app/img/*")
        .pipe(imagemin())
        .pipe(dest("./app/img"));
    cb();
}

// Serve from browserSync server
function browsersyncServe(cb) {
    browserSync.init({
        server: {
            baseDir: "app",
        },
    });
    cb();
}

function browsersyncReload(cb) {
    browserSync.reload();
    cb();
}

// Watch Files & Reload browser after tasks
function watchTask() {
    watch("./**/*.html", browsersyncReload);
    watch('views/**/*.ejs', generateHTML);
    watch(["./src/*.css"], series(cssTask, browsersyncReload));
    watch([ '**/*.js', '!node_modules/**']);
}

// Default Gulp Task
exports.default = series(cssTask, browsersyncServe, watchTask);
exports.css = cssTask;
exports.images = imageminTask;