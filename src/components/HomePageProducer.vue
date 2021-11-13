<template>
  <!-- eslint-disable vue/no-deprecated-slot-attribute  -->
  <a-card size="small" title="Produce Message">
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
    />

    <a-button style="margin-left: 8px" slot="extra" type="dashed" size="small">
      Topics <a-icon type="down" />
    </a-button>
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
        {{ pane.content }}
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
export default {
  data() {
    const panes = [
      { title: "Tab 1", content: "Content of Tab 1", key: "1" },
      { title: "Tab 2", content: "Content of Tab 2", key: "2" },
    ];
    return {
      activeKey: panes[0].key,
      panes,
      newTabIndex: 0,
      topic: "",
    };
  },
  methods: {
    onEdit() {},
  },
};
</script>
