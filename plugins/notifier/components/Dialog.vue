<template>
  <div class="mask">
    <!--@click="$store.dispatch('notifier/closeDialog', options)">-->
    <div class="dialog" @click.stop>
      <div class="dialog-header">
        <a class="btn-cancel" v-if="options.cancelText"
           @click="doAction(options.onCancel)">{{options.cancelText}}</a>
        <a class="btn-ok" v-if="options.okText"
           @click="doAction(options.onOk)">{{options.okText}}</a>
        <div class="dialog-title">{{options.title}}</div>
      </div>
      <div class="dialog-body">
        <render-component :render="options.render"></render-component>
      </div>
    </div>
  </div>
</template>

<script>
import { DialogOptions } from '../models'

export default {
  props: {
    options: { type: DialogOptions, required: true }
  },
  mounted () {
    const vm = this
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/styles/defines';

.mask {
  z-index: 100;
  .fill-fixed();
  background: rgba(0, 0, 0, 0.1);
  .dialog {
    font-size: 32*@px;
    .fixed-bottom();
    background: white;
    .dialog-header {
      .clearfix();
      line-height: 88*@px;
      border-top: 1px solid @color-border;
      border-bottom: 1px solid @color-border;
      .btn-ok {
        float: right;
        padding: 0 30*@px;
        color: @color-primary-background;
        font-size: 28*@px;
      }
      .btn-cancel {
        float: left;
        padding: 0 30*@px;
        color: @color-grey;
        font-size: 28*@px;
      }
      .dialog-title {
        text-align: center;
        margin: 0 150*@px;
      }
    }
    .dialog-body {
      max-height: 80vh;
      position: relative;
      overflow: auto;
    }
  }
}
</style>
