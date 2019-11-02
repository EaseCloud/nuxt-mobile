import Vue from 'vue'
import NotifierRegistry from './components/NotifierRegistry'

Vue.mixin({
  components: {
    NotifierRegistry
  },
  methods: {
    notify (message, delay = 3000, closable = false) {
      const vm = this
      vm.$store.commit('notifier/addNotify', message, delay, closable)
    }
  }
})
