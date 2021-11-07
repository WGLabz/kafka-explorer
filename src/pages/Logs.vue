/* eslint-disable vue/no-v-model-argument */
<template>
  <v-container>
    <a-row type="flex" justify="start" class="pb-8">
      <a-col :span="3">
        <a-select
          label-in-value
          :default-value="{ key: logTypeDfaultSelection }"
          style="width: 90px"
          @change="handleLogTypeSelectionChange"
        >
          <a-select-option
            :value="option"
            v-for="(option, index) in logTypeOptions"
            :key="index"
          >
            {{ option }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="8">
        <a-range-picker
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          style="width: 270px"
          :default-value="[moment(new Date() - 24 * 60 * 60 * 1000), moment()]"
          @ok="onOk"
        />
      </a-col>
      <a-col :span="4">
        <a-button @click="refresh"> <v-icon> mdi-refresh </v-icon></a-button>
      </a-col>
    </a-row>
    <v-row height="75vh">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="logs"
          :items-per-page="8"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// import { Log } from "../../backend";
import moment from "moment";
// const { ipcRenderer } = require('electron')
// import { ipcRenderer } from 'electron';
export default {
  data() {
    return {
      logTypeDfaultSelection: "WARN",
      logTypeOptions: ["INFO", "WARN", "ERROR"],
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "_id",
        },
        { text: "Date", value: "timestamp" },
        { text: "Type", value: "type" },
        { text: "message", value: "message" },
      ],
      logs: [],
      // Values to be passed to backend
      logType: "WARN",
      startDate: new Date(new Date() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
    };
  },
  mounted() {
    this.loadLogs();
    this.$nextTick(function () {
      window.ipcRenderer.receive("logGetResponse", (args) => {
        args.map((doc) => {
          doc.timestamp = moment(doc.timestamp).format("HH:mm DD/MM/YYYY");
        });
        this.logs = args;
      });
    });
  },
  methods: {
    moment,
    refresh() {
      this.loadLogs();
    },
    loadLogs() {
      window.ipcRenderer.send("logGet", {
        type: this.logType,
        start: this.startDate,
        end: this.endDate,
      });
      console.log({
        type: this.logType,
        start: this.startDate,
        end: this.endDate,
      });
    },
    onOk(value) {
      this.startDate = value[0].toDate();
      this.endDate = value[1].toDate();
      console.log("onOk: ", value);
    },
    handleLogTypeSelectionChange(value) {
      this.logType = value;
    },
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  display: none;
}
body {
  overflow-x: hidden;
}
</style>
