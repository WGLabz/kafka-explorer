<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="7">
        <a-input
          placeholder="Bootstrap Server(s)"
          allow-clear
          v-model="server"
        />
      </a-col>
      <a-col :span="5">
        <a-input placeholder="Username" allow-clear v-model="username" />
      </a-col>
      <a-col :span="5">
        <a-input placeholder="Password" allow-clear v-model="password" />
      </a-col>
      <a-col :span="5">
        <a-button type="primary" @click="saveServerInfo">
          <v-icon dark> mdi-save </v-icon>
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      server: "",
      username: "",
      password: "",
    };
  },
  mounted() {
    this.getConfigs();
    this.$nextTick(function () {
      window.ipcRenderer.receive("confres", (args) => {
        // if (args.type === "GET") {
        this.server = args.server;
        this.username = args.username;
        this.password = args.password;
        // }
        console.log(args);
      });
    });
  },
  methods: {
    success() {},
    getConfigs() {
      window.ipcRenderer.send("conf", {
        command: "GET",
      });
    },
    saveServerInfo() {
      console.log("Saving!!");
      window.ipcRenderer.send("conf", {
        command: "SET",
      });
      this.getConfigs();
    },
  },
};
</script>
