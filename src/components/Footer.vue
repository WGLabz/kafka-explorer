<template>
  <v-row no-gutters class="px-2">
    <v-col cols="3">
      <a-popover :title="`Cluster Info`">
        <template v-slot:content>
          <small>
            Updated:
            {{ moment(clusterInfo.timestamp).format("DD/MM/YYYY hh:mm") }}
          </small>
          
        </template>
        <a-badge dot :status="clusterInfo.status ? 'success' : 'error'">
          <span style="color: white; font-size: 10px">{{ controller }}</span>
        </a-badge>
      </a-popover>
    </v-col>
  </v-row>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      clusterInfo: {},
      controller: "",
    };
  },
  mounted() {
    this.$nextTick(function () {
      window.ipcRenderer.receive("clusterdata", (args) => {
        console.log(args);
        this.clusterInfo = args;
        this.controller = args.brokers.find(
          (broker) => broker.nodeId === args.controller
        ).host;
      });
    });
  },
  methods: {
    moment,
  },
};
</script>
