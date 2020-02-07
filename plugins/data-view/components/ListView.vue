<template>
  <page v-bind="pageOptions">
    <ul class="tab-list">
      <!-- tab: {label:<label>,key:<key>,query:{}}
      注意：tab 的 query 可能要设置对应的清除参数 {status:null}
      才能清除其他 tab 例如 {status:'active'} 的过滤-->
      <li v-for="tab in tabs"
          v-if="tab.display===void 0||finalizeSync(tab.display)"
          class="tab-item" :class="{active:($route.query.__tab__||'')===(tab.key||'')}">
        <a @click="tabTo(tab)">{{tab.label}}</a>
      </li>
    </ul>
    <div class="content" :class="{'has-tab': !!tabs}">
      <list-view-table v-bind="listViewOptions" ref="table"></list-view-table>
    </div>
  </page>
</template>

<script>
import defaults from '../defaults'
import ListViewTable from './ListViewTable.vue'

export default {
  name: 'ListView',
  props: {
    ...ListViewTable.props,
    tabs: {
      type: Array
    }
  },
  data () {
    const vm = this
    const listViewOptions = {
      // showPager: true,
      ...vm.$attrs,
      ...vm.$props,
      // page: Number(vm.$route.query.page) || vm.$props.page,
      pageSize: Number(vm.$route.query.page_size) || vm.$props.pageSize,
      initQuery: vm.filterQuery({ ...vm.$route.query })
    }
    const pageOptions = {
      navbar: {
        title: vm.title,
        actions: [...(listViewOptions.pageActions || [])]
      }
    }
    // 考虑允许创建的时候加入 createinfo
    if (listViewOptions.options.can_create === void 0
      || vm.finalizeSync(listViewOptions.options.can_create)) {
      pageOptions.navbar.actions.push({
        icon: 'plus',
        async action () {
          vm.$router.push(await vm.getModelEditRoute(listViewOptions.model, 0))
        }
      })
    }
    return {
      pageOptions,
      listViewOptions,
    }
  },
  computed: {
    // listViewOptions () {
    //   const vm = this
    //   return {
    //     // showPager: true,
    //     ...vm.$attrs,
    //     ...vm.$props,
    //     // page: Number(vm.$route.query.page) || vm.$props.page,
    //     pageSize: Number(vm.$route.query.page_size) || vm.$props.pageSize,
    //     initQuery: vm.filterQuery({ ...vm.$route.query })
    //   }
    // },
    hooks () {
      const vm = this
      return { ...defaults.hooks, ...(vm.$attrs.hooks || {}) }
    },
    pageSizeOpts () {
      const vm = this
      const opts = [10, 20, 30, 40]
      if (opts.indexOf(Number(vm.pageSize)) === -1) opts.push(vm.pageSize)
      opts.sort((a, b) => a - b)
      return opts
    }
  },
  methods: {
    refresh () {
      const vm = this
      vm.$refs.table.reload()
    },
    onLoaded (items) {
      const vm = this
      vm.$emit('loaded', items)
    },
    onQuery (queryChange) {
      // console.log('onQuery', queryChange)
      const vm = this
      const query = { ...vm.$route.query }
      vm._.forEach(queryChange, (value, key) => {
        // 删除查询条件机制
        if (value === null || value === void 0) {
          delete query[key]
        } else {
          query[key] = value
        }
      })
      vm.$router.replace({ query })
    },
    tabTo (tab) {
      const vm = this
      const query = { ...vm.$router.query }
      if (!tab.key) delete query.__tab__
      else query.__tab__ = tab.key
      vm.$router.replace({ query })
    },
    filterQuery (query) {
      const vm = this
      // 计算 tab 获得的 query
      if (vm.tabs) {
        let tab = null
        vm.tabs.some(t => {
          const match = (t.key || '') === (vm.$route.query.__tab__ || '')
          if (match) {
            tab = t
            return true
          }
        })
        if (tab) Object.assign(query, tab.query || {})
      }
      // 排除保留关键词
      delete query.__tab__
      delete query.page
      delete query.page_size
      return query
    },
    async pageTo (page) {
      const vm = this
      // 需要的时候才跳转，跳转后交由 $watch.$route 接管
      if (Number(vm.$route.query.page || 1) !== Number(page)) {
        vm.$router.replace({ query: { ...vm.$route.query, page } })
      }
    },
    async pageSizeTo (pageSize) {
      const vm = this
      // 需要的时候才跳转，跳转后交由 $watch.$route 接管
      if (Number(vm.$route.query.page_size || 10) !== Number(pageSize)) {
        vm.$router.replace({ query: { ...vm.$route.query, page_size: pageSize } })
      }
    }
  },
  watch: {
    async $route (routeTo, routeFrom) {
      const vm = this
      // 本页 query 参数跳转处理，传递参数变化进 ListViewTable
      if (routeFrom.path === routeTo.path) {
        const $table = await vm.waitFor(vm.$refs, 'table')
        // 先剔除 page_size 和 page 的 query 参数
        if (routeTo.query.page_size && Number(routeTo.query.page_size) !== Number(routeFrom.query.page_size)) {
          $table.pageSizeTo(Number(routeTo.query.page_size))
        }
        if (routeTo.query.page && Number(routeTo.query.page) !== Number(routeFrom.query.page)) {
          $table.pageTo(Number(routeTo.query.page))
        }
        // 强制变更查询条件
        $table.doQuery(vm.filterQuery({ ...routeTo.query }))
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/defines";

.content {
  .fill-absolute();
  overflow: hidden;
  &.has-tab {
    top: 88*@px;
    margin-top: 1px;
  }
}

ul.tab-list {
  line-height: 88*@px;
  background: white;
  //border-top: 1px solid @color-border;
  border-bottom: 1px solid @color-border;
  text-align: center;
  font-size: 32*@px;
  //margin-top: 20*@px;
  overflow-x: scroll;
  white-space: nowrap;
  li.tab-item {
    display: inline-block;
    line-height: 54*@px;
    margin: 0 30*@px;
    vertical-align: middle;
    padding: 0 10*@px;
    &.active {
      border-bottom: 4*@px solid @color-main;
    }
  }
}
</style>
