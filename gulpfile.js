/* jshint esversion: 6 */

const fs = require('fs'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	merge = require("merge-stream"),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	concatutil = require('gulp-concat-util'),
	cssmin = require('gulp-cssmin'),
	html2js = require('gulp-html2js'),
	path = require('path'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	webserver = require('gulp-webserver'),
	browserify = require('browserify'),
	tsify = require('tsify'),
	through2 = require('through2');

const bundler = './bundler.config.json';
const compiler = './compiler.config.json';

const useTypescript = false;

// TYPESCRIPT
gulp.task('bundle:typescript', () => {
	return gulp.src('src/app/main.ts')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(through2.obj((file, enc, next) => {
				browserify(file.path)
					.plugin(tsify)
					.transform('babelify', { plugins: ['@babel/plugin-transform-flow-strip-types'], extensions: ['.ts'] })
					.bundle((error, response) => {
						if (error) {
							console.log('browserify.bundle.error', error);
						} else {
							file.contents = response;
							next(null, file);
						}
					})
					.on('error', (error) => {
						console.error('browserify.error', error.toString());
					});
			}
			/*, (done) => {
				console.log('through2.done', error);
			}*/
		))
		.pipe(rename('main.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('docs/js'));
});

// COMPILE
gulp.task('compile:sass', () => {
	const tasks = getCompilers('.scss').map((compile) => {
		console.log(compile.inputFile);
		return gulp.src(compile.inputFile, {
				base: '.'
			})
			.pipe(plumber())
			.pipe(sass({
				includePaths: ['./node_modules/', __dirname + '/node_modules', 'node_modules'],
			}).on('compile:sass.error', (error) => {
				console.log('compile:sass.error', error);
			}))
			.pipe(autoprefixer())
			.pipe(rename(compile.outputFile))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./'));
	});
	return merge(tasks);
});
gulp.task('compile:js', () => {
	const tasks = getCompilers('.js').map((compile) => {
		console.log(compile.inputFile);
		return gulp.src(compile.inputFile, {
				base: '.'
			})
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(through2.obj((file, enc, next) => {
					browserify(file.path)
						.plugin(tsify)
						.transform('babelify', { plugins: [], extensions: ['.js'] })
						.bundle((error, response) => {
							if (error) {
								console.log('browserify.bundle.error', error);
							} else {
								file.contents = response;
								next(null, file);
							}
						})
						.on('error', (error) => {
							console.error('browserify.error', error.toString());
						});
				}
				/*, (done) => {
					console.log('through2.done', error);
				}*/
			))
			.pipe(rename(compile.outputFile))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('./'));
	});
	return merge(tasks);
});
gulp.task('compile', ['compile:sass', 'compile:js']);

// BUNDLE

gulp.task('bundle:css', () => {
	const tasks = getBundles('.css').map((bundle) => {
		return doCssBundle(gulp.src(bundle.inputFiles, {
			base: '.'
		}), bundle);
	});
	return merge(tasks);
});

gulp.task('bundle:js', () => {
	const tasks = getBundles('.js').map((bundle) => {
		return doJsBundle(gulp.src(bundle.inputFiles, {
			base: '.'
		}), bundle);
	});
	return merge(tasks);
});

// PARTIALS
gulp.task('bundle:partials', () => {
	return gulp.src('./src/artisan/**/*.html', {
			base: './src/artisan/'
		})
		.pipe(plumber())
		.pipe(rename((path) => {
			path.dirname = path.dirname.split('\\').join('/');
			path.dirname = path.dirname.split('artisan/').join('');
			// path.basename += "-partial";
			path.extname = '';
			// console.log('path', path);
		}))
		.pipe(html2js('artisan-partials.js', {
			adapter: 'angular',
			// base: '.',
			name: 'artisan',
			fileHeaderString: '/* global angular: false */',
			quoteChar: '\'',
			indentString: '\t\t',
			singleModule: true,
			useStrict: true,
		}))
		.pipe(gulp.dest('./docs/js/'))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./docs/js/'));
});

// SNIPPETS
gulp.task('bundle:snippets', () => {
	return gulp.src('./src/snippets/**/*.glsl', {
			base: './src/snippets/'
		})
		.pipe(plumber())
		.pipe(rename((path) => {
			path.dirname = path.dirname.split('\\').join('/');
			path.dirname = path.dirname.split('src/snippets/').join('');
			path.extname = '';
		}))
		.pipe(concatutil('glsl.json', {
			process: (source, filePath) => {
				const folders = filePath.replace('src/snippets/', '').split(path.sep);
				const name = folders.join('.');
				const body = source.trim();
				const r = /^\/\*(?:\s?)(.*)\*\//g.exec(body);
				let description = name;
				if (r && r.length === 2) {
					description = r[1];
				}
				const item = {
					prefix: 'glsl.' + name,
					body: body,
					description: description,
				};
				item.body = body;
				return '\t"' + name + '":' + JSON.stringify(item, null, 2) + ",\n";
			}
		}))
		.pipe(concatutil('glsl.json', {
			process: (source, filePath) => {
				source = source.replace(new RegExp(',\n' + '$'), '\n');
				return "{\n" + source + "\n}";
			}
		}))
		.pipe(gulp.dest('./snippets/'));
});

// WATCH
gulp.task('watch', (done) => {
	if (useTypescript) {
		gulp.watch('./src/app/**/*.ts', ['bundle:typescript']).on('change', log);
	}
	if (getCompilers('.js').length > 0) {
		gulp.watch('./src/app/**/*.js', ['compile:js']).on('change', log);
	}
	gulp.watch('./src/sass/**/*.scss', ['compile:sass']).on('change', log);
	getBundles('.css').forEach((bundle) => {
		gulp.watch(bundle.inputFiles, () => {
			return doCssBundle(gulp.src(bundle.inputFiles, {
				base: '.'
			}), bundle);
		}).on('change', log);
	});
	getBundles('.js').forEach((bundle) => {
		gulp.watch(bundle.inputFiles, () => {
			return doJsBundle(gulp.src(bundle.inputFiles, {
				base: '.'
			}), bundle);
		}).on('change', log);
	});
	gulp.watch('./src/artisan/**/*.html', ['bundle:partials']).on('change', log);
	// gulp.watch('./src/snippets/**/*.glsl', ['bundle:snippets']).on('change', log);
	gulp.watch(compiler, ['compile', 'bundle']).on('change', log);
	gulp.watch(bundler, ['bundle']).on('change', log);
	done();
});

// WEBSERVER
gulp.task('webserver', () => {
	return gulp.src('./docs/')
		.pipe(webserver({
			port: 6001,
			fallback: 'index.html',
			open: true,
			livereload: true,
			directoryListing: false,
		}));
});

if (useTypescript) {
	gulp.task('bundle', ['bundle:css', 'bundle:js']);
} else {
	gulp.task('bundle', ['bundle:css', 'bundle:js', 'bundle:typescript']);
}

// gulp.task('bundle', ['bundle:css', 'bundle:js', 'bundle:typescript', 'bundle:partials', 'bundle:snippets']);

gulp.task('default', ['compile', 'bundle', 'webserver', 'watch']);

gulp.task('start', ['compile', 'bundle', 'watch']);

// METHODS

function doCssBundle(glob, bundle) {
	return glob
		.pipe(plumber())
		.pipe(concat(bundle.outputFileName))
		.pipe(gulp.dest('.'))
		.pipe(gulpif(bundle.minify && bundle.minify.enabled, cssmin()))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest('.'));
}

function doJsBundle(glob, bundle) {
	return glob
		.pipe(plumber())
		.pipe(concat(bundle.outputFileName))
		.pipe(gulp.dest('.'))
		.pipe(sourcemaps.init())
		.pipe(gulpif(bundle.minify && bundle.minify.enabled, uglify()))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('.'));
}

function getCompilers(ext) {
	const data = getJson(compiler);
	if (data) {
		return data.filter((compile) => {
			return new RegExp(`${ext}$`).test(compile.inputFile);
		});
	} else {
		return [];
	}
}

function getBundles(ext) {
	const data = getJson(bundler);
	if (data) {
		return data.filter((bundle) => {
			return new RegExp(`${ext}$`).test(bundle.outputFileName);
		});
	} else {
		return [];
	}
}

function getJson(path) {
	if (fs.existsSync(path)) {
		const text = fs.readFileSync(path, 'utf8');
		// console.log('getJson', path, text);
		return JSON.parse(stripBom(text));
	} else {
		return null;
	}
}

function stripBom(text) {
	text = text.toString();
	if (text.charCodeAt(0) === 0xFEFF) {
		text = text.slice(1);
	}
	return text;
}

function log(e) {
	console.log(e.type, e.path);
}
