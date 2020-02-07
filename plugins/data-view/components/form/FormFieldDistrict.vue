<template>
  <div class="form-field">
    <div class="form-field-label">
      <span class="required" v-if="field.final.required">*</span>
      {{field.final.label}}
    </div>
    <div class="form-field-content"
         :class="{empty: !/^\d{6}$/.test(field.value), editable: !isReadonly()}">
      <div class="field-item field-item-district"
           @click="onClick">
        {{/^\d{6}$/.test(field.displayValue)&&gb.get(field.displayValue)||field.final.placeholder||
        (isReadonly()?'无':'点击选择城市')}}
      </div>
    </div>
  </div>
</template>

<script>
import FormFieldBase from './FormFieldBase'

export default {
  extends: FormFieldBase,
  name: 'FormFieldDistrict',
  methods: {
    async inputValue () {
      const vm = this
      return vm.pickDistrict(
        `修改${vm.field.label}`,
        vm.field.value || await vm.getCurrentDistrict()
      )
    }
  }
}
</script>

<style lang="less">
</style>
