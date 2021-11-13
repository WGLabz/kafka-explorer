<template>
  <v-app>
    <v-app-bar id="app-bar" app color="primary" height="40">
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <Sidebar />
    <v-main class="mx-2 my-2">
      <router-view></router-view>
    </v-main>
    <v-footer height="30" padless app color="primary" fixed>
      <NewFooter />
    </v-footer>
  </v-app>
</template>

<script>
import NewFooter from "./components/Footer.vue";
import Sidebar from "./components/Sidebar.vue";
export default {
  name: "App",

  components: {
    NewFooter,
    Sidebar,
  },

  mounted() {
    window.ipcRenderer.send("kafka", { command: "init" });

    this.$nextTick(function () {
      window.ipcRenderer.receive("userMessage", (args) => {
        switch (args.type) {
          case "ERROR":
            this.$message.error(args.message, 4);
            break;
          case "WARN":
            this.$message.warning(args.message, 4);
            break;
          case "INFO":
            this.$message.success(args.message, 4);
            break;
        }
      });
    });
  },
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
        margin-right: 24px
        margin-left: 12px !important

      +rtl()
        margin-left: 24px
        margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>
