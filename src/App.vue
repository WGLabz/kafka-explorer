<template>
  <v-app>
    <v-app-bar id="app-bar" app color="primary" height="40">
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <Sidebar />
    <v-main class="mx-2 my-2" v-if="loaded === 1">
      <router-view></router-view>
    </v-main>
    <v-main class="mx-2 my-2" v-else-if="loaded === 0">
      <div
        style="width: 100%; text-align: center; position: absolute; top: 50%"
      >
        <a-spin />
      </div>
    </v-main>
    <v-main class="mx-2 my-2" v-else-if="loaded === -1">
      <div
        style="width: 100%; text-align: center; position: absolute; top: 50%"
      >
        <a-alert message="Configure the app in config page please!!" banner />
      </div>
    </v-main>

    <v-footer height="20" padless app color="primary" fixed>
      <NewFooter />
    </v-footer>
  </v-app>
</template>

<script>
import NewFooter from "./components/Footer.vue";
import Sidebar from "./components/Sidebar.vue";
export default {
  name: "App",
  data() {
    return {
      loaded: 0,
    };
  },
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
          case "load":
            this.loaded = args.value ? 1 : 0;
            break;
        }
      });
    });
    setTimeout(() => {
      this.loaded = this.loaded === 1 ? 1 : -1;
    }, 70000);
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
<style>
html,
body {
  overflow: auto !important;
}
</style>
