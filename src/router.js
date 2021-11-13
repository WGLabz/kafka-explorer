import VueRouter from "vue-router";

import Logs from "./pages/Logs";
import Config from "./pages/Config";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
const routes = [
  { path: "/", component: Home, icon: "mdi-home-minus-outline", bottom: false },

  {
    path: "/messages",
    component: Messages,
    icon: "mdi-message-badge-outline",
    bottom: false,
  },
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
