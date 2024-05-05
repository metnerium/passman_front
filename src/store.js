import { createStore } from 'vuex'

const store = createStore({
  state: {
    authenticated: false,
  },
  mutations: {
    setAuthenticated(state, value) {
      state.authenticated = value
    },
  },
  getters: {
    isAuthenticated: (state) => state.authenticated,
  },
})

export default store
