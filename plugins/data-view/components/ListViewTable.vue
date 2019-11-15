<template>
  <vue-better-scroll class="wrapper"
                     v-if="initialized"
                     ref="scroll"
                     :scrollbar="{fade:true}"
                     :pullDownRefresh="{threshold:90,stop:40}"
                     :pullUpLoad="{threshold:90,txt:{more:'加载更多',noMore:'没有更多数据了'}}"
                     :startY="0"
                     @pulling-down="reload()"
                     @pulling-up="loadMore()">
    <div class="view-list" v-if="initialized">
      <template v-for="(item, i) in items">
        <render-component :render="rendering.item" :self="$this" :args="item"
                          v-if="rendering.item"></render-component>
        <div class="view-item" v-else
             :style="{'border-left-color': rendering.ribbonColor&&finalizeSync(rendering.ribbonColor, item)}">
          <div class="item-header">
            <div class="item-title">
              <render-component :render="rendering.itemTitle"
                                :self="$this" :args="item"></render-component>
            </div>
            <div class="item-subtitle">
              <render-component :render="rendering.itemSubtitle"
                                :self="$this" :args="item"></render-component>
            </div>
          </div>
          <div class="item-body"
               :class="{'has-thumbnail': !!rendering.thumbnail}">
            <div class="thumbnail">
              <render-component :render="rendering.thumbnail"
                                :self="$this" :args="item"></render-component>
            </div>
            <div class="item-field" v-for="field in fields"
                 v-if="field.display===void 0||finalizeSync(field.display,item)">
              <div class="item-field-label">{{field.label}}:</div>
              <div class="item-field-content">
                <render-component :render="renderCell"
                                  :self="$this" :args="[field, i]"></render-component>
              </div>
            </div>
            <!--<div class="item-field">仓库编号: {{item.repository_num}}</div>-->
            <!--<div class="item-field">仓库区域: {{item.repository_zone}}</div>-->
          </div>
          <div class="item-footer">
            <div class="item-info">
              <render-component :render="rendering.itemInfo"
                                :self="$this" :args="item"></render-component>
            </div>
            <div class="item-actions">
              <!--<nuxt-link :to="'/main/admin/warehouse_sheet/'+item.id"-->
              <!--class="btn-action">查看-->
              <!--</nuxt-link>-->
              <!-- TODO: 动态的动作重构 -->
              <a v-for="action in actions"
                 v-if="action.display===void 0||finalizeSync(action.display,item)"
                 class="btn-action" :class="{[action.buttonClass||'default']:true}"
                 @click="action.action.apply($this, [item])">
                {{action.label}}
              </a>
              <a class="btn-action default"
                 v-if="options.can_edit===void 0||finalizeSync(options.can_edit,item)"
                 @click="editItem(item)">查看</a>
              <a class="btn-action error"
                 v-if="options.can_delete===void 0||finalizeSync(options.can_delete,item)"
                 @click="deleteItem(item)">删除</a>
              <!--//       if (vm.options.can_delete === void 0 || vm.finalizeSync(vm.options.can_delete, item)) {-->
              <!--//         controls.push(h('Poptip', {-->
              <!--//           props: {-->
              <!--//             confirm: true,-->
              <!--//             title: '确认删除这项数据？',-->
              <!--//             placement: 'left'-->
              <!--//           },-->
              <!--//           on: { 'on-ok': () => vm.actionDelete(item).then(() => vm.reload()) }-->
              <!--//         }, [h(-->
              <!--//           'Button', {-->
              <!--//             props: { size: 'small', type: 'dashed' }-->
              <!--//           }, '删除'-->
              <!--//         )]))-->
              <!--//         controls.push(vm._v(' '))-->
              <!--//       }-->
            </div>
          </div>
        </div>
      </template>
    </div>
    <!--<i-table ref="table"-->
    <!--v-if="initialized"-->
    <!--:columns="columns"-->
    <!--:loading="loading"-->
    <!--:row-class-name="rowClassNameRaw"-->
    <!--:size="size"-->
    <!--:data="data">-->
    <!--<slot name="footer" slot="footer"></slot>-->
    <!--</i-table>-->
    <!--<div class="list-view-table-footer">-->
    <!--<page v-if="options.show_pager"-->
    <!--:total="pager.count"-->
    <!--:current="pager.page"-->
    <!--:page-size="pager.pageSize"-->
    <!--:page-size-opts="pageSizeOpts"-->
    <!--size="small"-->
    <!--show-sizer-->
    <!--show-total-->
    <!--@on-change="pageTo(Number($event))"-->
    <!--@on-page-size-change="pageSizeTo(Number($event))"></page>-->
    <!--</div>-->
  </vue-better-scroll>
</template>

<script>
// TODO: 动态表头处理
// TODO: 字段类型(text/label/expand)
// TODO: 与 batchActions

// TODO: export 导出

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
      default: {
        itemTitle: {
          type: Function,
          default: h => h('span', { style: { color: 'red' } }, 'rendering.itemTitle()')
        },
        itemSubtitle: { type: Function, default: h => null },
        itemInfo: { type: Function, default: h => null },
        // 卡片的左边彩带颜色
        ribbonColor: false
      }
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
      // 是否已初始化
      initialized: false,
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
    // pageSizeOpts () {
    //   const vm = this
    //   const opts = [10, 20, 30, 40]
    //   if (opts.indexOf(Number(vm.pageSize)) === -1) opts.push(vm.pageSize)
    //   opts.sort((a, b) => a - b)
    //   return opts
    // },
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
      // 预渲染
      const data = await vm.preRenderData(items)
      // 加入列表
      vm.items.splice(vm.items.length, 0, ...items)
      vm.data.splice(vm.data.length, 0, ...data)
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
     * 预渲染所有的已获得对象
     * 即将从 API 获得的原始数据对象 vm.items
     * 转化成传入到 iView Table 的 props 属性 data 的数据属性 vm.data
     */
    async preRenderData (items) {
      const vm = this
      const data = []
      await Promise.all(items.map(async function (item, i) {
        data[i] = await vm.preRenderDataRow(item)
      }))
      return data
    },
    /**
     * 预渲染单个数据行
     * @param item
     */
    async preRenderDataRow (item) {
      const vm = this
      const row = {}
      await Promise.all(vm.fields.map(async function (field, i) {
        const key = `__column${i}__`
        const type = await vm.finalize(field.type, vm)
        // CHECKLIST: <data-view-types> <list-view>
        if (type === 'label' || type === 'text') {
          row[key] = await vm.getFieldValue(field, item)
        } else if (type === 'html') {
          row[key] = await vm.getFieldValue(field, item)
        } else if (type === 'image') {
          row[key] = await vm.getFieldValue(field, item)
        } else if (type === 'switch') {
          row[key] = await vm.getFieldValue(field, item)
        } else if (type === 'link') {
          row[key] = await vm.getFieldValue(field, item)
        } else if (type === 'render') {
          row[key] = item
        } else {
          console.warn('尚未定义 ListViewTable 的 preRenderDataRow 字段处理类型：', type)
          row[key] = await vm.getFieldValue(field, item)
        }
      }))
      return row
    },
    // renderHeader (type, column, index, h, field) {
    //   if (field.renderHeader) return field.renderHeader(h, field)
    //   const children = []
    //   // 插入过滤筛选器
    //   if (field.final.filtering) {
    //     // TODO: 为何这里会搞成平方复杂度？性能有问题，需要调试优化
    //     children.push(h(tableComponents.FilteringHeader, { props: { field } }))
    //   }
    //   return h(
    //     tableComponents.TableHeaderField,
    //     { props: { column, field } },
    //     children
    //   )
    // },
    /**
     * 渲染单个单元格
     */
    renderCell (h, field, index) {
      const vm = this
      const type = field.final.type || 'text'
      const fieldIndex = vm.fields.indexOf(field)
      const value = vm.data[index][`__column${fieldIndex}__`]
      // CHECKLIST: <data-view-types> <list-view>
      // console.log(`RENDER[${index}]:`, type, value)
      if (type === 'label' || type === 'text') {
        return h(tableComponents.TableFieldText, { props: { value, field } })
      } else if (type === 'html') {
        return h(tableComponents.TableFieldHtml, { props: { value, field } })
      } else if (type === 'tag') {
        // TODO: 尚未实现
        return h('div', `TODO:${type}`)
      } else if (type === 'link') {
        const text = field.text(value)
        const route = field.route(value)
        return h('router-link', { props: { to: route } }, text)
      } else if (type === 'image') {
        return h(tableComponents.TableFieldImage, { props: { value, field } })
        // } else if (type === 'image-text') {
        // TODO: 尚未实现
        // return h('div', `TODO:${type}`)
      } else if (type === 'switch') {
        return h(tableComponents.TableFieldSwitch, {
          props: { value, field, index, vmTable: vm }
        })
        //   // TODO: 尚未实现
        //   return h('div', `TODO:${type}`)
        // } else if (type === 'html') {
        //   // TODO: 尚未实现
        //   return h('div', `TODO:${type}`)
        // } else if (type === 'html') {
        //   // TODO: 尚未实现
        //   return h('div', `TODO:${type}`)
      } else if (type === 'render') {
        return field.render(h, value, field, index)
      } else {
        return h(`未定义的字段类型: ${type}`)
      }
    },
    // /**
    //  * 根据指定的 field 选项以及数据行的对象，渲染出具体的 iView
    //  * table 列定义对象
    //  * @param type
    //  * @param value
    //  * @param h
    //  */
    // renderColumn (field, index) {
    //   const vm = this
    //   const type =  vm.finalize(field.type, item) || 'text'
    //   if (type === 'label' || type === 'text') {
    //   } else if (type === 'html') {
    //   } else if (type === 'render') {
    //   }
    // },
    //     setQueryKey(key, value) {
    //       const vm = this;
    //       vm.$router.replace({
    //         query: Object.assign(vm.$route.query, { [key]: value }),
    //       });
    //       vm.reload();
    //     },
    //     removeQueryKey(key) {
    //       const vm = this;
    //       const query = { ...vm.$route.query };
    //       delete query[key];
    //       vm.$router.replace({ query });
    //       vm.reload();
    //     },
    //   },
    // };
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
    /**
     * 初始化所有的行列配置以适配 iView Table 组件的输入格式
     * @returns {Promise<void>}
     */
    async initialize () {
      const vm = this
      // const columns = []
      await Promise.all(vm.fields.map(async function (field, i) {
        vm.setListViewFieldDefault(field)
        // 计算所有字段选项值
        // const key = `__column${i}__`
        await vm.finalizeFields(field)
        // const label = await vm.finalize(field.label, vm)
        // const type = await vm.finalize(field.type, vm)
        // columns[i] = {
        //   title: field.final.label,
        //   render (h, { row, index }) {
        //     // 如果 key 为 '@index' 的话，渲染
        //     let value = row[key]
        //     if (field.key === '@index') {
        //       value = index + 1 + vm.pager.pageSize * ((vm.pager.page || 1) - 1)
        //     }
        //     return vm.renderCell(field.final.type, value, index, h, field)
        //   },
        //   // 渲染列头
        //   renderHeader (h, { column, index }) {
        //     return vm.renderHeader(field.final.type, column, index, h, field)
        //   }
        // }
        // // 隐藏列的变通处理
        // if (field.visible && !field.visible.apply(vm)) {
        //   columns[i].width = -1;
        //   columns[i].render = () => null;
        //   columns[i].renderHeader = () => null;
        // }
      }))
      // TODO: 待改写 actions 的处理
      // if (vm.options.show_actions === void 0 || vm.options.show_actions) {
      //   const columnActions = {
      //     title: '操作',
      //     width: vm.options.action_column_width,
      //     fixed: vm.options.action_column_fixed,
      //     render (h, { row, index }) {
      //       const controls = []
      //       const item = vm.items[index]
      //       // 补丁
      //       // 很奇怪有时候会出现 item 为空的情况（原因未明），这个时候不渲染按钮
      //       if (!item) return h('div')
      //       vm.actions.forEach(action => {
      //         if ((action.display instanceof Function && !action.display.apply(vm, [item])) ||
      //           (!action.display && action.display !== void 0)) {
      //           return
      //         }
      //         controls.push(h(
      //           'i-button', {
      //             props: {
      //               size: 'small',
      //               type: action.buttonType,
      //               shape: action.buttonShape,
      //               icon: action.buttonIcon,
      //               ghost: !!action.ghost
      //             },
      //             on: {
      //               click: () => {
      //                 const result = action.action.apply(vm, [item])
      //                 // result.catch && result.catch(_ => _)
      //               }
      //             }
      //           }, action.label
      //         ))
      //         // 为避免按钮粘在一起，加一个空格以分开
      //         controls.push(vm._v(' '))
      //       })
      //       if (vm.options.can_edit === void 0 || vm.finalizeSync(vm.options.can_edit, item)) {
      //         controls.push(h(
      //           'Button', {
      //             props: { size: 'small' },
      //             on: {
      //               async click () {
      //                 await (vm.options.edit_inline ? vm.actionInlineEdit(item) : vm.actionEdit(item))
      //                 vm.reload()
      //               }
      //             }
      //           }, '编辑'
      //         ))
      //         controls.push(vm._v(' '))
      //       }
      //       if (vm.options.can_delete === void 0 || vm.finalizeSync(vm.options.can_delete, item)) {
      //         controls.push(h('Poptip', {
      //           props: {
      //             confirm: true,
      //             title: '确认删除这项数据？',
      //             placement: 'left'
      //           },
      //           on: { 'on-ok': () => vm.actionDelete(item).then(() => vm.reload()) }
      //         }, [h(
      //           'Button', {
      //             props: { size: 'small', type: 'dashed' }
      //           }, '删除'
      //         )]))
      //         controls.push(vm._v(' '))
      //       }
      //       return h('div', controls)
      //     }
      //   }
      //   // 特殊的操作列渲染声明
      //   if (vm.options.action_column_render_header) {
      //     columnActions.renderHeader = vm.options.action_column_render_header
      //   } else if (vm.options.embed_list_actions) {
      //     columnActions.renderHeader = function render (h) {
      //       const result = ['操作']
      //       if (vm.options.can_create) {
      //         result.push(' ')
      //         result.push(h('i-button', {
      //           props: {
      //             size: 'small',
      //             type: 'success',
      //           },
      //           on: {
      //             async click () {
      //               await (vm.options.edit_inline ? vm.inlineCreate() : vm.redirectCreate())
      //               vm.reload()
      //             }
      //           }
      //         }, '添加'))
      //       }
      //       if (vm.listActions) {
      //         vm.listActions.forEach(action => {
      //           if (action.display !== void 0 && !action.display ||
      //             typeof(action.display) === 'function' && !action.display.apply(vm, [vm])) {
      //             return
      //           }
      //           result.push(' ')
      //           result.push(h('i-button', {
      //             props: {
      //               size: 'small',
      //               type: action.buttonType,
      //               on: {
      //                 click () {
      //                   action.action.apply(vm)
      //                 }
      //               }
      //             }
      //           }, action.label))
      //         })
      //       }
      //       return result
      //     }
      //   }
      //   columns.push(columnActions)
      // }
      // TODO: 待改写：初始化勾选列
      // if (vm.options.can_select) {
      //   columns.unshift({
      //     key: '__selector__',
      //     width: vm.options.selector_column_width || 40,
      //     renderHeader (h, { column, index }) {
      //       return h('checkbox', {
      //         props: {
      //           value: vm.selectedIndices.length > 0 &&
      //           vm.selectedIndices.length === vm.items.length
      //         },
      //         on: {
      //           input (value) {
      //             vm.selectedIndices = value ? vm._.range(vm.items.length) : []
      //             vm.$emit('select', vm.selectedIndices)
      //           }
      //         }
      //       })
      //     },
      //     render (h, { column, index, row }) {
      //       return h('checkbox', {
      //         props: {
      //           value: vm.selectedIndices.indexOf(index) > -1
      //         },
      //         on: {
      //           input (value) {
      //             vm.selectedIndices = (value
      //                 ? vm._.union(vm.selectedIndices, [index])
      //                 : vm._.without(vm.selectedIndices, index)
      //             ).sort((a, b) => a - b)
      //             vm.$emit('select')
      //           }
      //         }
      //       })
      //     }
      //   })
      // }
      // vm.columns = columns
      vm.initialized = true
    },
    async editItem (item) {
      const vm = this
      await (vm.options.edit_inline ? vm.actionInlineEdit(item) : vm.actionEdit(item))
    },
    async deleteItem (item) {
      const vm = this
      await vm.confirm('确认删除这个对象？')
      await vm.actionDelete(item)
      const pos = vm.items.indexOf(item)
      // 删除的话不刷新，只移除一个元素，免得打断用户体验
      if (pos > 1) vm.items.splice(pos, 1)
    }
  },
  mounted () {
    const vm = this
    vm.fields.forEach(field => {
      field.$view = vm
    })
    vm.initialize()
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/defines";

.view-list {
  .clearfix();
  .view-item {
    margin: 20*@px;
    background: white;
    .rounded-corners(5*@px);
    .box-shadow(2*@px 3*@px 5*@px rgba(0, 0, 0, 0.2));
    border-left: 5*@px solid @color-main;
    .item-header {
      line-height: 64*@px;
      font-size: 32*@px;
      padding: 0 20*@px;
      border-bottom: 1px solid #F0F0F0;
      .clearfix();
      .item-title {
        display: inline-block;
      }
      .item-subtitle {
        float: right;
        font-size: 28*@px;
        color: @color-grey;
      }
    }
    .item-body {
      padding: 20*@px;
      position: relative;
      &.has-thumbnail {
        min-height: 140*@px;
        .thumbnail {
          position: absolute;
          left: 20*@px;
          top: 20*@px;
          width: 140*@px;
          img {
            border: 1px solid @color-border;
            box-sizing: border-box;
            width: 140*@px;
            height: 140*@px;
            object-fit: cover;
          }
        }
        .item-field {
          margin-left: 180*@px;
        }
      }
      .item-field {
        font-size: 28*@px;
        line-height: 44*@px;
        .clearfix();
        .item-field-label {
          float: left;
          width: 5em;
        }
        .item-field-content {
          margin-left: 5em;
        }
      }
    }
    .item-footer {
      line-height: 64*@px;
      padding: 0 20*@px;
      border-top: 1px solid #F0F0F0;
      font-size: 28*@px;
      .clearfix();
      .item-info {
        font-size: 26*@px;
        color: @color-grey;
        display: inline-block;
      }
      .item-actions {
        float: right;
        .btn-action {
          display: inline-block;
          font-size: 26*@px;
          line-height: 44*@px;
          border: 1px solid @color-border;
          color: @color-text;
          .rounded-corners(5*@px);
          padding: 0 20*@px;
          margin-left: 10*@px;
          &.primary {
            background: @color-primary-background;
            border-color: @color-primary-background;
            color: white;
          }
          &.info {
            background: @color-info-background;
            border-color: @color-info-background;
            color: white;
          }
          &.warning {
            background: @color-warning-background;
            border-color: @color-warning-background;
            color: white;
          }
          &.success {
            background: @color-success-background;
            border-color: @color-success-background;
            color: white;
          }
          &.error {
            background: @color-error-background;
            border-color: @color-error-background;
            color: white;
          }
        }
      }
    }
  }
}
</style>
