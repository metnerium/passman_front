import { createStore } from 'vuex'

const store = createStore({
  state: {
    token: '', // Здесь должен храниться JWT токен
    authenticated: false,
  },
  mutations: {
    setAuthenticated(state, value) {
      state.authenticated = value
    },
    setToken(state, token) {
      state.token = token
    },
  },
})

export default store
