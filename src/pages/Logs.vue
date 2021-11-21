<template>
  <!-- eslint-disable vue/no-v-model-argument  -->
  <div>
    <a-row type="flex" justify="start" class="mb-5">
      <a-col :span="24">
        <a-select
          class="mr-3"
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
        <a-range-picker
          v-model:value="rangepickerval"
          class="mr-3"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          style="width: 270px"
          @ok="onOk"
        />
        <a-button class="mr-3" icon="search" @click="load" type="primary">
          Search
        </a-button>
        <a-button @click="refresh" class="float-right" icon="reload">
          Refresh
        </a-button>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col>
        <a-table
          bordered
          :data-source="logs"
          :columns="headers"
          size="small"
          :pagination="paginationSettings"
          :rowKey="(record) => record._id"
          :customRow="customRow"
        >
          <template v-slot:type="text">
            <a-tag
              :color="text === 'INFO' ? '' : text === 'WARN' ? 'orange' : 'red'"
              >{{ text }}</a-tag
            >
          </template>
          <template v-slot:id="text">
            {{ text.substring(0, 5) }}
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-row class="mt-1">
      <a-card style="height: 60px" size="small">
        <a-tag
          :color="
            selectedlogtype === 'INFO'
              ? ''
              : selectedlogtype === 'WARN'
              ? 'orange'
              : 'red'
          "
          >{{ selectedlog }}</a-tag
        >
      </a-card>
    </a-row>
  </div>
</template>
<script>
// import { Log } from "../../backend";
import moment from "moment";
// const { ipcRenderer } = require('electron')
// import { ipcRenderer } from 'electron';
export default {
  data() {
    return {
      rangepickerval: [moment(new Date() - 24 * 60 * 60 * 1000), moment()],
      logTypeDfaultSelection: "WARN",
      logTypeOptions: ["INFO", "WARN", "ERROR"],
      selectedlog: "",
      selectedlogtype: "",
      paginationSettings: {
        size: "small",
        pageSize: 7,
        position: "top",
      },
      headers: [
        {
          title: "ID",
          align: "start",
          sortable: false,
          dataIndex: "_id",
          width: "70px",
          scopedSlots: { customRender: "id" },
        },
        { title: "Date", dataIndex: "timestamp" },
        {
          title: "Type",
          dataIndex: "type",
          scopedSlots: { customRender: "type" },
        },
        { title: "message", dataIndex: "message" },
      ],
      logs: [],
      // Values to be passed to backend
      logType: "WARN",
      startDate: new Date(new Date() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
    };
  },
  mounted() {
    this.$nextTick(function () {
      window.ipcRenderer.receive("logGetResponse", (args) => {
        args.map((doc) => {
          doc.timestamp = moment(doc.timestamp).format("HH:mm DD/MM/YYYY");
        });
        this.logs = args;
      });
    });
    this.load();
  },
  methods: {
    moment,
    load() {
      this.logs = [];
      this.loadLogs();
    },
    refresh() {
      this.rangepickerval = [
        moment(new Date() - 24 * 60 * 60 * 1000),
        moment(),
      ];
      this.load();
    },
    loadLogs() {
      window.ipcRenderer.send("logGet", {
        type: this.logType,
        start: this.startDate,
        end: this.endDate,
      });
    },
    onOk(value) {
      this.startDate = value[0].toDate();
      this.endDate = value[1].toDate();
    },
    handleLogTypeSelectionChange(value) {
      this.logType = value.key;
    },
    customRow(record) {
      return {
        on: {
          click: () => {
            this.selectedlog = record.message;
            this.selectedlogtype = record.type;
          },
        },
      };
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
