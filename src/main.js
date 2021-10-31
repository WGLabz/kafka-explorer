import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { Container } from "@/views/Container";
loadFonts();

const routes = [
  {
    path: "/",
    name: "Home",
    component: Container,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

createApp(App)
  .use(router)
  .use(vuetify)
  .mount("#app");
