<template>
  <v-row justify="center" no-gutters>
    <v-col class="text-center" cols="12"> HELLO </v-col>
  </v-row>
</template>
<script>
export default {
  mounted() {
    this.$nextTick(function () {
      window.ipcRenderer.receive("clusterdata", (args) => {
        console.log(args);
      });
    });
  },
};
</script>
