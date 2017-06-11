import Vue from "vue"
import VueShortKey from "vue-shortkey"

import App from "./components/App"
import router from "./routes"
import store from "./store"

Vue.config.productionTip = false

Vue.use(VueShortKey)

window.$vm = new Vue({
  el: "#app",
  router,
  store,
  template: "<App />",
  components: {App}
})
