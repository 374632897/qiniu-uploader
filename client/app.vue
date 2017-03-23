<template>
  <div class="container">
    <upload
      title = 'upload files'
      :mutiple = 'true'
      ref = 'upload'
    ></upload>
  </div>
</template>

<script>
import upload from 'vue-upload-component'
export default {
  name: 'qiniu-upload',
  components: {
    upload,
  },
  data () {
    return {};
  },
  methods: {},
  computed: {},
}
</script>

<style lang = 'sass'>

</style>
