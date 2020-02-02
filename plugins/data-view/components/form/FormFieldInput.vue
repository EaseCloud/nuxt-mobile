<template>
  <div class="form-field">
    <div class="form-field-label">
      <span class="required" v-if="field.final.required">*</span>
      {{field.final.label}}
    </div>
    <div class="form-field-content"
         :class="{empty: !field.displayValue, editable: !field.inline&&!isReadonly()}">
      <input class="input-inline" :placeholder="field.final.placeholder" v-if="field.inline" />
      <div v-else class="field-item field-item-input"
           @click="onClick">{{field.displayValue||field.displayValue===0&&'0'||field.final.placeholder||
        (field.final.disabled||field.final.readonly?'无':'点击输入')}}</div>
    </div>
  </div>
</template>

<script>
import FormFieldBase from './FormFieldBase'

export default {
  extends: FormFieldBase,
  name: 'FormFieldInput',
  methods: {
    async inputValue () {
      const vm = this
      return await vm.prompt(`输入${vm.field.label}`,
        vm.field.value, vm.field.final.placeholder, vm.field.rows, vm.field.htmlType)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/defines";

.field-item-input {
  padding: 20*@px 0;
  line-height: 48*@px;
  white-space: pre-wrap;
}

.input-inline {
  border: 0;
  background: transparent;
  box-sizing: border-box;
  width: 100%;
  height: 88*@px;
  text-align: right;
}
</style>
