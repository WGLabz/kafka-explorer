<template>
  <v-navigation-drawer permanent mini-variant app expand-on-hover>
    <!-- <v-img src="/logo.jpg" style="height: 40px" /> -->
    <v-list >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="/logo.jpg" ></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-list>
    <v-divider class="mx-2 mb-2"></v-divider>
    <!-- eslint-disable-next-line vue/valid-v-for -->
    <v-list nav dense>
      <v-list-item
        link
        :key="index"
        :to="route.path"
        v-for="(route, index) in topMenu()"
      >
        <v-list-item-icon>
          <v-icon>{{ route.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ route.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list nav dense>
        <v-list-item
          link
          :key="index"
          :to="route.path"
          v-for="(route, index) in bottomMenu()"
        >
          <v-list-item-icon>
            <v-icon>{{ route.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ route.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { routes } from "../router";
export default {
  data: () => ({
    routes: routes,
  }),
  methods: {
    topMenu() {
      return this.routes.filter((route) => {
        return !route.bottom;
      });
    },
    bottomMenu() {
      return this.routes.filter((route) => {
        return route.bottom;
      });
    },
  },
};
</script>
