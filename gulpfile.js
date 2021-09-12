const {
  task,
  src,
  dest,
  watch,
  series
} = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const purgecss = require('gulp-purgecss');
const minify = require('gulp-minify');
const concat = require('gulp-concat');

function devStyles() {
  return src('sass/**/*.scss')
    .pipe(sass())
    .pipe(dest('css'));
}

function buildStyles() {
  return src('sass/**/*.scss')
    .pipe(sass())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(purgecss({
      content: ['*.html']
    }))
    .pipe(dest('dist/css'));
}

function watchTask() {
  watch(['sass/**/*.scss', '*.html'], devStyles);
}

function buildScripts() {
  return src(['lib/*.js', 'lib/*.mjs'])
    // .pipe(concat('main.js')) // if need concat all js files
    .pipe(minify({
      ext: {
        min: '.js'
      },
      noSource: true
    }))
    .pipe(dest('dist/lib'));
}

function copyHtmlFiles() {
  src('*.html').pipe(dest('dist'));
}

task('build', async function () {
  await del(['dist/*']);
  buildStyles();
  buildScripts();
  copyHtmlFiles();
});

exports.default = series(buildStyles, watchTask);