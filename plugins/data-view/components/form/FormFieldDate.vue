<template>
  <div class="form-field">
    <div class="form-field-label">
      <span class="required" v-if="field.final.required">*</span>
      {{field.final.label}}
    </div>
    <div class="form-field-content"
         :class="{empty: !field.value, editable: !field.final.disabled&&!field.final.readonly}">
      <div class="field-item field-item-date"
           @click="onClick">
        {{field.displayValue||field.final.placeholder||
        (field.final.disabled||field.final.readonly?'无':'点击选择日期')}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormFieldDate',
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  mounted () {
    const vm = this
    vm.field.$el = this
  },
  methods: {
    async onClick () {
      const vm = this
      if (vm.field.final.disabled || vm.field.final.readonly) return
      if (vm.field.onClick) {
        // 如果 onClick 返回 false 或者 reject，后面的默认行为就不会触发
        if (await vm.field.onClick(vm.field) === false) return
      }
      const value = await vm.pickDate(`修改${vm.field.label}`, vm.field.value || vm.moment().format('YYYY-MM-DD'))
      vm.$emit('input', value)
    }
  }
}
</script>

<style lang="less">
</style>
