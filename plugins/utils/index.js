import utils from './utils'

export default {
  install (Vue, options) {
    Vue.mixin({
      methods: { ...utils }
    })
  }
}


