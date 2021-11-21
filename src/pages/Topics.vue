<template>
  <div>
    <a-row>
      <a-col span="12">
        <a-space size="small">
          <a-button type="primary" @click="handleAdd" icon="plus">
            Add
          </a-button>
          <a-button @click="handleClusterTopicModal" type="primary">
            Topics in Cluster
          </a-button>
        </a-space>
      </a-col>
      <a-col>
        <a-button
          class="float-right"
          icon="reload"
          @click="getTopics"
          type="secondary"
        >
          Refresh
        </a-button>
      </a-col>
    </a-row>

    <a-row class="pt-0 mt-0">
      <a-col>
        <a-table
          bordered
          :data-source="kafkatopics"
          :columns="columns"
          height="600px"
          size="small"
          :pagination="paginationSettings"
          :rowKey="(record) => record._id"
        >
          <template v-slot:operation="text, record">
            <a-popconfirm
              v-if="record.isActive"
              title="Sure to disable?"
              @confirm="() => onDisable(record._id)"
              style="margin: 5px"
            >
              <a-button type="warning" icon="stop" size="small" />
            </a-popconfirm>
            <a-popconfirm
              v-else
              title="Sure to enable?"
              @confirm="() => onEnable(record._id)"
              style="margin: 5px"
            >
              <a-button type="success" size="small" icon="caret-right" />
            </a-popconfirm>
            <a-popconfirm
              v-if="kafkatopics.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record._id)"
            >
              <a-button type="danger" size="small" icon="delete" />
            </a-popconfirm>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-modal
      v-model="addnewtopicmodalvisibility"
      title="Add new topic"
      @ok="getTopics"
      @cancel="getTopics"
    >
      <add-new-kafka-topic />
    </a-modal>
    <a-modal
      v-model="clustertopicsmodalvisibility"
      title="Topics Available in Cluster"
      @ok="getTopics"
      :width="700"
      centered
      @cancel="getTopics"
      :footer="false"
    >
      <cluster-topics />
    </a-modal>
  </div>
</template>
<script>
import moment from "moment";
import AddNewKafkaTopic from "../components/AddNewKafkaTopic";
import ClusterTopics from "../components/ClusterTopics.vue";
export default {
  components: { AddNewKafkaTopic, ClusterTopics },
  data() {
    return {
      paginationSettings: {
        size: "small",
        pageSize: 7,
        position: "top",
      },
      clustertopicsmodalvisibility: false,
      addnewtopicmodalvisibility: false,
      kafkatopics: [],
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          width: "15%",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "State",
          dataIndex: "isActive",
          customRender: (text) => {
            return text ? (
              <a-icon type="check-circle" style="color:green" />
            ) : (
              <a-icon type="close-circle" style="color:red" />
            );
          },
        },
        {
          title: "Type",
          dataIndex: "type",
          customRender: (text) => {
            return text === "consume" ? (
              <div>
                <a-icon type="arrow-down" />
              </div>
            ) : (
              <div>
                <a-icon type="arrow-up" />
              </div>
            );
          },
        },
        {
          title: "Created",
          dataIndex: "created",
          customRender: (text) => {
            return moment(text).format("DD/MM/YYYY HH:mm");
          },
        },
        {
          title: "Last Edit",
          dataIndex: "lastedit",
          customRender: (text) => {
            return moment(text).format("DD/MM/YYYY HH:mm");
          },
        },
        {
          title: "",
          dataIndex: "operation",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(function () {
      this.getTopics();

      window.ipcRenderer.receive("kafkaResponse", (args) => {
        if (args.type === "topics") this.kafkatopics = args.topics;
      });
    });
  },
  methods: {
    handleAdd() {
      this.addnewtopicmodalvisibility = true;
    },
    handleClusterTopicModal() {
      this.clustertopicsmodalvisibility = true;
    },
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    onDelete(key) {
      window.ipcRenderer.send("kafka", {
        command: "removetopic",
        id: key,
      });
      this.getTopics();
    },

    onDisable(key) {
      window.ipcRenderer.send("kafka", {
        command: "disabletopic",
        id: key,
      });
      this.getTopics();
    },
    onEnable(key) {
      window.ipcRenderer.send("kafka", {
        command: "enabletopic",
        id: key,
      });
      this.getTopics();
    },
    getTopics() {
      window.ipcRenderer.send("kafka", {
        command: "gettopics",
      });
      this.addnewtopicmodalvisibility = false;
      this.clustertopicsmodalvisibility = false;
    },
    moment,
  },
};
</script>
