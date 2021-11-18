<template>
  <div class="mt-4">
    <a-row :gutter="16">
      <a-col>
        <a-button
          class="editable-add-btn mt-5 mb-5"
          @click="handleAdd"
          icon="plus"
          size="small"
        >
        </a-button>
        <a-button
          class="editable-add-btn mt-5 mb-5 ml-2"
          icon="reload"
          @click="getTopics"
          size="small"
        >
        </a-button>
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
              <a-button style="color: yellow" icon="stop" size="small" />
            </a-popconfirm>
            <a-popconfirm
              v-else
              title="Sure to enable?"
              @confirm="() => onEnable(record._id)"
              style="margin: 5px"
            >
              <a-button style="color: green" size="small" icon="caret-right" />
            </a-popconfirm>
            <a-popconfirm
              v-if="kafkatopics.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record._id)"
            >
              <a-button style="color: red" size="small" icon="delete" />
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
  </div>
</template>
<script>
import moment from "moment";
import AddNewKafkaTopic from "../components/AddNewKafkaTopic";
export default {
  components: { AddNewKafkaTopic },
  data() {
    return {
      paginationSettings: {
        size: "small",
        pageSize: 6,
      },
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
    },
    moment,
  },
};
</script>
