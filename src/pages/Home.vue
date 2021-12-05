<template>
  <!-- eslint-disable vue/no-deprecated-slot-scope-attribute -->
  <!-- eslint-disable vue/no-deprecated-slot-attribute  -->
  <div class="mt-4">
    <a-row type="flex" :gutter="[4, 4]">
      <a-col :span="16" :order="1">
        <home-page-producer />
      </a-col>
      <a-col :span="8" :order="2">
        <home-page-consumer />
      </a-col>
    </a-row>
    <a-row type="flex" class="mt-2" :gutter="[4, 4]">
      <a-col :span="14" :order="3">
        <a-card title="Logs" size="small">
          <a-list size="small" :data-source="logs">
            <a-list-item slot="renderItem" slot-scope="item">
              <small> {{ item.message.substring(0,70) }}</small>
              <a-tag
                size="small"
                :color="
                  item.type === 'ERROR'
                    ? 'red'
                    : item.type === 'WARN'
                    ? 'yellow'
                    : 'green'
                "
              >
                <small>{{ moment(item.timestamp).format("HH:mm:ss") }} </small>
              </a-tag>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="10" :order="4">
        <a-card title="Cluster Information" size="small">
          <a-list size="small" :data-source="clusterInfo.brokers">
            <a-list-item slot="renderItem" slot-scope="item">
              <small> {{ item.host }}</small>
              <a-tag color="green">
                <small>{{ item.port }} </small>
              </a-tag>
              <a-tag color="purple">
                <small>{{ item.nodeId }} </small>
              </a-tag>
              <a-tag color="pink" v-if="item.isController"> C </a-tag>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import moment from "moment";
import HomePageConsumer from "../components/HomePageConsumer.vue";
import HomePageProducer from "../components/HomePageProducer.vue";
export default {
  data() {
    return {
      clusterInfo: {},
      logs: [],
    };
  },
  components: {
    HomePageConsumer,
    HomePageProducer,
  },
  mounted() {
    this.$nextTick(function () {
      window.ipcRenderer.receive("autologs", (args) => {
        this.logs = args;
      });
      window.ipcRenderer.receive("clusterdata", (args) => {
        args.brokers.map((broker) => {
          broker.isController = broker.nodeId === args.controller;
        });
        this.clusterInfo = args;
      });
    });
  },
  methods: {
    moment,
  },
};
</script>
