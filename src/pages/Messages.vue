<template>
  <!-- eslint-disable vue/no-v-model-argument  -->
  <div class="mt-4">
    <a-row type="flex" justify="start" class="mb-5">
      <a-col :span="24">
        <a-range-picker
          class="mr-3"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          style="width: 270px"
          v-model:vlue="rangepickerval"
          @ok="onOk"
        />
        <a-button
          class="mr-3"
          icon="search"
          @click="getMessages"
          type="primary"
        >
        </a-button>
        <a-switch @change="refreshstatusbuttontoggled" class="float-right">
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <a-icon slot="checkedChildren" type="reload" />
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
        <a-button class="mr-3 float-right" icon="reload" @click="reset">
        </a-button>
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
        >
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      refreshstatus: false,
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
      },
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
          customRender: (msg) => {
            let msg_ = JSON.parse(msg);
            return (
              <small>
                <a-icon type="message" class="px-1" />
                {msg_.value} <br />
                <a-icon type="key" class="px-1" />
                {msg_.key}
              </small>
            );
          },
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
      // setInterval(
      //   function () {
      //     if (this.refreshstatus) {
      //       this.getMessages();
      //     }
      //   }.bind(this),
      //   15000
      // );
    });
  },
  methods: {
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
  },
  // created() {
  //   this.poolMessages();
  // },
  // beforeUnmount() {
  //   clearInterval(this.polling);
  // },
};
</script>
