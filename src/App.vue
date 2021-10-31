<template>
  <v-app>
    <v-main>
      <v-system-bar color="deep-purple darken-3"></v-system-bar>
      <div>
        Bikash Panda
      </div>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>
