import NotifierRegistry from './components/NotifierRegistry'
import store from './store'

export default {
  install (Vue, options) {
    if (options && options.store) {
      options.store.registerModule('notifier', store)
    }
    Vue.mixin({
      components: {
        NotifierRegistry
      },
      methods: {
        async notify (message, delay = 3000, closable = false) {
          const vm = this
          return vm.$store.dispatch('notifier/addNotify', message, delay, closable)
        },
        async confirm (message) {
          // TODO: 暂时苟且，后面优化
          return window.confirm(message) ? Promise.resolve() : Promise.reject()
        }
      }
    })
  }
}


