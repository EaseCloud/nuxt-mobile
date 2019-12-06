<template>
  <div class="page">
    <slot name="navbar">
      <div class="nav-bar" v-if="navbar">
        <fa icon="chevron-left" class="btn-back"
            @click="backOrRedirect(navbar.backUrl)"></fa>
        <div class="title">{{navbar.title}}</div>
        <div class="actions" v-if="navbar.actions">
          <template v-for="action in navbar.actions"
                    v-if="action.display===void 0||finalizeSync(action.display,context)">
            <fa :icon="action.icon" class="action-item"
                @click="doAction(action.action,[context])"></fa>
          </template>
        </div>
      </div>
    </slot>
    <div class="page-body" :class="{'with-navbar': !!navbar, 'with-actionbar': showActionBar()}">
      <slot></slot>
    </div>
    <slot name="actionbar">
      <div class="action-bar" v-show="showActionBar()">
        <div class="info">
          <slot name="actionbar-info"></slot>
        </div>
        <div class="actions">
          <template v-if="actionbar&&actionbar.actions">
            <a class="action-item" :class="{[action.buttonClass||'default']: true}"
               v-for="action in actionbar.actions"
               v-if="action.display===void 0||finalizeSync(action.display,context)"
               @click="doAction(action.action, [context])">{{action.label}}</a>
          </template>
          <slot name="actions"></slot>
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
     * 传入 actions 动作函数里面的上下文对象
     */
    context: { default: null },
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
  },
  methods: {
    reload () {
    },
    showActionBar () {
      const vm = this
      return !!vm.$slots['actionbar-info'] || !!vm.$slots.actions ||
        vm.actionbar && vm.actionbar.actions.some(action => {
          return action.display === void 0 || vm.finalizeSync(action.display, vm.context)
        })
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
    line-height: 88*@px;
    background: white;
    border-top: 1px solid @color-border;
    .info {
      display: inline-block;
    }
    .actions {
      float: right;
      .action-item {
        float: left;
        display: block;
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
    overflow: auto;
    &.with-navbar {
      top: 88*@px;
    }
    &.with-actionbar {
      bottom: 88*@px;
    }
  }
}
</style>
