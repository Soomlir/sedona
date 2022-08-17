import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import imagemin from 'gulp-imagemin';
import less from 'gulp-less';
import lessSyntax from 'postcss-less';
import lintspaces from 'gulp-lintspaces';
import mozjpeg from 'imagemin-mozjpeg';
import mqpacker from 'postcss-sort-media-queries';
import pngquant from 'imagemin-pngquant';
import postcss from 'gulp-postcss';
import postcssBemLinter from 'postcss-bem-linter';
import postcssReporter from 'postcss-reporter';
import posthtml from 'gulp-posthtml';
import rename from 'gulp-rename';
import server from 'browser-sync';
import stackSprite from 'gulp-svg-sprite';
import stylelint from 'stylelint';
import svgo from 'imagemin-svgo';
import svgoConfig from './svgo.config.js';
import twig from 'gulp-twig';
import vinylNamed from 'vinyl-named';
import webp from 'gulp-webp';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import webpackStream from 'webpack-stream';

const IS_DEV = process.env.NODE_ENV === 'development';

const Entry = {
	FONTS: './source/static/fonts',
	ICONS: 'source/icons/**/*.svg',
	IMAGES: 'source/images/**/*.{jpg,png,svg}',
	PAGES: ['source/pages/**/*.twig', '!source/pages/**/_*.twig'],
	SCRIPTS: ['source/scripts/**/*.js', '!source/scripts/**/_*.js'],
	STATIC: ['source/static/**/*', '!source/static/**/*.md'],
	STYLES: ['source/styles/**/*.less', '!source/styles/**/_*.less']
};
const Watch = {
	API: 'api/restart.log',
	ENGINE: ['api/**/*.js', '*.{js,cjs}'],
	PAGES: 'source/pages/**/*.twig',
	SCRIPTS: 'source/scripts/**/*.js',
	STYLES: 'source/styles/**/*.less'
};
const Destination = {
	IMAGES: 'build/images',
	ROOT: 'build',
	SCRIPTS: 'build/scripts',
	STYLES: 'build/styles'
};
if (!IS_DEV) {
	Entry.STATIC.push('!source/static/pixelperfect/**/*.{jpg,png,svg}');
	Entry.SCRIPTS.push('!source/scripts/dev.js');
}

const postCssReporterConfig = { clearAllMessages: true, throwError: !IS_DEV };

const { src, dest, watch, series, parallel } = gulp;

const checkLintspaces = () => lintspaces({ editorconfig: '.editorconfig' });
const reportLintspaces = () => lintspaces.reporter({ breakOnWarning: !IS_DEV });
const optimizeImages = () => imagemin([svgo(svgoConfig), mozjpeg({ progressive: true, quality: 75 }), pngquant()]);

export const buildLayouts = () =>
	src(Entry.PAGES)
		.pipe(twig())
		.pipe(posthtml())
		.pipe(gulpIf(process.env.NODE_ENV !== 'test', dest(Destination.ROOT)));

export const buildStyles = () =>
	src(Entry.STYLES)
		.pipe(less())
		.pipe(
			postcss(
				(() => {
					const plugins = [mqpacker(), autoprefixer()];

					if (!IS_DEV) {
						plugins.push(cssnano({ preset: ['default', { cssDeclarationSorter: false }] }));
					}

					return plugins;
				})()
			)
		)
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest(Destination.STYLES));

export const buildScripts = () =>
	src(Entry.SCRIPTS).pipe(vinylNamed()).pipe(webpackStream(webpackConfig, webpack)).pipe(dest(Destination.SCRIPTS));

export const buildSprite = () =>
	src(Entry.ICONS)
		.pipe(gulpIf(!IS_DEV, optimizeImages()))
		.pipe(stackSprite({ mode: { stack: true } }))
		.pipe(rename('sprite.min.svg'))
		.pipe(dest(Destination.IMAGES));

export const copyImages = () =>
	src(Entry.IMAGES)
		.pipe(gulpIf(!IS_DEV, optimizeImages()))
		.pipe(dest(Destination.IMAGES))
		.pipe(webp({ quality: 80 }))
		.pipe(dest(Destination.IMAGES));

export const copyStatic = () => src(Entry.STATIC).pipe(dest(Destination.ROOT));

export const lintLayouts = () => src([Watch.PAGES, Entry.ICONS]).pipe(checkLintspaces()).pipe(reportLintspaces());

export const lintStyles = () =>
	src(Watch.STYLES)
		.pipe(checkLintspaces())
		.pipe(reportLintspaces())
		.pipe(
			postcss([stylelint(), postcssBemLinter(), postcssReporter(postCssReporterConfig)], {
				syntax: lessSyntax
			})
		);

export const lintScripts = () =>
	src([...Watch.ENGINE, Watch.SCRIPTS])
		.pipe(checkLintspaces())
		.pipe(reportLintspaces())
		.pipe(eslint({ fix: false }))
		.pipe(eslint.format())
		.pipe(gulpIf(!IS_DEV, eslint.failAfterError()));

export const cleanDestination = () => del(Destination.ROOT);

export const reload = (done) => {
	server.reload();
	done();
};

export const startServer = (done) => {
	server.init({
		cors: true,
		open: false,
		server: Destination.ROOT,
		ui: false
	});

	watch(Entry.ICONS, series(buildSprite, reload));
	watch(Entry.IMAGES, series(copyImages, reload));
	watch(Entry.STATIC, series(copyStatic, reload));
	watch(Watch.ENGINE, lintScripts);
	watch(Watch.PAGES, series(lintLayouts, buildLayouts, reload));
	watch(Watch.SCRIPTS, series(lintScripts, buildScripts, reload));
	watch(Watch.STYLES, series(lintStyles, buildStyles, reload));

	done();
};

export const lint = parallel(lintLayouts, lintStyles, lintScripts);
export const test = series(lint, buildLayouts);
export const compile = parallel(buildLayouts, buildStyles, buildScripts, buildSprite, copyImages, copyStatic);
export const build = series(parallel(lint, cleanDestination), compile);
export const dev = series(build, startServer);
export default dev;
