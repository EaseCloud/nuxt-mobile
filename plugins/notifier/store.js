export default {
  namespaced: true,
  state: {
    notify_items: []
  },
  mutations: {
    addNotify (state, message, delay = 3000, closable = false) {
      state.notify_items.push({ message, delay, closable })
    },
    dismissNotify (state, item) {
      const pos = state.notify_items.indexOf(item)
      if (pos > -1) state.notify_items.splice(pos, 1)
    }
  }
}
