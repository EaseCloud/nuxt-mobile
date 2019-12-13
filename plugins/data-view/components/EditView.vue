<template>
  <!-- 为了保证内层能够 update 到只能用这么恶心的办法 -->
  <empty-view :title="title"
              :context="item"
              :actions="actions"
              :pageActions="pageActions"
              :backUrl="options.back_url||getModelListRoute(model)">
    <slot name="before"></slot>
    <edit-view-form v-bind="editViewOptions"
                    @loaded="$emit('loaded',$event)"
                    @change="item=$event;$emit('change',$event)"
                    ref="form">
    </edit-view-form>
    <template slot="actions">
      <a class="action-item primary"
         v-if="options.can_edit === void 0 ||
               finalizeSync(options.can_edit,item)"
         @click="submit()">保存</a>
      <a class="action-item danger"
         v-if="Number($route.params.id) &&
         (options.can_delete===void 0||finalizeSync(options.can_delete,item))"
         @click="remove()">删除</a>
    </template>
    <template v-slot:actionbar-info>
      <slot name="actionbar-info"></slot>
    </template>
    <slot></slot>
  </empty-view>
</template>

<script>
import defaults from '../defaults'
import EditViewForm from './EditViewForm.vue'

export default {
  name: 'EditView',
  props: {
    pageActions: { type: Array, default: () => [] },
    ...EditViewForm.props,
  },
  computed: {
    editViewOptions () {
      const vm = this
      return {
        ...vm.$attrs,
        ...vm.$props,
        id: Number(vm.$props.id || vm.$route.params.id)
      }
    },
    hooks () {
      const vm = this
      return { ...defaults.hooks, ...(vm.$attrs.hooks || {}) }
    },
  },
  data () {
    return {
      item: null,
      cacheName: '',
      cachePath: ''
    }
  },
  methods: {
    async refresh () {
      const vm = this
      const form = await vm.waitFor(vm.$refs, 'form')
      await form.reload()
    },
    async save () {
      // TODO: 提交之前应该实现 validate 验证方法，以校验 required 等字段的情况
      const vm = this
      const isCreate = !vm.$refs.form.id_
      await vm.validate()
      await vm.$refs.form.save()
      // 保存之后
      // console.log(vm.options, vm.hooks)
      // if (vm.hooks.action_after_save) {
      //   const next = await vm.hooks.action_after_save.apply(vm, [item, isCreate])
      //   if (!next) return
      // }
      // 默认的保存情节
      if (isCreate) {
        // 如果是创建要跳转页面
        const route = await vm.getModelEditRoute(vm.model, vm.$refs.form.id_)
        // await vm.replacePage(route)
        vm.$router.replace(route)
      }
      await vm.refresh()
    },
    async submit () {
      const vm = this
      await vm.save()
      // vm.closeCurrentPage()
    },
    async remove () {
      const vm = this
      await vm.confirm('确认删除？')
      await vm.$refs.form.deleteItem()
      await vm.hooks.action_after_delete.apply(vm, [vm.item])
      // vm.closeCurrentPage()
    },
    async validate () {
      const vm = this
      return vm.$refs.form.validate()
    }
  },
  mounted () {
    const vm = this
    vm.cacheName = vm.$route.name
    vm.cachePath = vm.$route.path
  },
  watch: {
    $route (to) {
      const vm = this
      // 使用 cacheName 和 cachePage 缓存属性来避免同组件跳转时的内容不更新
      if (to.name === vm.cacheName && to.path !== vm.cachePath) {
        vm.cachePath = to.path
        vm.$nextTick(() => {
          vm.$refs.form.reload()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../assets/styles/defines";
</style>
