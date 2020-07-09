export default {
  namespaced: true,
  state: () => ({
    loading_count: 0
  }),
  actions: {
    begin ({ commit, state, dispatch }) {
      commit('begin')
    },
    end ({ commit, state, dispatch }) {
      commit('end')
    }
  },
  mutations: {
    begin (state) {
      state.loading_count += 1
    },
    end (state, item) {
      state.loading_count -= 1
    }
  }
}

