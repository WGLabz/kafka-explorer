<template>
  <!-- eslint-disable vue/no-deprecated-slot-attribute  -->
  <a-card size="small" title="Produce Message" style="height: 240px">
    <a-input
      placeholder="Topic"
      allow-clear
      slot="extra"
      style="width: 100px"
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
      v-if="panes.length > 0"
    >
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.key"
        :tab="pane.title"
        :closable="true"
      >
        <producer-tab-content :topic="pane.title" />
      </a-tab-pane>
    </a-tabs>
    <div v-if="panes.length === 0" style="width: 100%; text-align: center">
      <a-icon type="info-circle" style="color: #0ca6f5; fontsize: 20px" />
      <br />
      <small>
        Please select a topic from the dropdown above or add a topic above to
        publish message.
      </small>
    </div>
  </a-card>
</template>

<script>
import ProducerTabContent from "./ProducerTabContent.vue";
export default {
  data() {
    return {
      activeKey: "1TAB",
      panes: [],
      newTabIndex: 0,
      topic: "",
      topics: [],
      addedPanes: [],
      keyIndex: 0,
    };
  },
  methods: {
    onEdit(targetKey, action) {
      if (action === "remove") {
        let toRemovePanName = this.panes.find(
          (pane) => pane.key === targetKey
        ).title;
        this.panes = this.panes.filter((pane) => pane.key !== targetKey);
        this.addedPanes = this.addedPanes.filter(
          (paneName) => paneName !== toRemovePanName
        );
      }
    },
    handletopicselection(val) {
      let paneName = val.key;
      // if(this.panes.find((item)=> item.title === val))
      if (this.addedPanes.indexOf(paneName) === -1) {
        this.keyIndex = this.keyIndex + 1;
        this.addedPanes.push(paneName);
        this.panes.push({ title: paneName, key: `${this.keyIndex}TAB` });
        this.activeKey = `${this.keyIndex}TAB`;
      }
    },
    hndletopicaddition() {
      if (this.addedPanes.indexOf(this.topic) === -1) {
        if (this.topic === "") {
          this.$message.error("Topic name can't be empty", 4);
          return;
        }

        this.keyIndex = this.keyIndex + 1;
        this.addedPanes.push(this.topic);
        this.panes.push({ title: this.topic, key: `${this.keyIndex}TAB` });
        this.activeKey = `${this.keyIndex}TAB`;
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
