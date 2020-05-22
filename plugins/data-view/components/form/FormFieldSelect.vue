<template>
  <div class="form-field"
       v-show="field.final && (field.final.visible === void 0 || field.final.visible)">
    <div class="form-field-label">
      <span class="required" v-if="field.final.required">*</span>
      {{field.final.label}}
    </div>
    <div class="form-field-content"
         :class="{empty: !field.value, editable: !isReadonly()}">
      <div class="field-item field-item-select"
           @click="onClick">
        {{field.displayValue||field.final.placeholder||
        (isReadonly()?'无':'请点击选择')}}
      </div>
    </div>
  </div>
</template>

<script>
import FormFieldBase from './FormFieldBase'

export default {
  extends: FormFieldBase,
  name: 'FormFieldSelect',
  methods: {
    async inputValue () {
      const vm = this
      return vm.pickChoice(
        `修改${vm.field.label}`,
        await vm.finalizeSync(vm.field.choices, vm.field.context.item),
        vm.field.choiceValueFilter ?
          await vm.finalizeSync(vm.field.choiceValueFilter, vm.field.context.item) : vm.field.value,
        { multiple: vm.field.multiple, align: vm.field.align || 'center' }
      )
    }
  }
}
</script>

<style lang="less">
@import "../../../../assets/styles/defines";

.field-item-select {
  padding: 20*@px 0;
  line-height: 48*@px;
}
</style>
