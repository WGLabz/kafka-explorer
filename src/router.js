import VueRouter from "vue-router";

import Logs from "./pages/Logs";
import Config from "./pages/Config";

const routes = [
  { path: "/", component: require("./pages/Home"), icon: "mdi-folder" },
  {
    path: "/logs",
    component: Logs,
    icon: "mdi-text-box-search-outline",
    bottom: true,
  },
  {
    path: "/config",
    component: Config,
    icon: "mdi-cog-outline",
    bottom: true,
  },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

export { router, routes };