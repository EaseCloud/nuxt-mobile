<template>
  <vue-better-scroll class="wrapper"
                     ref="scroll"
                     :scrollbar="{fade:true}"
                     :pullDownRefresh="{threshold:90,stop:40}"
                     :pullUpLoad="{threshold:90,txt:{more:'加载更多',noMore:'没有更多数据了'}}"
                     :startY="0"
                     @pulling-down="reload()"
                     @pulling-up="loadMore()">
    <div class="view-list">
      <list-view-item v-for="(item, i) in items" :key="i"
                      :model="model" :pk="pk"
                      :item="item" :options="options" :index="i"
                      :rendering="rendering" :fields="fields"
                      :hooks="$attrs.hooks"
                      :actions="actions"
                      @deleted="itemDeleted"></list-view-item>
    </div>
  </vue-better-scroll>
</template>

<script>
// TODO: 动态表头处理
// TODO: 字段类型(text/label/expand)
// TODO: 渲染函数，需要全面支持 Promise 异步
import defaults from '../defaults'

import tableComponents from '../components/table'
import fieldSetMixins from './fieldSetMixins'

export default {
  name: 'ListViewTable',
  components: { ...tableComponents },
  mixins: [fieldSetMixins],
  props: {
    model: { type: String, required: true },
    title: { type: String, default: '列表视图' },
    subtitle: { type: String, default: 'ListView' },
    pk: { type: String, default: 'id' },
    fields: { type: Array, required: true },
    // 行级操作按钮
    actions: { type: Array, default: () => [] },
    // 页面级操作按钮
    listActions: { type: Array, default: () => [] },
    options: {
      type: Object,
      default: () => ({
        can_select: false,
        can_create: true,
        can_delete: true,
        can_edit: true,
        edit_inline: false,
        embed_list_actions: false,
        show_actions: true,
        show_pager: false,
        selector_column_width: 40,
        show_item_header: true,
        show_item_footer: true,
        // action_column_render_header: null, // 自定义操作列头渲染
      })
    },
    rendering: {
      type: Object,
      default: () => ({
        itemTitle: h => h('span', { style: { color: 'red' } }, 'rendering.itemTitle()'),
        itemSubtitle: h => null,
        itemInfo: h => null,
        // 卡片的左边彩带颜色
        ribbonColor: false
      })
    },
    pageSize: { type: Number, default: 10 },
    page: { type: Number, default: 1 },
    // 当 edit_inline = true 时，根据这个选项进行弹窗编辑
    editViewOptions: { type: Object, default: null },
    filters: { type: Object, default: () => ({}) },
    initQuery: { type: Object, default: () => ({}) },
    rowClassName: { type: Function },
    size: {
      default: 'small',
      validator (value) {
        return ['large', 'default', 'small'].indexOf(value) > -1
      }
    }
  },
  data () {
    const vm = this
    return {
      // 是否正在加载中
      loading: false,
      // 经过渲染预处理的 iView table 猎头数据
      // columns: [],
      // 经过渲染预处理的数据
      data: [],
      // 原始获得的原始数据
      items: [],
      // 选中的项目列表，主键 pk 的列表
      selectedIndices: [],
      // 固化查询条件
      query: { ...vm.filters, ...vm.initQuery },
      // 固化分页条件
      pager: {
        page: vm.page,
        pageSize: vm.pageSize,
        pageCount: 1,
        count: 0
      }
      // TODO: 改为 plugins 实现
      // preview_image: null
    }
  },
  computed: {
    hooks () {
      const vm = this
      return { ...defaults.hooks, ...(vm.$attrs.hooks || {}) }
    },
    // selectedItems () {
    //   const vm = this
    //   return vm.selectedIndices.map(i => vm.items[i])
    // }
  },
  methods: {
    async loadMore () {
      const vm = this
      // 锁
      if (vm.loading) return
      // 到底就不加载了
      if (vm.pager.count && vm.pager.page > vm.pager.count) {
        vm.$refs.scroll.forceUpdate(false)
        return
      }
      // 锁定
      vm.loading = true
      // default django manner，其他框架通过钩子把数据整理成这个格式
      const { page, count, results } = await vm.hooks.action_load_data.apply(vm)
      // 整除：https://stackoverflow.com/a/4228528/2544762
      vm.pager.pageCount = ~~((count - 1) / vm.pager.pageSize) + 1
      vm.pager.page = page || vm.pager.page
      vm.pager.count = count
      // 预处理所有数据
      const items = []
      await Promise.all(results.map(async function (item, i) {
        items[i] = await vm.hooks.filter_item_before_render.apply(vm, [item])
      }))
      // 加入列表
      vm.items.splice(vm.items.length, 0, ...items)
      vm.$nextTick(async () => {
        // 等渲染完毕之后才确定加载完毕，免得过早触发下拉控件
        vm.loading = false
        vm.$emit('loaded', items)
        // 发送读取完成事件
        // 加载完毕检测
        // 必须等待 scroll 组件加载
        await vm.waitFor(vm.$refs, 'scroll')
        vm.$refs.scroll.forceUpdate(vm.pager.page < vm.pager.pageCount)
        vm.pager.page += 1
      })
    },
    async reload () {
      const vm = this
      vm.pager.page = 1
      vm.items = []
      vm.data = []
      await vm.loadMore()
    },
    /**
     * 修改当前查询集的查询条件并且刷新数据
     */
    async doQuery (query, forceReload = false, reloadHeader = true) {
      const vm = this
      let updated = false
      vm._.forEach(query, (value, key) => {
        // 删除查询条件机制
        if (value === null || value === void 0) {
          if (key in vm.query) {
            delete vm.query[key]
            updated = true
          }
        } else {
          if (vm.query[key] !== value) {
            vm.query[key] = value
            updated = true
          }
        }
      })
      // // TODO: 添加文档
      // vm.$emit('query', query)
      // // TODO: 为何这里要加 nextTick，另外为何不是先 reload 再 emit
      // vm.$nextTick(() => {
      //   vm.reload()
      // })
      // 如果全部参数都是一样的情况下，不做刷新
      if (forceReload || updated) {
        // 修改查询条件的话刷新全部数据
        await vm.reload()
        // 通知父组件
        vm.$emit('query', query)
      }
    },
    // async pageTo (page, forceReload = false) {
    //   const vm = this
    //   if (forceReload || Number(vm.pager.page) !== Number(page)) {
    //     vm.pager.page = page
    //     await vm.reload()
    //     vm.$emit('page_to', page)
    //   }
    // },
    // async pageSizeTo (pageSize, forceReload = false) {
    //   const vm = this
    //   if (forceReload || Number(vm.pager.pageSize) !== Number(pageSize)) {
    //     vm.pager.pageSize = pageSize
    //     await vm.reload()
    //     vm.$emit('page_size_to', pageSize)
    //   }
    // },
    async itemDeleted (item) {
      const vm = this
      vm.reload()
      // // 删除的话不刷新，只移除一个元素，免得打断用户体验
      // const pos = vm.items.indexOf(item)
      // console.log(vm.items)
      // if (pos > 1) vm.items.splice(pos, 1)
      // console.log(vm.items)
    }
  },
  mounted () {
    const vm = this
    vm.fields.forEach(field => {
      field.$view = vm
    })
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/defines";

.view-list {
  .clearfix();
}
</style>
