const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const squoosh = require('gulp-libsquoosh');
const svgstore = require('gulp-svgstore');
const svgo = require('gulp-svgmin');
const del = require('del');
const browser = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');

// Styles

function styles() {
    return gulp.src("src/sass/style.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
        autoprefixer(),
        csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(browser.stream());
}

// HTML

function html() {
    return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Scripts

// Scripts
function scripts() {
    return gulp.src('src/js/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

// Images

function optimizeImages() {
    return gulp.src('src/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

function copyImages() {
    return gulp.src('src/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

// WebP
function createWebp() {
    return gulp.src('src/img/**/*.{jpg,png}')
    .pipe(squoosh({
    webp: {}
    }))
    .pipe(gulp.dest('build/img'));
}

// SVG

function svg() {
    return gulp.src(['src/img/**/*.svg', '!src/img/sprite-icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));
}

function sprite() {
    return gulp.src('src/img/sprite-icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
        inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

// Copy

function copy(done) {
    gulp.src([
    'src/fonts/*.{woff2,woff}',
    'src/*.ico',
    'src/manifest.webmanifest',
    ], {
    base: 'src'
    })
    .pipe(gulp.dest('build'))
    done();
}

// Clean

function clean() {
    return del('build');
};

// Server

function server(done) {
    browser.init({
    server: {
        baseDir: 'build'
    },
        cors: true,
        notify: false,
        ui: false,
    });
    done();
}

// Reload

function reload(done) {
    browser.reload();
    done();
}

// Watcher

function watcher() {
    gulp.watch('src/sass/**/*.scss', gulp.series(styles));
    gulp.watch('src/js/**/*.js', gulp.series(scripts));
    gulp.watch('src/*.html', gulp.series(html, reload))
}

exports.build = gulp.series(
    clean,
    copy,
    optimizeImages,
    gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
    ),
);

  // Default

exports.default = gulp.series(
    clean,
    copy,
    copyImages,
    gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
    ),
    gulp.series(
    server,
    watcher
));
