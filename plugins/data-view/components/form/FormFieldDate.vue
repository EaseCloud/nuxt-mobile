<template>
  <div class="form-field"
       v-show="field.final && (field.final.visible === void 0 || field.final.visible)">
    <div class="form-field-label">
      <span class="required" v-if="field.final.required">*</span>
      {{field.final.label}}
    </div>
    <div class="form-field-content"
         :class="{empty: !field.value, editable: !isReadonly()}">
      <div class="field-item field-item-date"
           @click="onClick">{{field.displayValue||field.final.placeholder||
        (isReadonly()?'无':'点击选择日期')}}</div>
    </div>
  </div>
</template>

<script>
import FormFieldBase from './FormFieldBase'

export default {
  extends: FormFieldBase,
  name: 'FormFieldDate',
  methods: {
    async inputValue () {
      const vm = this
      return vm.pickDate(`修改${vm.field.label}`, vm.field.value || vm.moment().format('YYYY-MM-DD'))
    }
  }
}
</script>

