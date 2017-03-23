import resolve  from 'rollup-plugin-node-resolve';
import babel    from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import uglify   from 'rollup-plugin-uglify';
import vue      from 'rollup-plugin-vue';

const isProd = process.env.NODE_ENV === 'prod';

export default {
  entry: 'client/index.js',
  dest: 'client/dist/index.js',
  format: 'iife',
  // moduleName: 'VueEmoji',
  sourceMap: !isProd,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    vue({
      css: __dirname + '/client/dist/index.css',
      scss: {
        outputStyle: 'compressed',
      }
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs(),
    (isProd && uglify())
  ]
}
