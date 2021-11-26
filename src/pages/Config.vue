<template>
  <!-- eslint-disable vue/no-deprecated-slot-attribute -->
  <div>
    <a-row type="flex" :gutter="[8, 8]">
      <a-col :span="6" :order="1">
        <a-card title="Cluster Config" size="small">
          <a-space direction="vertical">
            <a-input
              placeholder="Bootstrap Server(s)"
              allow-clear
              size="small"
              v-model="server"
            />
            <a-input
              placeholder="Username"
              allow-clear
              v-model="username"
              size="small"
            />
            <a-input
              placeholder="Password"
              allow-clear
              v-model="password"
              size="small"
            />
          </a-space>

          <a-button
            type="primary"
            @click="saveServerInfo"
            size="small"
            slot="extra"
            icon="check"
          >
          </a-button>
        </a-card>
      </a-col>
      <a-col :span="6" :order="2">
        <a-card title="Topic Config" size="small">
          <a-space direction="vertical">
            <a-input
              placeholder="Consumer Group"
              allow-clear
              size="small"
              v-model="consumergrp"
            />
          </a-space>

          <a-button
            slot="extra"
            type="primary"
            @click="saveconsumergrp"
            size="small"
            icon="check"
          >
          </a-button>
        </a-card>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col :span="12" :order="4"></a-col>
      <a-col :span="12" :order="3"></a-col>
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
      consumergrp: "",
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
    saveconsumergrp() {
      window.ipcRenderer.send("conf", {
        command: "SET_CONS_GRP",
        val: this.consumergrp,
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
          this.consumergrp = args.consgrp
        }
      });
    });
  },
};
</script>
