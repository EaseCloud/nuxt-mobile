<template>
  <div class="notify-item">
    <div class="message">{{item.message}}</div>
    <a class="btn-dismiss" v-if="item.closable" @click="$emit('dismiss', item)">&times;</a>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
    // message: {
    //   type: String,
    //   default: ''
    // },
    // delay: {
    //   type: Number,
    //   default: 3000
    // },
    // closable: {
    //   type: Boolean,
    //   default: false
    // }
  }
}
</script>

<style lang="less">
@import '../../../assets/less-template/template-defines';

.notify-item {
  position: relative;
  display: inline-block;
  max-width: 16rem;
  line-height: 1rem;
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  margin-bottom: 0.5rem;
  color: white;
  background: rgba(0, 0, 0, 0.75);
  .rounded-corners(0.9rem);
  .message {
    text-align: left;
    display: inline-block;
    white-space: pre-wrap;
  }
  .btn-dismiss {
    margin-left: 0.4rem;
  }
}
</style>
