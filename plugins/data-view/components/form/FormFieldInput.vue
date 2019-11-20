<template>
  <div class="form-field">
    <div class="form-field-label">
      <span class="required" v-if="field.final.required">*</span>
      {{field.final.label}}
    </div>
    <div class="form-field-content"
         :class="{empty: !field.value, editable: !field.final.disabled&&!field.final.readonly}">
      <div class="field-item field-item-input"
           @click="onClick">
        {{field.value||field.final.placeholder||'请输入'+field.final.label}}
        <!--:rows="field.rows || 5"-->
      </div>
    </div>
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
  },
  methods: {
    async onClick () {
      const vm = this
      if (vm.field.final.disabled || vm.field.final.readonly) return
      if (vm.field.onClick) vm.field.onClick(vm.field)
      const value = await vm.prompt(`修改${vm.field.label}`, vm.field.value)
      vm.$emit('input', value)
    }
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
