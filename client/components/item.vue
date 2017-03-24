<template>
<li class = 'upload-item'>
  <span class="file-name">{{ file.name}}</span>
  <span class="file-size">{{ size }}</span>
  <div class="progress">
    <span class="bar" ref = 'bar'></span>
  </div>
  <button class="preview" ref = 'preview' v-if = 'completed' @click = 'preview'>预览</button>
  <button class="copy-path" ref = 'preview' v-if = 'completed' @click = 'copyPath'>复制地址</button>
  <input  name="" ref = 'url' class = 'hide'>
</li>
</template>

<script>
import size from 'rui-size';

const $textarea = document.querySelector('paste');

export default {
  name: 'upload-item',
  props: ['file'],
  data () {
    return {
      completed: false
    };
  },
  mounted () {
    this.bar = this.$refs.bar;
    this.urlInput = this.$refs.url;
  },
  methods: {
    complete () {
      this.completed = true;
      this.urlInput.value = this.file.sourceLink;
      console.info(this.file);
    },
    copyPath () {
      this.urlInput.value = this.file.sourceLink;
      this.urlInput.select();
      if (document.execCommand('copy')) {
        alert('复制成功， 可以粘贴使用了O(∩_∩)O');
      } else {
        $textarea.value = $textarea.value + this.file.sourceLink + '\n';
        alert('复制失败, 请手动复制上面文本框内的内容进行粘贴');
      }
    },
    preview () {
      window.open(this.file.sourceLink);
    },
  },
  computed: {
    size () {
      return size(this.file.size);
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
}
</script>

<style lang = 'sass'>
.upload-item {
  font-size: 14px;
  line-height: 30px;
  height: 41px;
  padding: 5px 10px;
  border-bottom: 1px solid #b0c3c3;
  button {
    vertical-align: top;
    margin-left: 10px;
  }
}
.file-name, .file-size {
  display: inline-block;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 5px;
}
.progress {
  display: inline-block;
  vertical-align: top;
  width: calc(100% - 400px);
  overflow:hidden;
  border-radius: 2px;
  background: gray;
  border: 1px solid gray;
  position: relative;
  height: 30px;
  .bar {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 2px;
    width: 0;
    height: inherit;
    background: yellowgreen;
    transition: width ease-out .2s;
  }
}
.hide {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
</style>
