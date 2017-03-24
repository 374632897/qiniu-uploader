import App from './components/upload.vue';

import './utils/qiniuInit';
import './utils/paste';

window.vueUploader = new Vue({
  el: '#upload-data',
  render: h => h(App)
});
