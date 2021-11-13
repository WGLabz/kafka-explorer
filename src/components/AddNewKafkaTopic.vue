<template>
  <div>
    <a-space>
      Topic:
      <a-input
        placeholder="New Topic"
        allow-clear
        v-model="topic"
        size="small"
      />
      Type:
      <a-select
        size="small"
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
      </a-select>
      <a-button size="small" type="primary" @click="savetopic" icon="check" />
    </a-space>
    <br />
    <a-space>
      <a-checkbox style="margin-top: 10px" :checked="createincluseter">
        Add topic to the cluster
      </a-checkbox>
    </a-space>
  </div>
</template>
<script>
export default {
  data() {
    return {
      topic: "",
      topictype: "",
      topicdefaultval: "Consume",
      topictypeoptions: ["Consume", "Produce"],
      createincluseter: false,
    };
  },
  methods: {
    handletopicselectionchange(val) {
      this.topictype = val;
    },
    savetopic() {
      window.ipcRenderer.send("kafka", {
        command: "createtopic",
        payload: {
          name: this.topic,
          type: this.topictype,
          createincluseter: this.createincluseter,
        },
      });
    },
  },
};
</script>
