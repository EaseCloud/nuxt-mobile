<template>
  <div class="mask">
    <!--@click="$store.dispatch('notifier/closeDialog', options)">-->
    <!-- mode 支持几种模式：bottom(默认,底部拉出) modal(模态弹窗) full(全屏) -->
    <div class="dialog" :class="{[options.mode||'bottom']: true}" @click.stop>
      <div class="dialog-header">
        <div class="dialog-title">{{options.title}}</div>
      </div>
      <div class="dialog-body">
        <render-component :render="options.render"></render-component>
      </div>
      <div class="dialog-actions">
        <a class="btn btn-cancel" v-if="options.cancelText"
           @click="doAction(options.onCancel)">{{options.cancelText}}</a>
        <a class="btn btn-ok" v-if="options.okText"
           @click="doAction(options.onOk)">{{options.okText}}</a>
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
  .dialog.full {
    .dialog-header {
      display: none;
    }
    .dialog-actions {
      display: none;
    }
    .dialog-body {
      .fill-fixed();
    }
  }
  .dialog.bottom {
    font-size: 32*@px;
    .fixed-bottom();
    background: white;
    .dialog-header {
      .clearfix();
      border-top: 1px solid @color-border;
      border-bottom: 1px solid @color-border;
      .dialog-title {
        text-align: center;
        height: 88*@px;
        line-height: 88*@px;
        margin: 0 150*@px;
      }
    }
    .dialog-body {
      max-height: 80vh;
      position: relative;
      overflow: auto;
    }
    .dialog-actions {
      position: absolute;
      line-height: 88*@px;
      top: 1px;
      left: 0;
      right: 0;
      .btn-ok {
        float: right;
        padding: 0 30*@px;
        color: @color-primary-background;
      }
      .btn-cancel {
        float: left;
        padding: 0 30*@px;
        color: @color-grey;
      }
    }
  }
  .dialog.modal {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 680*@px;
    font-size: 32*@px;
    background: white;
    transform: translate(-50%, -50%);
    .rounded-corners(10*@px);
    .dialog-header {
      .clearfix();
      line-height: 88*@px;
      border-bottom: 1px solid @color-border;
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
    .dialog-actions {
      line-height: 88*@px;
      border-top: 1px solid @color-border;
      text-align: center;
      display: flex;
      .btn {
        flex: 1;
        border-left: 1px solid @color-border;
        &:first-of-type {
          border-left: 0;
        }
      }
      .btn-cancel {
        color: @color-grey;
      }
      .btn-ok {
        color: @color-primary-background;
      }
    }
  }
}
</style>
