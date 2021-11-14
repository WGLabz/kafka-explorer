<template>
  <!-- eslint-disable vue/no-deprecated-slot-attribute  -->
  <a-card size="small" title="Consumed" style="height: 250px">
    <a-badge slot="extra" :color="consumerStatus"></a-badge>
    <a-input
      placeholder="Topic"
      allow-clear
      slot="extra"
      style="width: 80px"
      size="small"
      v-model="topic"
    />
    <a-button
      style="margin-left: 8px"
      slot="extra"
      icon="plus"
      size="small"
      type="primary"
    />
    <p v-for="(data_, index) in data" :key="index">
      <a-tag>{{ data_.topic }}</a-tag>
      <a-icon type="caret-right" />
      <a-tag :color="isLatest(data_.timestamp) ? 'green' : 'red'">
        {{ formatMessage(data_.message).value.substring(0, 20) }}
        <small style="color: brown">
          {{ moment(data_.timestamp).format("HH:mm:ss") }}
        </small>
      </a-tag>
    </p>
  </a-card>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      consumerStatus: "red",
      data: [],
      topic: "",
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
    formatMessage(msg) {
      return JSON.parse(msg);
    },
    isLatest(time) {
      return moment().diff(moment(time), "minutes") < 5;
    },
    moment,
  },
};
</script>
