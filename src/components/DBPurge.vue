<template>
  <div>
    <a-space :size="small">
      <a-checkbox :checked="appconfig" @change="appconfigCheckChanged">
        App config
      </a-checkbox>
      <a-checkbox :checked="logs" @change="logsCheckChnaged"> Logs </a-checkbox>
      <a-checkbox :checked="messages" @change="messagesCheckChnaged">
        Messages
      </a-checkbox>
      <a-checkbox :checked="topics" @change="topicsCheckChnaged">
        Topics
      </a-checkbox>
    </a-space>
    <br />
    <br />
    <a-space :size="small" direction="vertical">
      <a-button type="danger" icon="delete" size="small" @click="purgedb">
        Purge
      </a-button>
    </a-space>
  </div>
</template>
<script>
export default {
  data() {
    return {
      appconfig: false,
      logs: true,
      messages: true,
      topics: false,
    };
  },
  methods: {
    topicsCheckChnaged(e) {
      this.topics = e.target.checked;
    },
    messagesCheckChnaged(e) {
      this.messages = e.target.checked;
    },
    logsCheckChnaged(e) {
      this.logs = e.target.checked;
    },
    appconfigCheckChanged(e) {
      this.appconfig = e.target.checked;
    },
    purgedb() {
      window.ipcRenderer.send("conf", {
        command: "PURGE_DATABASE",
        CONFIG: this.appconfig,
        LOGS: this.logs,
        MESSAGES: this.messages,
        TOPICS: this.topics,
      });
    },
  },
};
</script>
