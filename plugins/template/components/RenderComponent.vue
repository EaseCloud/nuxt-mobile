<script>
/**
 * 使用范例：
 * <template>
 *   <render-component :render="customRenderFunction"
 *                   :self="this"
 *                   :args="[item]"/>
 * <~template>
 * <script>
 *   export default {
 *     data() {
 *       return {
 *         item: {title: '好莱坞大片'},
 *         customRenderFunction(h, item) {
 *           return h('span', item.title)
 *         }
 *       }
 *     }
 *   }
 * <~script>
 */
export default {
  props: {
    render: Function,
    self: Object,
    args: { default: () => [] }
  },
  render (h) {
    const vm = this
    // 兼容传入单个元素的形式
    const args = vm.args instanceof Array ? vm.args : [vm.args]
    return vm.render && vm.render.apply(self || vm, [h, ...args])
  }
}
</script>
