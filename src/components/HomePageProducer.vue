<template>
  <!-- eslint-disable vue/no-deprecated-slot-attribute  -->
  <a-card size="small" title="Produce Message" style="height: 250px">
    <a-input
      placeholder="Topic"
      allow-clear
      slot="extra"
      style="width: 100px"
      size="small"
      v-model="topic"
    />
    <a-button
      style="margin-left: 8px"
      slot="extra"
      icon="plus"
      size="small"
      type="primary"
      @click="hndletopicaddition"
    />

    <a-select
      class="mr-3"
      slot="extra"
      size="small"
      label-in-value
      style="width: 90px; margin-left: 8px"
      @change="handletopicselection"
    >
      <a-select-option
        :value="option.name"
        v-for="(option, index) in topics"
        :key="index"
      >
        {{ option.name }}
      </a-select-option>
    </a-select>
    <a-tabs
      v-model="activeKey"
      hide-add
      type="editable-card"
      @edit="onEdit"
      size="small"
    >
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.key"
        :tab="pane.title"
        :closable="pane.closable"
      >
        <producer-tab-content :topic="pane.title" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import ProducerTabContent from "./ProducerTabContent.vue";
export default {
  data() {
    return {
      activeKey: 0,
      panes: [],
      newTabIndex: 0,
      topic: "",
      topics: [],
      addedPanes: [],
    };
  },
  methods: {
    onEdit() {},
    handletopicselection(val) {
      let paneName = val.key;
      // if(this.panes.find((item)=> item.title === val))
      if (this.addedPanes.indexOf(paneName) === -1) {
        this.addedPanes.push(paneName);
        this.panes.push({ title: paneName });
      }
    },
    hndletopicaddition() {
      if (this.addedPanes.indexOf(this.topic) === -1) {
        this.addedPanes.push(this.topic);
        this.panes.push({ title: this.topic });
      }
      window.ipcRenderer.send("kafka", {
        command: "createtopic",
        payload: {
          name: this.topic,
          type: "produce",
          createincluseter: false,
        },
      });
    },
  },
  components: {
    ProducerTabContent,
  },
  mounted() {
    this.$nextTick(function () {
      window.ipcRenderer.receive("kafkatopics", (args) => {
        if (args.type === "auto") {
          this.topics = args.data.filter(
            (msg) => msg.type === "produce" && msg.isActive
          );
        }
      });
    });
  },
};
</script>
