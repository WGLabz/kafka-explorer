<template>
  <!-- eslint-disable vue/no-deprecated-slot-attribute -->
  <!-- eslint-disable vue/no-v-model-argument  -->
  <div>
    <a-space>
      Message:
      <a-input
        placeholder="Message"
        allow-clear
        style="width: 100px"
        size="small"
        v-model:value="message"
        @change="handlemessagechange"
      />
      Key:
      <a-input
        placeholder="Key"
        allow-clear
        style="width: 100px"
        v-model:value="key"
        size="small"
      />
      Partition:
      <a-input-number
        :min="0"
        :max="100000"
        size="small"
        :default-value="0"
        v-model:value="partition"
        style="width: 60px"
      />
      <a-button
        style="margin-left: 8px"
        slot="extra"
        icon="arrow-up"
        size="small"
        type="primary"
        @click="sendMessage"
        :disabled="addButtonStatus"
      />
    </a-space>
    <br />
    <a-space class="mt-4" style="flex-wrap: wrap; display: flex">
      <a-tag v-if="publishedMessages.length === 0" color="yellow">
        No message published yet.
      </a-tag>
      <a-tag
        :color="isLatest(message.timestamp) ? 'green' : 'red'"
        v-for="(message, index) in publishedMessages"
        :key="index"
        class="mb-2"
      >
        {{ formatMessage(message.message).value.substring(0, 10) }}
        <small style="color: blue">
          {{ moment(message.timestamp).format("HH:mm DD/MM") }}
        </small>
      </a-tag>
    </a-space>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    topic: String,
  },
  data() {
    return {
      defaultPartition: "0",
      message: "",
      key: "",
      partition: 0,
      addButtonStatus: true,
      publishedMessages: [],
    };
  },
  methods: {
    handlemessagechange() {
      this.addButtonStatus = !(this.message && this.message !== "");
    },
    sendMessage() {
      window.ipcRenderer.send("kafka", {
        command: "message",
        payload: {
          topic: this.topic,
          key: this.key,
          value: this.message,
          partition: this.partition,
        },
      });
    },
    isLatest(time) {
      return moment().diff(moment(time), "minutes") < 5;
    },
    moment,
    formatMessage(msg) {
      return JSON.parse(msg);
    },
  },
  mounted() {
    this.$nextTick(function () {
      window.ipcRenderer.receive("kafkamessagesresponse", (args) => {
        if (args.type === "auto") {
          this.publishedMessages = args.data
            .filter((msg) => msg.type === "produce" && msg.topic === this.topic)
            .sort((a, b) => {
              return b.timestamp - a.timestamp;
            })
            .slice(0, 10);
          // console.log(this.publishedMessages);
        }
      });
    });
  },
};
</script>

<style></style>
