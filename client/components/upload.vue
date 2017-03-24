<template>
  <div id = 'upload-data'>
    <item
      v-for = 'file,index in files'
      :file = 'file'
    >

    </item>
  </div>
</template>

<script>
import Item from './item.vue';

export default {
  name: 'upload-data',
  data () {
    return {
      files: window.uploader.files
    };
  },
  components: {
    Item,
  },
  methods: {},
  computed: {},
}
</script>

<style lang = 'sass'>
div, textarea, button, h2, span, ul, li {
  box-sizing: border-box;
  list-style: none;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
}
 #upload-area, #upload-data {
   width: 80%;
   overflow: hidden;
   margin: 0 auto;
   margin-bottom: 20px;
 }

 #container, textarea, #upload-data {
   height: 400px;
   border: 1px solid #eaeaea;
   display: block;
   margin-bottom: 10px;
 }
 button {
   border: none;
   background: #eee;
   padding: 5px 7px;
   color: yellowgreen;
   border-radius: 3px;
   cursor: pointer;
 }
 textarea,
 button {
  &:active,
  &:focus {
    outline: none;
  }
 }
 textarea {
   height: 40px;
   width: 100%;
   min-height: 200px;
 }
 h2 {
   text-align: center;
   font-size: 50px;
   color: #233;
   line-height: 400px;
   margin: 0;
 }
</style>
