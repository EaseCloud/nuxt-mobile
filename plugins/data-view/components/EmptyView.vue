<template>
  <page v-bind="pageOptions" :context="context">
    <slot></slot>
    <template slot="actions">
      <slot name="actions"></slot>
    </template>
  </page>
</template>

<script>
export default {
  name: 'EmptyView',
  props: {
    title: { type: [String, Function], default: '新的页面' },
    backUrl: { default: '/' },
    // subtitle: { type: [String, Function], default: '' },
    /**
     * 传入 actions 动作函数里面的上下文对象
     */
    context: { default: null },
    // 导航栏操作按钮
    pageActions: { type: Array, default: () => [] },
    // 操作按钮
    actions: { type: Array, default: () => [] },
    options: {
      type: Object,
      default: () => ({
        can_create: true,
        can_delete: true,
        can_edit: true,
        // can_close: true,
        // can_refresh: true,
        show_actions: true,
      })
    },
  },
  computed: {
    pageOptions () {
      const vm = this
      return {
        navbar: { title: vm.title, backUrl: vm.backUrl, actions: vm.pageActions },
        actionbar: !!vm.actions.length && { actions: vm.actions } || null
      }
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
@import "../../../assets/styles/defines";

</style>
