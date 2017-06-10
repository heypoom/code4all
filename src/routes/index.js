import Vue from "vue"
import Router from "vue-router"

import Landing from "./Landing.vue"
import Game from "./Main.vue"

Vue.use(Router)

export default new Router({
  routes: [{
    path: "/",
    name: "Landing",
    component: Landing
  }, {
    path: "/game",
    name: "Main",
    component: Game
  }]
})
