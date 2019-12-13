<template>
  <div class="form-field form-field-image">
    <div class="form-field-label">
      <span class="required" v-if="field.final.required">*</span>
      {{field.final.label}}
    </div>
    <div class="form-field-content">
      <div class="field-item field-item-image">
        <img :src="field.displayValue || config.image_placeholder_url" @click.stop="onClick" />
        <a class="btn-reset"
           v-if="!field.final.disabled&&!field.final.readonly&&field.value"
           @click.stop="reset">&times;</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormFieldImage',
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  mounted () {
    const vm = this
    vm.field.$el = this
    // 默认不进行回写
    if (vm.field.onWriteField === void 0) vm.field.onWriteField = () => null
  },
  methods: {
    async onClick () {
      const vm = this
      if (vm.field.final.readonly || vm.field.final.disabled) return
      const action = vm.field.displayValue ?
        await vm.pickChoice('图片操作', { preview: '预览图片', select: '选择图片' }) : 'select'
      if (action === 'preview') {
        await vm.previewImage(vm.field.displayValue)
      } else {
        vm.$emit('input', await vm.pickImage(vm.field.source))
      }
    },
    async reset () {
      const vm = this
      await vm.confirm('确认清除图像？')
      vm.$emit('input', null)
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/defines";

.form-field-image {
  line-height: 140*@px;
  .field-item-image {
    img {
      margin: 20*@px 0;
      width: 100*@px;
      height: 100*@px;
      object-fit: cover;
      display: block;
      float: right;
      border: 1px solid @color-border;
      background: @color-bg-fade;
    }
    .btn-reset {
      position: absolute;
      top: 10*@px;
      right: 20*@px;
      display: block;
      width: 30*@px;
      height: 30*@px;
      line-height: 30*@px;
      border: 4*@px solid white;
      text-align: center;
      font-weight: bold;
      color: white;
      background: #AAA;
      font-size: 30*@px;
      .circle();
    }
  }
}
</style>
