import config from './config'
import _ from 'lodash'

export default {
  computed: {
    _: () => _,
    config: () => config,
    // 返回模板中使用的 this 引用
    $this () {
      return this
    }
  },
  async mounted () {
    const vm = this
    if (vm.reload instanceof Function) await vm.reload()
  }
}
