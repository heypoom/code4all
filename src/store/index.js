import Vue from "vue"
import Vuex from "vuex"

/* eslint guard-for-in: 0 */
/* eslint no-restricted-syntax: 0 */

Vue.use(Vuex)

const initialState = () => ({})

const store = new Vuex.Store({
  state: initialState
})

export default store
