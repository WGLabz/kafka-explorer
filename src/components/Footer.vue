<template>
  <v-row no-gutters class="px-2">
    <v-col>
      <a-popover :title="`Cluster Info`">
        <template v-slot:content>
          <small>
            Updated:
            {{ moment(clusterInfo.timestamp).format("DD/MM/YYYY hh:mm") }}
          </small>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Host</th>
                  <th class="text-left">Port</th>
                  <th class="text-left">Id</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in clusterInfo.brokers" :key="item.nodeId">
                  <td>{{ item.host }}</td>
                  <td>{{ item.port }}</td>
                  <td>{{ item.nodeId }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </template>
        <a-badge
          dot
          :status="clusterInfo.status ? 'success' : 'error'"
          :text="controller"
          style="font-color: white; font-size: 10px"
        >
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
      controller: "Not Connected",
    };
  },
  mounted() {
    this.$nextTick(function () {
      window.ipcRenderer.receive("clusterdata", (args) => {
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
<style lang="css">
.ant-badge-status-text {
  color: white !important;
  font-size: 10px !important;
}
</style>
