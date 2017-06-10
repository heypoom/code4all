import Vue from "vue"

import App from "./components/App"
import router from "./routes"
import store from "./store"

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App />",
  components: {App}
})
