<template>
  <div class="container">
    <upload
    ></upload>
  </div>
</template>

<script>
import upload from './components/uploader.vue';
export default {
  name: 'qiniu-upload',
  components: {
    upload,
  },
  data () {
    return {
      files: [],
      file: {},
    };
  },
  mounted () {
    this.image = this.$refs.upload;
  },
  methods: {},
  computed: {},
  watch: {
    files (val) {
      console.info(val);
    }
  }
}
</script>

<style lang = 'sass'>

</style>
