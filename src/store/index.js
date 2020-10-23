import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'
import game from './game'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null,
    currGame: null
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    },
    setCurrentGame(state, game) {
      state.currGame = game
    },
    addPlayer2ToCurrentGame(state, player2) {
      state.currGame.player2 = player2
    },
    clearCurrentGame(state) {
      state.currGame = null
    }
  },
  getters: {
    error: state => state.error,
    currGame: state => state.currGame
  },
  modules: {
    auth, info, game
  }
})
