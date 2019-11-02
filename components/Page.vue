<template>
  <div class="page">
    <slot></slot>
    <notifier-registry :notify_items="notify_items"
                       :dialog_items="[]"></notifier-registry>
  </div>
</template>

<script>
export default {
  data () {
    return {
      notify_items: [{ message: 'fuck\nyou\none\nmore\ntime', delay: 0, closable: true },
        { message: 'fuck', delay: 1000, closable: false },
        { message: '又长又臭还打死不换行的一段傻逼文字一写到底无怨无悔', delay: 1000, closable: false }]
    }
  }
}
</script>

<style lang="less" scoped>
@import (once) '../assets/less-template/template-defines';

.page {
  .fill-absolute();
}
</style>
