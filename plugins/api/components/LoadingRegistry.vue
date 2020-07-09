<template>
  <div v-if="$store.state.api.loading_count > 0" class="loading">
    <loading :active="true"
             :can-cancel="false"
             :is-full-page="fullPage"></loading>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  components: { Loading },
  data () {
    return {}
  },
  async mounted () {
    const vm = this
    await vm.waitFor(vm, '$store.state.api')
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/styles/defines';

.loading {
  .fill-fixed();
  z-index: 9999;
  /*background: rgba(0, 0, 0, 0.3);*/
}
</style>
