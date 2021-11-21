<template>
  <!-- eslint-disable vue/no-deprecated-slot-attribute  -->
  <div>
    <a-tabs default-active-key="1" size="small">
      <a-tab-pane key="1">
        <span slot="tab">
          <v-icon dense small>mdi-text</v-icon>
          Text
        </span>
        <a-textarea placeholder="Basic usage" :rows="4" :value="data.message">
        </a-textarea>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <v-icon dense small>mdi-code-json</v-icon>
          JSON
        </span>
        <json-viewer
          :value="JSON.parse(JSON.parse(data.message).value)"
        ></json-viewer>
      </a-tab-pane>
      <a-tab-pane key="3">
        <span slot="tab">
          <v-icon dense small>mdi-xml</v-icon>
          XML
        </span>
        Coming Soon....
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    data: {},
  },
};
</script>

// message: (...) // partition: (...) // publishstatus: (...) // timestamp:
(...) // topic: (...) // type: (...) // _id: (...)
