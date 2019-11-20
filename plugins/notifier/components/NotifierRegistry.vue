<template>
  <div v-if="ready">
    <!-- dialogs -->
    <div class="dialog-list">
      <n-dialog v-for="(dialog, i) in $store.state.notifier.dialogs"
                :key="i" :options="dialog"></n-dialog>
    </div>
    <!-- notifies -->
    <div class="notify-list">
      <div v-for="(notify, i) in $store.state.notifier.notify_items">
        <n-notify @dismiss="dismiss" :item="notify"></n-notify>
      </div>
    </div>
    <!-- file-picker -->
    <file-picker v-for="filePicker in $store.state.notifier.file_pickers"
                 :options="filePicker"></file-picker>
  </div>
</template>

<script>
import NNotify from './Notify'
import NDialog from './Dialog'
import FilePicker from './FilePicker'

import { DialogOptions } from '../models'

export default {
  components: { FilePicker, NNotify, NDialog },
  data () {
    return {
      ready: false
    }
  },
  async mounted () {
    const vm = this
    await vm.waitFor(vm, '$store.state.notifier')
    await vm.waitFor(vm, '$store.state.notifier.notify_items')
    vm.ready = true
    // console.log(vm.notify_items)
    // vm.$store.dispatch('notifier/addNotify', '你好我成了', 3000)
  },
  async destroyed () {
    console.log('NotifierRegistry Destroyed')
    // 因为 filePicker 的取消没有回调，因此当路由跳转，注册器销毁的时候
    // 就应该手动销毁所有的 filePicker
    const vm = this
    vm.$store.state.notifier.file_pickers.forEach(fp => {
      vm.$store.dispatch('notifier/dismissFilePicker', fp)
      fp.reject()
    })
  },
  methods: {
    dismiss (item) {
      const vm = this
      // 如果不套这个 setTimeout 触发异步，会导致相同的 delay emit 出来只能关掉一个
      vm.$store.dispatch('notifier/dismissNotify', item)
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/styles/defines';

.notify-list {
  position: absolute;
  bottom: 50*@px;
  left: 0;
  right: 0;
  height: 0;
  overflow-y: visible;
  z-index: 100;
  text-align: center;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
}
</style>
