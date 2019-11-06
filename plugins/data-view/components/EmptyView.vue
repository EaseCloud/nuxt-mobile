<template>
  <page v-bind="pageOptions">
    <slot></slot>
  </page>
</template>

<script>
export default {
  name: 'EmptyView',
  props: {
    title: { type: [String, Function], default: '新的页面' },
    // subtitle: { type: [String, Function], default: '' },
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
        navbar: {
          title: vm.title
        },
        actionbar: !!vm.actions.length && { actions: vm.actions }
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
