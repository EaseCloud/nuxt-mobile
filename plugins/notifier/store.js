export default {
  namespaced: true,
  state: () => ({
    dialogs: [],
    notify_items: [],
    file_pickers: []
  }),
  actions: {
    addNotify ({ commit, state, dispatch }, message, delay = 3000, closable = false) {
      const item = { message, delay, closable }
      commit('addNotify', item)
      if (delay) setTimeout(() => commit('dismissNotify', item), delay)
    },
    dismissNotify ({ commit, state }, item) {
      commit('dismissNotify', item)
    },
    openDialog ({ commit, state, dispatch }, dialog) {
      commit('openDialog', dialog)
      return dialog
    },
    closeDialog ({ commit, state, dispatch }, dialog) {
      commit('closeDialog', dialog)
    },
    pickFile ({ commit, state, dispatch }, filePicker) {
      commit('addFilePicker', filePicker)
      return filePicker
    },
    dismissFilePicker ({ commit, state, dispatch }, filePicker) {
      commit('dismissFilePicker', filePicker)
    }
  },
  mutations: {
    addNotify (state, item) {
      state.notify_items.push(item)
    },
    dismissNotify (state, item) {
      const pos = state.notify_items.indexOf(item)
      if (pos > -1) state.notify_items.splice(pos, 1)
    },
    openDialog (state, dialog) {
      state.dialogs.push(dialog)
    },
    closeDialog (state, dialog) {
      const pos = state.dialogs.indexOf(dialog)
      if (pos > -1) state.dialogs.splice(pos, 1)
    },
    addFilePicker (state, filePicker) {
      state.file_pickers.push(filePicker)
    },
    dismissFilePicker (state, filePicker) {
      const pos = state.file_pickers.indexOf(filePicker)
      if (pos > -1) state.file_pickers.splice(pos, 1)
    },
  }
}

