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
        {{field.displayValue||field.final.placeholder||'请点击修改内容'}}
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
      const value = await vm.prompt(`修改${vm.field.label}`, vm.field.value)
      vm.$emit('input', value)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/defines";

.field-item-input {
  padding: 20*@px 0;
  line-height: 48*@px;
}
</style>
