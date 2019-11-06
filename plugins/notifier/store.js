export default {
  namespaced: true,
  state: {
    notify_items: []
  },
  actions: {
    async addNotify ({ commit, state, dispatch }, message, delay = 3000, closable = false) {
      const item = { message, delay, closable }
      commit('addNotify', item)
      if (delay) setTimeout(() => commit('dismissNotify', item), delay)
    },
    async dismissNotify ({ commit, state }, item) {
      commit('dismissNotify', item)
    },
  },
  mutations: {
    addNotify (state, item) {
      state.notify_items.push(item)
      return item
    },
    dismissNotify (state, item) {
      const pos = state.notify_items.indexOf(item)
      if (pos > -1) state.notify_items.splice(pos, 1)
    }
  }
}

