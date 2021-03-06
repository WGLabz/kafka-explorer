import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import { router } from "./router";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'

Vue.use(JsonViewer)
Vue.use(Antd);

Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
  vuetify,
  router: router,
  render: (h) => h(App),
}).$mount("#app");
