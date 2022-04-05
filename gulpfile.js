const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

function server(done) {
    browserSync.init({
        server: {
            baseDir: "./"
        },
    });
    done();
}

function buildStyles() {
    return gulp.src('./scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            //outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
}

function watcher(done) {
    gulp.watch("./scss/**/*.scss", gulp.series(buildStyles));
    gulp.watch("./*.html").on('change', browserSync.reload);
    done();
}

module.exports.buildStyles = buildStyles;
module.exports.default = gulp.series(server, buildStyles, watcher);