<template>
  <div>
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
                    <th id="host" class="text-left">Host</th>
                    <th id="port" class="text-left">Port</th>
                    <th id="id" class="text-left">Id</th>
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
            style="font-size: 10px; cursor: pointer"
          >
          </a-badge>
        </a-popover>
        <a-divider type="vertical" />
        <a-tooltip title="Database Size">
          <span
            class="pl-0"
            style="font-size: 10px; cursor: pointer; color: white"
          >
            <a-icon type="database" class="pr-1" />
            {{ dbSize }}
          </span>
        </a-tooltip>
        <a-divider type="vertical" />
        <a-tooltip title="Purge Dtabase">
          <span
            @click="purgedbmodal = true"
            class="pl-0"
            style="font-size: 10px; cursor: pointer; color: white"
          >
            <a-icon type="delete" class="pr-1" />
            Purge
          </span>
        </a-tooltip>

        <a-divider type="vertical" />
        <a-tooltip title="Autoconnect">
          <a-switch
            defaultChecked
            @change="changeConnectionRetry"
            size="small"
            color="red"
          />
        </a-tooltip>
      </v-col>
    </v-row>
    <a-modal
      size="small"
      v-model="purgedbmodal"
      :footer="false"
      title="Purge database contents"
    >
      <d-b-purge></d-b-purge>
    </a-modal>
  </div>
</template>
<script>
import moment from "moment";
import DBPurge from "./DBPurge.vue";
export default {
  components: { DBPurge },
  data() {
    return {
      clusterInfo: {},
      controller: "Not Connected",
      dbSize: "Calculating",
      sizeBlink: 1,
      purgedbmodal: false,
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
      window.ipcRenderer.receive("dbsize", (args) => {
        this.dbSize = (args / 1024).toFixed(2) + " KB";
        this.sizeBlink = !this.sizeBlink;
      });
    });
  },
  methods: {
    moment,
    changeConnectionRetry(state) {
      console.log(state);
      window.ipcRenderer.send("conf", {
        command: "STATUS",
        STATUS: state ? "CONNECT" : "STOP",
      });
    },
  },
};
</script>
<style lang="css">
.ant-badge-status-text {
  color: white !important;
  font-size: 10px !important;
}
</style>
