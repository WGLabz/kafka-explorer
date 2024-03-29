<template>
  <!-- eslint-disable vue/no-v-model-argument  -->
  <div>
    <a-row type="flex" justify="start" class="mb-4">
      <a-col :span="24">
        <a-range-picker
          class="mr-3"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          style="width: 270px"
          v-model:vlue="rangepickerval"
          @ok="onOk"
        />
        <a-input
          style="width: 120px"
          class="mr-3"
          v-model="searchtext"
          placeholder="Text to search"
          type="primary"
        />
        <a-tooltip title="Search messages">
          <a-button type="primary" @click="getMessages">
            <a-icon type="search" class="mt-1" />
          </a-button>
        </a-tooltip>
        <a-tooltip title="Auto-load messages">
        <a-switch
          @change="refreshstatusbuttontoggled"
          class="float-right my-2 ml-2"
          size="small"
          style=""
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <a-icon slot="checkedChildren" type="reload" />
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
        </a-tooltip>

        <a-tooltip title="Refresh" class="float-right">
          <a-button @click="reset">
            <a-icon type="reload" class="mt-1" />
          </a-button>
        </a-tooltip>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col>
        <a-table
          bordered
          :data-source="kafkamessages"
          :columns="columns"
          size="small"
          :rowKey="(record) => record._id"
          :pagination="paginationSettings"
          :customRow="customRow"
        >
          <template v-slot:message="record">
            <a-tooltip placement="topLeft">
              <template v-slot:title>
                <span>Click to explore!</span>
              </template>
              <small
                v-on:click="messageselected(record)"
                style="cursor: pointer"
              >
                <a-icon type="message" class="px-1" />
                {{ JSON.parse(record).value.substring(0, 60) }} <br />
                <a-icon type="key" class="px-1" />
                {{ JSON.parse(record).key || "NO_KEY" }}
              </small>
            </a-tooltip>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-modal
      size="small"
      v-model="messagedetailsmodal"
      @ok="messagedetailsmodalclosed"
      :footer="false"
    >
      <template v-slot:title
        >{{ messagemodaltitle }}
        <a-tag>
          <small>
            {{ moment(selectedMessage.timestamp).format("DD/MM/yyyy HH:mm") }}
          </small>
        </a-tag>
      </template>
      <message-viewer :data="selectedMessage"></message-viewer>
    </a-modal>
  </div>
</template>
<script>
import moment from "moment";
import MessageViewer from "../components/MessageViewer.vue";

export default {
  components: { MessageViewer },
  data() {
    return {
      refreshstatus: false,
      searchtext: "",
      rangepickerval: [],
      addnewtopicmodalvisibility: false,
      server: "",
      startDate: new Date(new Date() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      username: "",
      password: "",
      polling: null,
      kafkamessages: [],
      paginationSettings: {
        size: "small",
        pageSize: 6,
        position: "top",
      },
      messagedetailsmodal: false,
      selectedMessage: {},
      messagemodaltitle: "",
      columns: [
        {
          title: "Time",
          dataIndex: "timestamp",
          customRender: (text) => {
            return moment(text).format("DD/MM/YYYY HH:mm");
          },
        },
        {
          title: "Topic",
          dataIndex: "topic",
        },
        {
          title: "Type",
          dataIndex: "type",
          customRender: (text) => {
            return text === "consume" ? (
              <div>
                <a-icon type="arrow-down" />
              </div>
            ) : (
              <div>
                <a-icon type="arrow-up" />
              </div>
            );
          },
        },
        {
          title: "Message",
          dataIndex: "message",
          scopedSlots: { customRender: "message" },
        },
        {
          title: "Partition",
          dataIndex: "partition",
        },
        {
          title: "Status",
          dataIndex: "publishstatus",
          customRender: (val) => {
            return val ? (
              <div>
                <a-icon type="check" style="color:green" />
              </div>
            ) : (
              <div>
                <a-icon type="stop" style="color:red" />
              </div>
            );
          },
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.reset();
      window.ipcRenderer.receive("kafkamessagesresponse", (args) => {
        if (args.type === "auto" && !this.refreshstatus) {
          return;
        }
        if (args.type === "auto") {
          this.kafkamessages = args.data;
          return;
        }
        this.kafkamessages = args;
      });
    });
  },
  methods: {
    messagedetailsmodalclosed() {
      this.messagedetailsmodal = false;
    },
    messageselected() {
      this.messagedetailsmodal = true;
      this.messagemodaltitle = this.selectedMessage.topic;
    },
    refreshstatusbuttontoggled(checked) {
      this.refreshstatus = checked;
      if (checked)
        this.$message.success("Messages will load automatically.", 4);
      else this.$message.warning("Messages will not load automatically.", 4);
    },
    onOk(value) {
      this.startDate = value[0].toDate();
      this.endDate = value[1].toDate();
      this.getMessages();
    },
    getMessages() {
      window.ipcRenderer.send("kafka", {
        command: "getmessages",
        start: this.startDate,
        end: this.endDate,
        text: this.searchtext,
      });
      this.addnewtopicmodalvisibility = false;
    },
    moment,
    reset() {
      this.rangepickerval = [
        moment(new Date() - 24 * 60 * 60 * 1000),
        moment(),
      ];
      this.getMessages();
    },
    customRow(record) {
      return {
        on: {
          click: () => {
            this.selectedMessage = record;
          },
        },
      };
    },
  },
};
</script>
