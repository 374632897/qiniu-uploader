import Vue from 'vue/dist/vue.js'
import App from './components/upload.vue'

import './lib/';
import './utils/qiniuInit';
import './utils/paste';

window.vueUploader = new Vue({
  el: '#upload-data',
  render: h => h(App)
});
