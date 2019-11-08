<template>
  <div class="page">
    <slot name="navbar">
      <div class="nav-bar" v-if="navbar">
        <fa icon="chevron-left" class="btn-back"
            @click="navbar.backUrl ? $router.replace(backUrl) : $router.back()"></fa>
        <div class="title">{{navbar.title}}</div>
        <div class="actions" v-if="navbar.actions">
          <template v-for="action in navbar.actions">
            <fa :icon="action.icon" class="action-item"
                @click="doAction(action.action)"></fa>
          </template>
        </div>
      </div>
    </slot>
    <div class="page-body" :class="{'with-navbar': !!navbar, 'with-actionbar': !!actionbar}">
      <slot></slot>
    </div>
    <slot name="actionbar">
      <div class="action-bar" v-if="actionbar">
        <div class="actions">
          <template v-for="action in actionbar.actions">
            <a class="action-item" :class="{[action.buttonClass||'default']: true}"
               v-if="action.display === void 0 ||
                     typeof(action.display) === 'function' && action.display(this) ||
                     typeof(action.display) !== 'function' && !!action.display"
               @click="doAction(action.action)">{{action.label}}</a>
          </template>
        </div>
      </div>
    </slot>
    <!-- 提示、弹窗等功能注册入口 -->
    <notifier-registry></notifier-registry>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // notify_items: [{ message: 'fuck\nyou\none\nmore\ntime', delay: 0, closable: true },
      //   { message: 'fuck', delay: 1000, closable: false },
      //   { message: '又长又臭还打死不换行的一段傻逼文字一写到底无怨无悔', delay: 5000, closable: false }]
    }
  },
  props: {
    /**
     * 顶部标题栏
     * 属性：
     * title: 导航栏标题
     * backUrl: 指定返回链接（如果为空，直接 $router.back）
     * actions: 指令数组，放在右上角的角标
     *   * icon: 按钮显示的 font-awesome 的图标名称
     *   * label: 按钮显示的文本
     *   * TODO: collapse: 是否折叠，折叠的话会需要点省略号才出来
     *   * action: 点击之后执行的动作函数
     */
    navbar: {
      type: Object,
      default: null
    },
    /**
     * 底部动作栏
     * 属性：
     * actions: 指令数组，放在右上角的角标
     *   * label: 按钮显示的文本
     *   * buttonClass: 按钮样式 default/primary/info/success/warning/error
     *   * action: 点击之后执行的动作函数
     */
    actionbar: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="less" scoped>
@import (once) '../../../assets/styles/defines';

.page {
  .fill-absolute();
  .nav-bar {
    z-index: 1;
    .fixed-top();
    height: 88*@px;
    line-height: 88*@px;
    background: @color-main;
    color: white;
    .clearfix();
    .actions {
      position: absolute;
      right: 0;
      top: 0;
      .action-item {
        height: 44*@px;
        width: 44*@px;
        padding: 22*@px;
        float: left;
      }
    }
    .btn-back {
      position: absolute;
      top: 0;
      left: 0;
      height: 44*@px;
      width: 44*@px;
      padding: 22*@px;
    }
    .title {
      text-align: center;
    }
  }
  .action-bar {
    z-index: 1;
    .fixed-bottom();
    font-size: 32*@px;
    height: 88*@px;
    background: white;
    border-top: 1px solid @color-border;
    .actions {
      float: right;
      .action-item {
        float: left;
        display: block;
        line-height: 88*@px;
        padding: 0 30*@px;
        &.default {
          color: @color-default;
          background: @color-default-background;
        }
        &.primary {
          color: @color-primary;
          background: @color-primary-background;
        }
        &.info {
          color: @color-info;
          background: @color-info-background;
        }
        &.success {
          color: @color-success;
          background: @color-success-background;
        }
        &.warning {
          color: @color-warning;
          background: @color-warning-background;
        }
        &.error, &.danger {
          color: @color-error;
          background: @color-error-background;
        }
      }
    }
  }
  .page-body {
    .fill-absolute();
    &.with-navbar {
      top: 88*@px;
    }
    &.with-action-bar {
      bottom: 148*@px;
    }
  }
}
</style>