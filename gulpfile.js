const gulp = require('gulp');
const rollup = require('rollup');
const { join } = require('path');
const getPath = filePath => join(__dirname, 'client', filePath);
const getRollupConfig = require('./getRollupConfig');

const isProd = process.env.NODE_ENV === 'prod';

gulp.task('lib', () => {
  const { config, writeOption } = getRollupConfig({
    entry: getPath('lib/index.js'),
    dist: getPath('/dist/lib.min.js')
  });
  return rollup.rollup(config).then((bundle) => {
    bundle.write(writeOption);
  });
});

gulp.task('index', () => {
  const { config, writeOption } = getRollupConfig({
    entry: getPath('index.js'),
    dist:  getPath('index.min.js'),
    withVue: true,
    css: getPath('index.css'),
  });
  return rollup.rollup(config).then((bundle) => {
    bundle.write(writeOption)
  });
});

gulp.task('default', ['lib', 'index']);
if (isProd) return;
gulp.watch('./client/*.js', ['index']);
