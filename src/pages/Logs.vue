<template>
  <!-- eslint-disable vue/no-v-model-argument  -->
  <div>
    <a-row type="flex" justify="start" class="mb-1">
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
        <a-input
          style="width: 120px"
          class="mr-3"
          v-model="searchtext"
          placeholder="Text to search"
          type="primary"
        />
        <a-tooltip title="Search">
          <a-button class="mr-3" @click="load" type="primary">
            <a-icon type="search" class="mt-1" />
          </a-button>
        </a-tooltip>
        <a-tooltip title="Refresh">
          <a-button @click="refresh" class="float-right">
            <a-icon type="reload" class="mt-1" />
          </a-button>
        </a-tooltip>
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
            >
              {{ text }}
            </a-tag>
          </template>
          <template v-slot:message="text">
            <small>{{ text.substring(0, 105) }}</small>
          </template>
          <template v-slot:date="text">
            <small>{{ text }} </small>
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
      searchtext: "",
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
          title: "Date",
          dataIndex: "timestamp",
          scopedSlots: { customRender: "date" },
        },
        {
          title: "Type",
          dataIndex: "type",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "message",
          dataIndex: "message",
          scopedSlots: { customRender: "message" },
        },
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
      this.startDate = new Date(new Date() - 24 * 60 * 60 * 1000);
      this.endDate = new Date();
      this.load();
    },
    loadLogs() {
      window.ipcRenderer.send("logGet", {
        type: this.logType,
        start: this.startDate,
        end: this.endDate,
        text: this.searchtext,
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
