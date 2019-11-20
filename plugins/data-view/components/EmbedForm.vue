<template>
  <div v-if="initialized" class="embed-form">
    <template
      v-for="(field, i) in fields"
      v-if="field.final && (field.final.display === void 0 || field.final.display)">

      <!-- type: input -->
      <form-field-input v-if="(field.type||'input')==='input'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-input>
      <!-- type: label -->
      <form-field-label v-else-if="field.type==='label'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-label>
      <!-- type: number -->
      <form-field-number v-else-if="field.type==='number'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-number>
      <!-- type: map -->
      <form-field-map v-else-if="field.type==='map'"
                      :field="field"
                      @input="updateField(field, $event)"></form-field-map>
      <!-- type: select -->
      <form-field-select v-else-if="field.type==='select'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-select>
      <!-- type: cascade -->
      <form-field-cascade v-else-if="field.type==='cascade'"
                          :field="field"
                          @input="updateField(field, $event)"></form-field-cascade>
      <!-- type: date -->
      <form-field-date v-else-if="field.type==='date'"
                       :field="field"
                       @input="updateField(field, $event)"></form-field-date>
      <!-- type: radio -->
      <form-field-radio v-else-if="field.type==='radio'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-radio>
      <!-- type: checkbox -->
      <form-field-checkbox v-else-if="field.type==='checkbox'"
                           :field="field"
                           @input="updateField(field, $event)"></form-field-checkbox>
      <!-- type: rate -->
      <form-field-rate v-else-if="field.type==='rate'"
                       :field="field"
                       @input="updateField(field, $event)"></form-field-rate>
      <!-- type: color -->
      <form-field-color v-else-if="field.type==='color'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-color>
      <!-- type: upload -->
      <form-field-upload v-else-if="field.type==='upload'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-upload>
      <!-- type: image -->
      <form-field-image v-else-if="field.type==='image'"
                        :field="field"
                        @input="updateField(field, $event)"></form-field-image>
      <!-- type: gallery -->
      <form-field-gallery v-else-if="field.type==='gallery'"
                          :field="field"
                          @input="updateField(field, $event)"></form-field-gallery>
      <!-- type: switch -->
      <form-field-switch v-else-if="field.type==='switch'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-switch>
      <!-- type: district -->
      <form-field-district v-else-if="field.type==='district'"
                           :field="field"
                           @input="updateField(field, $event)"></form-field-district>
      <!-- type: editor -->
      <form-field-editor v-else-if="field.type==='editor'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-editor>
      <!-- type: object -->
      <form-field-object v-else-if="field.type==='object'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-object>
      <!-- type: multi-object -->
      <form-field-multi-object v-else-if="field.type==='multi-object'"
                               :field="field"
                               @input="updateField(field, $event)"></form-field-multi-object>
      <!-- type: list-view -->
      <form-field-list-view v-else-if="field.type==='list-view'"
                            :field="field"
                            @input="updateField(field, $event)"></form-field-list-view>
      <!-- type: render -->
      <form-field-render v-else-if="field.type==='render'"
                         :field="field"
                         @input="updateField(field, $event)"></form-field-render>
      <!-- type: undefined -->
      <div v-else>未实现的字段类型：{{field.type}}</div>


      <!--<div class="form-field-label">-->
      <!--<span class="required" v-if="field.final.required">*</span>-->
      <!--{{field.label}}-->
      <!--</div>-->
      <!--<div class="form-field-actions">-->
      <!--<template v-for="(action, i) in field.actions"-->
      <!--v-if="action.display===void 0||finalizeSync(action.display, field.context.item)">-->
      <!--<i-button :key="i"-->
      <!--size="small"-->
      <!--:type="action.buttonType"-->
      <!--@click="doFieldAction(action, field)">{{action.label}}-->
      <!--</i-button>-->
      <!--<i :key="'_'+i">&lt;!&ndash;避免按钮之间粘在一起&ndash;&gt;</i>-->
      <!--</template>-->
      <!--</div>-->
      <!--<div class="form-field-content">-->
      <!--&lt;!&ndash; type: input &ndash;&gt;-->
      <!--<form-field-input v-if="(field.type||'input')==='input'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-input>-->
      <!--&lt;!&ndash; type: number &ndash;&gt;-->
      <!--<form-field-number v-else-if="field.type==='number'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-number>-->
      <!--&lt;!&ndash; type: map &ndash;&gt;-->
      <!--<form-field-map v-else-if="field.type==='map'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-map>-->
      <!--&lt;!&ndash; type: label &ndash;&gt;-->
      <!--<form-field-label v-else-if="field.type==='label'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-label>-->
      <!--&lt;!&ndash; type: select &ndash;&gt;-->
      <!--<form-field-select v-else-if="field.type==='select'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-select>-->
      <!--&lt;!&ndash; type: cascade &ndash;&gt;-->
      <!--<form-field-cascade v-else-if="field.type==='cascade'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-cascade>-->
      <!--&lt;!&ndash; type: date &ndash;&gt;-->
      <!--<form-field-date v-else-if="field.type==='date'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-date>-->
      <!--&lt;!&ndash; type: radio &ndash;&gt;-->
      <!--<form-field-radio v-else-if="field.type==='radio'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-radio>-->
      <!--&lt;!&ndash; type: checkbox &ndash;&gt;-->
      <!--<form-field-checkbox v-else-if="field.type==='checkbox'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-checkbox>-->
      <!--&lt;!&ndash; type: rate &ndash;&gt;-->
      <!--<form-field-rate v-else-if="field.type==='rate'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-rate>-->
      <!--&lt;!&ndash; type: color &ndash;&gt;-->
      <!--<form-field-color v-else-if="field.type==='color'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-color>-->
      <!--&lt;!&ndash; type: upload &ndash;&gt;-->
      <!--<form-field-upload v-else-if="field.type==='upload'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-upload>-->
      <!--&lt;!&ndash; type: image &ndash;&gt;-->
      <!--<form-field-image v-else-if="field.type==='image'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-image>-->
      <!--&lt;!&ndash; type: gallery &ndash;&gt;-->
      <!--<form-field-gallery v-else-if="field.type==='gallery'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-gallery>-->
      <!--&lt;!&ndash; type: switch &ndash;&gt;-->
      <!--<form-field-switch v-else-if="field.type==='switch'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-switch>-->
      <!--&lt;!&ndash; type: district &ndash;&gt;-->
      <!--<form-field-district v-else-if="field.type==='district'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-district>-->
      <!--&lt;!&ndash; type: editor &ndash;&gt;-->
      <!--<form-field-editor v-else-if="field.type==='editor'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-editor>-->
      <!--&lt;!&ndash; type: object &ndash;&gt;-->
      <!--<form-field-object v-else-if="field.type==='object'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-object>-->
      <!--&lt;!&ndash; type: multi-object &ndash;&gt;-->
      <!--<form-field-multi-object v-else-if="field.type==='multi-object'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-multi-object>-->
      <!--&lt;!&ndash; type: list-view &ndash;&gt;-->
      <!--<form-field-list-view v-else-if="field.type==='list-view'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-list-view>-->
      <!--&lt;!&ndash; type: render &ndash;&gt;-->
      <!--<form-field-render v-else-if="field.type==='render'"-->
      <!--:field="field"-->
      <!--@input="updateField(field, $event)"></form-field-render>-->
      <!--&lt;!&ndash; type: undefined &ndash;&gt;-->
      <!--<div v-else>未实现的字段类型：{{field.type}}</div>-->

      <!--&lt;!&ndash; description &ndash;&gt;-->
      <!--<div v-if="field.description" class="form-field-description">{{field.description}}</div>-->
      <!--</div>-->
    </template>
  </div>
</template>

<script>
import formComponents from '../components/form'
import fieldSetMixins from './fieldSetMixins'

export default {
  name: 'EmbedForm',
  components: { ...formComponents },
  mixins: [fieldSetMixins],
  props: {
    defaultItem: null,
    noInit: {
      // 默认情况下，noInit=false，EmbedForm 自动根据字段设置初始化 item 然后渲染
      // 如果设置 noInit=true，EmbedForm 将挂起渲染行为，直到外部显式调用 setItem 输入对象
      type: Boolean,
      default: false
    },
    fields: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      initialized: false,
      item: null
    }
  },
  methods: {
    async reload () {
      const vm = this
      await vm.initData()
    },
    async initData () {
      const vm = this
      // 如果指定了 noInit 属性，初始化将跳过设定默认值这一步
      if (vm.noInit) return
      // 为了避免在没有任何动作之前点击保存提交的表单会有字段 undefined 的情况
      // 所有指定的 default 值的字段都会先手动设置进去
      const item = vm.defaultItem || {}
      if (!vm.defaultItem) {
        await Promise.all(vm.fields.map(async (field, i) => {
          // 设置默认值
          if (field.key) vm.setProperty(item, field.key, await vm.finalize(field.default))
        }))
      }
      await vm.setItem(item)
    },
    async setItem (item) {
      const vm = this
      vm.item = item
      vm.$emit('change', vm.item)
      await vm.render()
      // 无论何种形式初始化（initData 或者 noInit + 外部 setItem）
      // 都从这里确认初始化成功，才触发渲染
      vm.initialized = true
    },
    /**
     * 将所有的 item 字段按属性写入所有字段的 field.value
     */
    async render () {
      const vm = this
      await Promise.all(vm.fields.map(field => {
        vm.$set(field, 'context', { item: vm.item, $form: vm })
        return vm.renderField(field)
      }))
      await vm.finalizeFields()
    },
    /**
     * 将 item 中的数据根据 field 类型计算数据到 field 的取值
     * @param field
     * @returns {Promise<void>}
     */
    async renderField (field) {
      const vm = this
      // 前置钩子
      if (field.preRender) {
        await field.preRender.apply(vm, [field])
      }
      // 获取初始值
      let value = await vm.evaluate(vm.item, field.key, await vm.finalize(field.default, vm.item))
      // 根据 filter 过滤
      if (field.filter) value = await field.filter.apply(vm, [value])
      // 根据 mapper 过滤
      const mapper = await vm.finalize(field.mapper, vm)
      if (mapper) {
        value = hasOwnProperty(mapper, value) ? mapper[value] : mapper.__default__
      }
      // Update，会直接影响到内层 EmbedForm 的绑定值
      vm.$set(field, 'value', value)
      // 后置钩子
      if (field.postRender) {
        await field.postRender.apply(vm, [field])
      }
      // 主动更新控件
      if (field.$el && field.$el.reload) await field.$el.reload()
    },
    /**
     * 如果 field 发生了变动（从 EmbedForm 中传递出来）
     * 需要根据字段类型，将对应的数据返写到 item 对象中
     * @param field
     * @param item
     */
    async writeField (field, item) {
      const vm = this
      if (field.onWriteField) {
        // Custom write field hook
        field.onWriteField(field, item)
      } else if (field.type === 'geo') {
        // vm.setProperty(item, field.key && field.key.lat || 'geo_lat', field.value.lat)
        // vm.setProperty(item, field.key && field.key.lng || 'geo_lng', field.value.lng)
        // vm.setProperty(item, field.key && field.key.label || 'geo_label', field.value.label)
      } else {
        if (field.key) {
          vm.setProperty(item, field.key, field.value)
        } else {
          console.error('字段的 key 不存在，无法执行自动写入')
        }
      }
      // 写入完毕之后，要更新所有其他字段的 display 值
      vm.fields.forEach(async f => await vm.finalizeField(f))
    },
    /**
     * 校验表单，通过 Promise 返回校验结果
     * 1. 校验所有 required 字段
     * 2. 校验所有 field 中定义的 validator 方法
     *    validator 方法内部 this 指向 EmbedForm
     *    传入第一个参数为根据 field.key 获取的 value
     *    传入第二个参数为 field 本身
     */
    async validate () {
      const vm = this
      await Promise.all(vm.fields.map(field => new Promise(async (resolve, reject) => {
        // 先校验 required（0 被看做是有数值的）
        if (field.final.required && !field.value && field.value !== 0) {
          const msg = `必须填写【${field.label}】字段`
          vm.notify(msg)
          reject()
        }
        // 校验
        if (field.validator) {
          try {
            const value = await vm.evaluate(vm.item, field.key, field.final.default)
            await field.validator.apply(vm, [value, field])
          } catch (e) {
            vm.notify(e.message)
            reject()
          }
        }
        resolve()
      })))
      return vm.item
    },
    getField (key) {
      const vm = this
      return vm._.find(vm.fields, { key })
    },
    // setField (key, value) {
    //   const vm = this
    //   const field = vm.getField(key)
    //   if (field) {
    //     field.value = value
    //     vm.updateField(field, value)
    //   }
    // },
    async updateField (field, data) {
      const vm = this
      // console.log('updateField', field.key, field.)
      // 如果指定 noSync，则不自动写回 field.value，而由托管的 onUpdate 处理所有更新事务
      if (field.data !== data && !field.noSync) field.value = data
      // onUpdate 的返回值可以控制是否执行 writeField，如果返回 === false 将跳过 writeField
      let write = true
      if (field.onUpdate) write = await field.onUpdate.apply(vm, [field, data]) !== false
      if (write) await vm.writeField(field, vm.item)
      await vm.renderField(field)
      vm.$emit('update', field)
      vm.$emit('change', vm.item)
    },
    async doFieldAction (action, field) {
      const vm = this
      await action.action.apply(vm, [field])
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/styles/defines';

@px: 100vw / 750;

.embed-form {
  .form-field {
    line-height: 88*@px;
    border-top: 1px solid #CCC;
    border-bottom: 1px solid #CCC;
    margin-bottom: -1px;
    font-size: 32*@px;
    background: white;
    position: relative;
    .clearfix();
    .form-field-label {
      float: left;
      padding-left: 30*@px;
      width: 160*@px;
      .required {
        color: red;
      }
    }
    .form-field-content {
      margin-left: 200*@px;
      text-align: right;
      padding-right: 30*@px;
      &.empty {
        color: @color-placeholder;
      }
      &.editable {
        padding-right: 64*@px;
        &::after {
          content: "";
          display: block;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          width: 64*@px;
          height: 88*@px;
          background: url('../../../assets/images/list-arrow.png') no-repeat 50% 50%;
          background-size: 14.5*@px;
        }
      }
    }
  }
}
</style>
