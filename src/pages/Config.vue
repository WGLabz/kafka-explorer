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
    <a-row :gutter="16">
      <a-col>
        <a-button class="editable-add-btn mt-5 mb-5"> Add </a-button>
        <a-table
          bordered
          :data-source="kafkatopics"
          :columns="columns"
          height="600px"
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
              v-if="kafkatopics.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record._id)"
            >
              <a-button><a-icon type="stop" /></a-button>
            </a-popconfirm>
            <a-popconfirm
              v-if="kafkatopics.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record._id)"
            >
              <a-button><a-icon type="delete" /></a-button>
            </a-popconfirm>
          </template>
        </a-table>
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
          dataIndex: "state",
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
                <a-icon type="arrow-down" /> Consume
              </div>
            ) : (
              <div>
                <a-icon type="arrow-up" />
                Produce
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
        console.log(args);
        if (args.type === "topics") this.kafkatopics = args.topics;
      });
    });
  },
  methods: {
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    onDelete(key) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter((item) => item.key !== key);
    },
    getTopics() {
      window.ipcRenderer.send("kafka", {
        command: "gettopics",
      });
    },
    getConfigs() {
      window.ipcRenderer.send("conf", {
        command: "GET",
      });
    },
    moment,
    saveServerInfo() {
      console.log("Saving!!");
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
