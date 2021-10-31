import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import Container from "./views/Container";
import App from "./App.vue";

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
  .mount("#app");
