<template>
  <!-- eslint-disable vue/no-deprecated-slot-attribute  -->
  <div>
    <a-card size="small" title="Consumed" style="height: 240px">
      <a-badge slot="extra" :color="consumerStatus"></a-badge>
      <a-input
        placeholder="Topic"
        allow-clear
        slot="extra"
        style="width: 80px"
        size="small"
        v-model="topic"
      />
      <a-tooltip title="Add topic" slot="extra">
        <a-button
          style="margin-left: 8px"
          size="small"
          type="primary"
          @click="hndletopicaddition"
        >
          <a-icon type="plus" class="mt-1" />
        </a-button>
      </a-tooltip>

      <p v-for="(data_, index) in data" :key="index">
        <a-tag>{{ data_.topic }}</a-tag>
        <a-icon type="caret-right" />
        <a-tooltip placement="topLeft">
          <template slot="title">
            <span>Click to explore!</span>
          </template>
          <a-tag
            :color="isLatest(data_.timestamp) ? 'green' : 'red'"
            @click="messageselected(data_)"
            style="cursor: pointer"
            size="small"
          >
            {{ formatMessage(data_.message).value.substring(0, 18) }}
            <small style="color: brown">
              {{ moment(data_.timestamp).format("HH:mm:ss") }}
            </small>
          </a-tag>
        </a-tooltip>
      </p>
      <div v-if="data.length === 0" style="width: 100%; text-align: center">
        <a-icon type="warning" style="color: #dba800; fontsize: 20px" />
        <br />
        <small> No message </small>
      </div>
    </a-card>
    <a-modal
      size="small"
      v-model="messagedetailsmodal"
      @ok="messagedetailsmodalclosed"
      :footer="false"
    >
      <template slot="title"
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
  data() {
    return {
      consumerStatus: "red",
      data: [],
      topic: "",
      messagedetailsmodal: false,
      selectedMessage: {},
      messagemodaltitle: "",
    };
  },
  mounted() {
    this.$nextTick(function () {
      window.ipcRenderer.receive("kafkamessagesresponse", (args) => {
        if (args.type === "auto") {
          this.data = args.data
            .filter((msg) => msg.type === "consume")
            .sort((a, b) => {
              return b.timestamp - a.timestamp;
            })
            .slice(0, 5);
          this.consumerStatus = "green";
        }
      });
      setInterval(
        function () {
          this.consumerStatus = "black";
        }.bind(this),
        5000
      );
    });
  },
  methods: {
    messagedetailsmodalclosed() {
      this.messagedetailsmodal = false;
    },
    messageselected(data) {
      this.messagedetailsmodal = true;
      this.selectedMessage = data;
      this.messagemodaltitle = data.topic;
    },
    formatMessage(msg) {
      return JSON.parse(msg);
    },
    isLatest(time) {
      return moment().diff(moment(time), "minutes") < 5;
    },
    moment,
    hndletopicaddition() {
      window.ipcRenderer.send("kafka", {
        command: "createtopic",
        payload: {
          name: this.topic,
          type: "consume",
          createincluseter: false,
        },
      });
    },
  },
  components: {
    MessageViewer,
  },
};
</script>
