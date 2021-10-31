import Vue from "vue";
import VueRouter from "vue-router";
import Container from "./views/Container";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Container,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes,
});

export default router;
