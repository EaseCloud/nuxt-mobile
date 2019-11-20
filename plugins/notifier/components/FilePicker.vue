<template>
  <input class="file-picker" type="file" ref="input"
         :accept="finalizeSync(options.accept)||''"
         :multiple="!!finalizeSync(options.multiple)"
         @change="options.callback($event.target.files)" />
</template>

<script>
export default {
  props: {
    options: { type: Object, required: true }
  },
  mounted () {
    const vm = this
    vm.$refs.input.click()
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/styles/defines';

.file-picker {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
</style>
