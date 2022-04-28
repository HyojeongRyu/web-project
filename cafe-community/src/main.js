import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import { store } from "./store/store.js";
import axios from "axios";

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
