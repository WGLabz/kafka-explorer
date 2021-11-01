import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";

Vue.config.productionTip = false;
Vue.use(VueRouter);

const routes = [{ path: "/foo", component: require("./pages/Home") }];

const router = new VueRouter({
  routes, // short for `routes: routes`
});
new Vue({
  vuetify,
  router: router,
  render: (h) => h(App),
}).$mount("#app");
