<template>
  <div class="field-item field-item-input">
    <input class="form-field-input"
           ref="input"
           :title="field.key"
           v-model="field.value"
           @input="$emit('input', $event.value)"
           :type="field.final.htmlType || 'text'"
           :rows="field.rows || 5"
           :disabled="field.final.disabled"
           :readonly="field.final.readonly"
           :placeholder="field.final.placeholder" />
  </div>
</template>

<script>
export default {
  name: 'FormFieldInput',
  props: {
    field: {
      type: Object,
      default: () => {
      }
    }
  },
  mounted () {
    const vm = this
    vm.field.$el = this
  }
}
</script>

<style lang="less">
input.form-field-input {
  border: 0;
  background: transparent;
  height: inherit;
  line-height: inherit;
  text-align: right;
  width: 100%;
  box-sizing: border-box;
}
</style>
