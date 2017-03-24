const resolve  = require('rollup-plugin-node-resolve');
const babel    = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const uglify   = require('rollup-plugin-uglify');
const vue      = require('rollup-plugin-vue');

const isProd = process.env.NODE_ENV === 'prod';

const getCommonPlugins = () => {
  return [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    (isProd && uglify())
  ];
};

const getVueExtraOptions = (css) => {
  return [
    vue({
      css: css,
      scss: {
        outputStyle: 'compressed',
      }
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ];
};

module.exports = ({ entry, dist, css, withVue }) => {
  const plugins = getCommonPlugins();
  if (withVue) {
    const VueOptions = getVueExtraOptions(css);
    plugins.splice(1, 0, ...VueOptions);
  }
  return {
    config: {
      entry,
      plugins
    },
    writeOption: {
      dest: dist,
      format: 'iife',
      sourceMap: isProd,
    }
  }
}
