import config from './config'
import _ from 'lodash'
import moment from 'moment'
import gb2260 from 'gb2260'
import gb2260_lib_201607 from 'gb2260/lib/201607.json'

gb2260.register('201607', gb2260_lib_201607)
const gb = new gb2260.GB2260('201607')

export default {
  computed: {
    _: () => _,
    gb: () => gb,
    config: () => config,
    // 返回模板中使用的 this 引用
    $this () {
      return this
    }
  },
  async mounted () {
    const vm = this
    if (vm.reload instanceof Function) await vm.reload()
  },
  methods: {
    moment () {
      return moment(...arguments)
    },
    __lodash__: () => _,
    __moment__: () => moment,
    __gb__: () => gb
  }
}
