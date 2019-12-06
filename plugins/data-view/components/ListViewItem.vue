<template>
  <render-component :render="rendering.item" :self="$this" :args="[item,index,items]"
                    v-if="data && rendering.item"></render-component>
  <div class="view-item" v-else-if="data" :class="{flat:options.flat}"
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
                            :self="$this" :args="[field, index]"></render-component>
        </div>
      </div>
      <render-component v-if="rendering.itemBody" :render="rendering.itemBody"
                        :self="$this" :args="item"></render-component>
    </div>
    <div class="item-footer">
      <div class="item-info">
        <render-component :render="rendering.itemInfo"
                          :self="$this" :args="item"></render-component>
      </div>
      <div class="item-status">
        <render-component :render="rendering.itemStatus"
                          :self="$this" :args="item"></render-component>
      </div>
      <div class="item-actions">
        <!-- TODO: 动态的动作重构 -->
        <a v-for="action in actions"
           v-if="action.display===void 0||finalizeSync(action.display,item)"
           class="btn-action" :class="{[action.buttonClass||'default']:true}"
           @click="action.action.apply($this, [item, index])">
          {{action.label}}
        </a>
        <a class="btn-action default"
           v-if="options.can_edit===void 0||finalizeSync(options.can_edit,item)"
           @click="editItem(item)">查看</a>
        <a class="btn-action error"
           v-if="options.can_delete===void 0||finalizeSync(options.can_delete,item)"
           @click="deleteItem(item)">删除</a>
      </div>
    </div>
  </div>
</template>

<script>
import defaults from '../defaults'
import tableComponents from './table'
import fieldSetMixins from './fieldSetMixins'

export default {
  mixins: [fieldSetMixins],
  data () {
    return {
      data: null
    }
  },
  props: {
    item: { required: true },
    model: { type: String, default: '' },
    pk: { type: String, default: 'id' },
    index: { type: Number, default: -1 },
    items: { type: Array, default: null },
    fields: { type: Array, required: true },
    actions: { type: Array, default: () => [] },
    options: {
      type: Object,
      default: () => ({
        can_select: false,
        can_create: true,
        can_delete: true,
        can_edit: true,
        flat: false,
        edit_inline: false,
        embed_list_actions: false,
        show_actions: true,
        show_pager: false,
        selector_column_width: 40,
        show_item_header: true,
        show_item_footer: true,
        // action_column_render_header: null, // 自定义操作列头渲染
      }),
    },
    rendering: {
      type: Object,
      default: () => ({
        itemTitle: h => h('span', { style: { color: 'red' } }, 'rendering.itemTitle()'),
        itemSubtitle: h => null,
        itemInfo: h => null,
        itemStatus: h => null,
        itemBody: h => null,
        // 卡片的左边彩带颜色
        ribbonColor: false
      })
    }
  },
  computed: {
    hooks () {
      const vm = this
      return { ...defaults.hooks, ...(vm.$attrs.hooks || {}) }
    }
  },
  async mounted () {
    const vm = this
    await Promise.all(vm.fields.map(async field => vm.setListViewFieldDefault(field)))
    await vm.finalizeFields()
    await vm.preRenderData()
  },
  methods: {
    async preRenderData () {
      const vm = this
      const row = {}
      await Promise.all(vm.fields.map(async function (field, i) {
        const key = `__column${i}__`
        const type = await vm.finalize(field.type, vm)
        // CHECKLIST: <data-view-types> <list-view>
        if (type === 'label' || type === 'text') {
          row[key] = await vm.getFieldValue(field, vm.item)
        } else if (type === 'html') {
          row[key] = await vm.getFieldValue(field, vm.item)
        } else if (type === 'image') {
          row[key] = await vm.getFieldValue(field, vm.item)
        } else if (type === 'switch') {
          row[key] = await vm.getFieldValue(field, vm.item)
        } else if (type === 'link') {
          row[key] = await vm.getFieldValue(field, vm.item)
        } else if (type === 'render') {
          row[key] = vm.item
        } else {
          console.warn('尚未定义 ListViewTable 的 preRenderDataRow 字段处理类型：', type)
          row[key] = await vm.getFieldValue(field, vm.item)
        }
      }))
      vm.data = row
    },
    /**
     * 渲染单个单元格
     */
    renderCell (h, field, index) {
      const vm = this
      const type = field.final.type || 'text'
      const fieldIndex = vm.fields.indexOf(field)
      const value = vm.data[`__column${fieldIndex}__`]
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
    async editItem (item) {
      const vm = this
      await (vm.options.edit_inline ? vm.actionInlineEdit(item) : vm.actionEdit(item))
    },
    async deleteItem (item) {
      const vm = this
      await vm.confirm('确认删除这个对象？')
      await vm.actionDelete(item)
      vm.$emit('deleted', item)
    }
  }
}
</script>


<style lang="less" scoped>
@import "../../../../assets/styles/defines";

.view-item {
  margin: 20*@px;
  background: white;
  .rounded-corners(5*@px);
  .box-shadow(2*@px 3*@px 5*@px rgba(0, 0, 0, 0.2));
  border-left: 5*@px solid @color-main;
  &.flat {
    margin: 0;
    border-left: 0;
    border-bottom: 1px solid @color-border;
    .box-shadow(none);
  }
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
    .item-status {
      font-size: 26*@px;
      color: @color-grey;
      display: inline-block;
      float: right;
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
</style>
