<template>
  <input type="" name="" ref = 'input' @change = 'readFile'>
</template>

<script>
export default {
  name: 'upload',
  data () {
    return {};
  },
  mounted () {
    this.inputFile = this.$refs.input;
  },
  methods: {
    readFile () {
      const files = this.inputFile.value;
    },
  },
  computed: {},
}
</script>

<style lang = 'sass'>

</style>
