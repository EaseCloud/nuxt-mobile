<script>
export default {
  name: 'FormFieldBase',
  props: {
    field: {
      type: Object,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    const vm = this
    vm.field.$el = this
  },
  methods: {
    async onClick () {
      const vm = this
      if (vm.field.onClick) {
        // 如果 onClick 返回 false 或者 reject，后面的默认行为就不会触发
        if (await vm.field.onClick(vm.field) === false) return
        if (vm.isReadonly()) return
      }
      const value = await vm.inputValue()
      vm.$emit('input', value)
    },
    async inputValue () {
      const vm = this
      vm.notify('尚未实现')
    },
    isReadonly () {
      const vm = this
      return vm.readonly || vm.field.final.disabled || vm.field.final.readonly
    }
  }
}
</script>

