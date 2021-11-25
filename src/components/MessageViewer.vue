<template>
  <!-- eslint-disable vue/no-deprecated-slot-attribute  -->
  <div>
    KEY:
    <a-tag style="margin-bottom: 10px" color="purple" small>
      {{ JSON.parse(data.message).key || "No Key" }}
    </a-tag>
    Headers:
    <a-tag style="margin-bottom: 10px" color="pink" small>
      {{ JSON.parse(data.message).headers || "No Headers" }}
    </a-tag>
    <a-tabs
      default-active-key="1"
      :active-key="activeKey"
      size="small"
      @change="handleChange"
    >
      <a-tab-pane key="1">
        <small slot="tab">
          <v-icon dense style="margin-bottom: 2px; height: 5px"
            >mdi-text</v-icon
          >
          Text
        </small>
        <a-textarea
          placeholder="Basic usage"
          :rows="4"
          :value="TEXT_VAL"
          disabled
        >
        </a-textarea>
      </a-tab-pane>
      <a-tab-pane key="2" :disabled="jsonpane">
        <small slot="tab">
          <v-icon dense style="margin-bottom: 2px">mdi-code-json</v-icon>
          JSON
        </small>
        <json-viewer :value="jsoncontent"></json-viewer>
      </a-tab-pane>
      <a-tab-pane key="3" :disabled="xmlpane">
        <small slot="tab">
          <v-icon dense style="margin-bottom: 2px">mdi-xml</v-icon>
          XML
        </small>
        <ssh-pre language="html">
          {{ XML_VAL }}
        </ssh-pre>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import pd from "pretty-data";
const { XMLValidator } = require("../../node_modules/fast-xml-parser/src/fxp");
import SshPre from "simple-syntax-highlighter";
import "simple-syntax-highlighter/dist/sshpre.css";
export default {
  components: { SshPre },
  props: {
    data: {},
  },
  data() {
    return {
      xmlpane: true,
      jsonpane: true,
      TEXT_VAL: "",
      jsoncontent: Object,
      XML_VAL: "",
      activeKey: "1",
    };
  },
  methods: {
    handleChange(key) {
      this.activeKey = key;
    },
    processContent(val) {
      var message = JSON.parse(val.message).value;
      this.TEXT_VAL = message;
      try {
        this.jsoncontent = JSON.parse(message);
        this.jsonpane = false;
      } catch (e) {
        this.jsonpane = true;
      }

      this.xmlpane = !!XMLValidator.validate(message, {
        allowBooleanAttributes: true,
      }).err;

      if (!this.xmlpane) {
        this.XML_VAL = pd.pd.xml(message);
      } else {
        this.XML_VAL = "";
      }
    },
  },
  mounted() {
    this.processContent(this.data);
  },
  watch: {
    data: function (val) {
      this.activeKey = "1";
      this.processContent(val);
    },
  },
};
</script>
