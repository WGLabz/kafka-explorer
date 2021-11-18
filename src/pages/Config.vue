<template>
  <div class="mt-4">
    <a-row :gutter="16">
      <a-col :span="7">
        <a-input
          placeholder="Bootstrap Server(s)"
          allow-clear
          size="small"
          v-model="server"
        />
      </a-col>
      <a-col :span="5">
        <a-input
          placeholder="Username"
          allow-clear
          v-model="username"
          size="small"
        />
      </a-col>
      <a-col :span="5">
        <a-input
          placeholder="Password"
          allow-clear
          v-model="password"
          size="small"
        />
      </a-col>
      <a-col :span="5">
        <a-button type="primary" @click="saveServerInfo" size="small">
          <a-icon type="check" style="color: white" />
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      server: "",
      username: "",
      password: "",
    };
  },

  methods: {
    getConfigs() {
      window.ipcRenderer.send("conf", {
        command: "GET",
      });
    },
    moment,
    saveServerInfo() {
      window.ipcRenderer.send("conf", {
        command: "SET",
        server: this.server,
        usernme: this.username || "",
        password: this.password || "",
      });
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.getConfigs();
      window.ipcRenderer.receive("confres", (args) => {
        if (args.type === "GET") {
          this.server = args.server;
          this.username = args.username;
          this.password = args.password;
        }
      });
    });
  },
};
</script>
