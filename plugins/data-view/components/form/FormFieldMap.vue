<template>
  <div class="form-field">
    <div class="form-field-label">
      <span class="required" v-if="field.final.required">*</span>
      {{field.final.label}}
    </div>
    <div class="form-field-content"
         :class="{empty: !field.displayValue.lat||!field.displayValue.lng,
         editable: !field.final.disabled&&!field.final.readonly}">
      <div class="field-item field-item-map"
           @click="onClick">
        {{field.displayValue.label||field.final.placeholder||'请点击设置定位'}}
        <!--:rows="field.rows || 5"-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormFieldMap',
  props: {
    field: {
      type: Object,
      required: true,
    }
  },
  async mounted () {
    const vm = this
    vm.field.$el = this
    // 默认不进行回写
    if (vm.field.onWriteField === void 0) vm.field.onWriteField = () => null
  },
  methods: {
    async onClick () {
      const vm = this
      vm.$emit('input', await vm.pickLocation())
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/defines";

.field-item-map {
  padding: 20*@px 0;
  line-height: 48*@px;
}
</style>
