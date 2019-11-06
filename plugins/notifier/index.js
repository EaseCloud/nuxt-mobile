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
        notify (message, delay = 3000, closable = false) {
          const vm = this
          vm.$store.dispatch('notifier/addNotify', message, delay, closable)
        }
      }
    })
  }
}


