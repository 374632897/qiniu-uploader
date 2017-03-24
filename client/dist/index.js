(function () {
'use strict';

var index = function (byte) {
  if (byte < 1024) return byte + ' B';
  return 'KB, MB, GB, TB'.split(', ').reduce(function (current, next) {
    if ( typeof current === 'string') return current;
    const format = current / 1024;
    return format <= 1024 ? format.toFixed(2) + ' ' + next : format;
  }, byte);
};

const $textarea = document.querySelector('paste');

var Item = { render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('li', { staticClass: "upload-item" }, [_c('span', { staticClass: "file-name" }, [_vm._v(_vm._s(_vm.file.name))]), _vm._v(" "), _c('span', { staticClass: "file-size" }, [_vm._v(_vm._s(_vm.size))]), _c('div', { staticClass: "progress" }, [_c('span', { ref: "bar", staticClass: "bar" })]), _vm.completed ? _c('button', { ref: "preview", staticClass: "preview", on: { "click": _vm.preview } }, [_vm._v("预览")]) : _vm._e(), _vm._v(" "), _vm.completed ? _c('button', { ref: "preview", staticClass: "copy-path", on: { "click": _vm.copyPath } }, [_vm._v("复制地址")]) : _vm._e(), _vm._v(" "), _c('input', { ref: "url", staticClass: "hide", attrs: { "name": "" } })]);
  }, staticRenderFns: [],
  name: 'upload-item',
  props: ['file'],
  data() {
    return {
      completed: false
    };
  },
  mounted() {
    this.bar = this.$refs.bar;
    this.urlInput = this.$refs.url;
  },
  methods: {
    complete() {
      this.completed = true;
      this.urlInput.value = this.file.sourceLink;
      console.info(this.file);
    },
    copyPath() {
      this.urlInput.value = this.file.sourceLink;
      this.urlInput.select();
      if (document.execCommand('copy')) {
        alert('复制成功， 可以粘贴使用了O(∩_∩)O');
      } else {
        $textarea.value = $textarea.value + this.file.sourceLink + '\n';
        alert('复制失败, 请手动复制上面文本框内的内容进行粘贴');
      }
    },
    preview() {
      window.open(this.file.sourceLink);
    }
  },
  computed: {
    size() {
      return index(this.file.size);
    }
  },
  watch: {
    'file.percent': function (val) {
      this.bar.style.width = val + '%';
      if (val === 100) {
        this.complete();
      }
    }
  }
};

var App = { render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { attrs: { "id": "upload-data" } }, _vm._l(_vm.files, function (file, index) {
      return _c('item', { attrs: { "file": file } });
    }));
  }, staticRenderFns: [],
  name: 'upload-data',
  data() {
    return {
      files: window.uploader.files
    };
  },
  components: {
    Item
  },
  methods: {},
  computed: {}
};

var public_conf = {
  DOMAIN_NAME: 'http://onbsowgv2.bkt.clouddn.com/',
  // 空间名
  BUCKET_NAME: 'test-2'
};

// import conf from '../../qiniu.conf';
const domain = public_conf.DOMAIN_NAME;

const nameSpace = 'testUpload';

const random = () => Math.random() * 1e5 | 0;

const getName = () => {
  return nameSpace + '/' + new Date().toLocaleDateString() + '/' + random() + '/';
};

var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4', // 上传模式,依次退化
    browse_button: 'pickfiles', // 上传选择的点选按钮，**必需**
    // 在初始化时，uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
    // 切如果提供了多个，其优先级为 uptoken > uptoken_url > uptoken_func
    // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
    // uptoken : '<Your upload token>', // uptoken 是上传凭证，由其他程序生成
    uptoken_url: '/getToken', // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
    uptoken_func: function (file) {
        // 在需要获取 uptoken 时，该方法会被调用
        // do something
        return uptoken + file;
    },
    // get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
    // downtoken_url: '/downtoken',
    // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
    unique_names: false, // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
    // save_key: true,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
    // domain: 'https://assets.noteawesome.com/',     // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
    domain: domain, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
    container: 'container', // 上传区域 DOM ID，默认是 browser_button 的父元素，
    max_file_size: '100mb', // 最大文件体积限制
    // flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入 flash,相对路径
    max_retries: 3, // 上传失败最大重试次数
    dragdrop: true, // 开启可拖曳上传
    drop_element: 'container', // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
    chunk_size: '4mb', // 分块上传时，每块的体积
    auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
    //x_vars : {
    //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
    //    'time' : function(up,file) {
    //        var time = (new Date()).getTime();
    // do something with 'time'
    //        return time;
    //    },
    //    'size' : function(up,file) {
    //        var size = file.size;
    // do something with 'size'
    //        return size;
    //    }
    //},
    init: {
        'FilesAdded': function (up, files) {
            plupload.each(files, function (file) {
                // console.info('FilesAdded => ', file);
                // 文件添加进队列后,处理相关的事情
            });
        },
        'BeforeUpload': function (up, file) {
            // console.info('BeforeUpload => ', up, file);
            // 每个文件上传前,处理相关的事情
        },
        'UploadProgress': function (up, file) {
            // console.info('UploadProgress => ', up, file);

            // 每个文件上传时,处理相关的事情
        },
        'FileUploaded': function (up, file, info) {
            // file.info = info;
            // console.info('FileUploaded => ', up, file, info);
            // 每个文件上传成功后,处理相关的事情
            // 其中 info 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
            var domain$$1 = up.getOption('domain');
            var res = JSON.parse(info.response);
            var sourceLink = domain$$1 + res.key; //获取上传成功后的文件的Url
            file.sourceLink = sourceLink;
        },
        'Error': function (up, err, errTip) {
            // console.info('Error => ', err, err, errTip);
            //上传出错时,处理相关的事情
        },
        'UploadComplete': function () {
            // console.info('UploadComplete => ', arguments);
            //队列文件处理完毕后,处理相关的事情
        },
        'Key': function (up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效
            return getName() + file.name;
            // var key = Date.now() + '/' + file.name;
            // do something with key here
            // return key
        }
    }
});
window.uploader = uploader;

const $pasteEle = document.getElementById('paste');

$pasteEle.addEventListener('paste', e => {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // 检测是否为图片类型
    if (item.kind == "file" && /image\//.test(item.type)) {
      const file = item.getAsFile();
      window.uploader.addFile(file);
      break;
    }
  }
});

window.vueUploader = new Vue({
  el: '#upload-data',
  render: h => h(App)
});

}());
//# sourceMappingURL=index.js.map
