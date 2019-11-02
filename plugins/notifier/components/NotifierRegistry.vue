<template>
  <div>
    <!-- dialogs -->
    <div class="dialog-list">
    </div>
    <!-- notifies -->
    <div class="notify-list">
      <div v-for="(notify, i) in $store.state.notifier.notify_items">
        <notify @dismiss="notifyDismiss" :item="notify"></notify>
      </div>
    </div>
  </div>
</template>

<script>
import Notify from './Notify'

export default {
  components: { Notify },
  props: {
    notify_items: {
      type: Array,
      default: []
    },
    dialog_items: {
      type: Array,
      default: []
    },
  },
  mounted () {
    const vm = this
    // console.log(vm.notify_items)
    // vm.$store.commit('notifier/addNotify', '你好我成了', 3000)
  },
  methods: {
    notifyDismiss (item) {
      const vm = this
      // 如果不套这个 setTimeout 触发异步，会导致相同的 delay emit 出来只能关掉一个
      setTimeout(() => {
        vm.$store.commit('notifier/dismissNotify', item)
        // const pos = vm.notify_items.indexOf(item)
        // console.log('dismiss', item, pos)
        // if (pos > -1) vm.notify_items.splice(pos, 1)
      }, 0)
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/less-template/template-defines';

.notify-list {
  .fixed-bottom();
  text-align: center;
}
</style>
