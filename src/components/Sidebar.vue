<template>
  <v-navigation-drawer permanent mini-variant app>
    <v-img src="/logo.jpg" style="height: 40px" />

    <v-divider class="mx-2 mb-2"></v-divider>
    <!-- eslint-disable-next-line vue/valid-v-for -->
    <v-list nav dense v-for="(route, index) in routes">
      <v-list-item link :key="index" :to="route.path" v-if="!route.bottom">
        <v-list-item-icon>
          <v-icon>{{ route.icon }}</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list>
        <!-- eslint-disable-next-line vue/valid-v-for -->
        <v-list nav dense v-for="(route, index) in routes">
          <v-list-item link :key="index" :to="route.path" v-if="route.bottom">
            <v-list-item-icon>
              <v-icon>{{ route.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list></v-list
      >
    </template>
  </v-navigation-drawer>
</template>

<script>
import { routes } from "../router";
export default {
  data: () => ({
    routes,
  }),
};
</script>
