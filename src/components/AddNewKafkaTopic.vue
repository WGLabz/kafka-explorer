<template>
  <a-row :gutter="16">
    <a-col :span="14">
      <a-input placeholder="New Topic" allow-clear v-model="topic" />
    </a-col>
    <a-col :span="5">
      <a-select
        label-in-value
        :default-value="{ key: topicdefaultval }"
        @change="handletopicselectionchange"
      >
        <a-select-option
          :value="option"
          v-for="(option, index) in topictypeoptions"
          :key="index"
        >
          {{ option }}
        </a-select-option>
      </a-select></a-col
    >
    <a-col :span="5">
      <a-button type="primary" @click="savetopic">
        <a-icon type="check" style="color: white" />
      </a-button>
    </a-col>
  </a-row>
</template>
<script>
export default {
  data() {
    return {
      topic: "",
      topictype: "",
      topicdefaultval: "Consume",
      topictypeoptions: ["Consume", "Produce"],
    };
  },
  methods: {
    handletopicselectionchange(val) {
      this.topictype = val;
    },
    savetopic() {
      window.ipcRenderer.send("kafka", {
        command: "createtopic",
        payload: { name: this.topic, type: this.topictype },
      });
    },
  },
};
</script>
