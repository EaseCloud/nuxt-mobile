import components from './components'

export default {
  install (Vue, options) {
    Vue.mixin({
      components,
    })
  }
}


