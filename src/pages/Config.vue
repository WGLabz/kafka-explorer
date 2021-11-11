<template>
  <div>
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
          :rowKey="(record) => record._id"
        >
          <!-- <template v-slot:name="text, record">
            <editable-cell
              :text="text"
              @change="onCellChange(record.key, 'name', $event)"
            />
          </template> -->
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
      addnewtopicmodalvisibility: false,
      server: "",
      username: "",
      password: "",
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
      this.getConfigs();

      window.ipcRenderer.receive("confres", (args) => {
        if (args.type === "GET") {
          this.server = args.server;
          this.username = args.username;
          this.password = args.password;
        }
      });

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
};
</script>
