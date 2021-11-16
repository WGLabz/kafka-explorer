import VueRouter from "vue-router";

import Logs from "./pages/Logs";
import Config from "./pages/Config";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
const routes = [
  {
    path: "/",
    component: Home,
    icon: "mdi-home-minus-outline",
    bottom: false,
    name: "Home",
  },

  {
    path: "/messages",
    component: Messages,
    icon: "mdi-message-badge-outline",
    name: "Messages",
    bottom: false,
  },
  {
    path: "/logs",
    component: Logs,
    icon: "mdi-text-box-search-outline",
    name: "Logs",
    bottom: false,
  },
  {
    path: "/config",
    component: Config,
    icon: "mdi-cog-outline",
    bottom: true,
    name: "Settings",
  },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

export { router, routes };
