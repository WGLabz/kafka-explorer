import VueRouter from "vue-router";

import Logs from "./pages/Logs";
import Config from "./pages/Config";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Topics from "./pages/Topics";

const routes = [
  {
    path: "/",
    component: Home,
    icon: "mdi-home-minus-outline",
    bottom: false,
    name: "Home",
    meta: { displayName: '' }
  },

  {
    path: "/messages",
    component: Messages,
    icon: "mdi-message-badge-outline",
    name: "Messages",
    bottom: false,
    meta: { displayName: 'Messages' }
  },
  {
    path: "/logs",
    component: Logs,
    icon: "mdi-text-box-search-outline",
    name: "Logs",
    bottom: false,
    meta: { displayName: 'Application Logs' }
  },
  {
    path: "/topics",
    component: Topics,
    icon: "mdi-text-box-search-outline",
    name: "Topics",
    bottom: false,
    meta: { displayName: 'Configured Topics' }
  },
  {
    path: "/config",
    component: Config,
    icon: "mdi-cog-outline",
    bottom: true,
    name: "Settings",
    meta: { displayName: 'Application Configuration' }
  },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

export { router, routes };
