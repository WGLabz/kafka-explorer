<template>
  <a-table
    bordered
    :data-source="kafkatopics"
    :columns="columns"
    height="600px"
    size="small"
    :pagination="paginationSettings"
    :rowKey="(record) => record.name"
  >
    <template v-slot:operation="text, record">
      <a-popconfirm
        v-if="kafkatopics.length"
        title="Sure to delete?"
        @confirm="() => onDelete(record.name)"
      >
        <a-button style="color: red" size="small" icon="delete" />
      </a-popconfirm>
    </template>
  </a-table>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      paginationSettings: {
        size: "small",
        pageSize: 5,
      },
      kafkatopics: [],
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          width: "25%",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "Partition ID",
          dataIndex: "partitionId",
          align: "center",
        },
        {
          title: "Leader",
          dataIndex: "leader",
          align: "center",
        },
        {
          title: "Partition Error Code",
          dataIndex: "partitionErrorCode",
          align: "center",
        },
        {
          title: "",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          align: "center",
        },
      ],
    };
  },

  methods: {
    getMeta() {
      window.ipcRenderer.send("kafka", {
        command: "gettopicsmeta",
      });
    },
    moment,
    onDelete(key) {
      window.ipcRenderer.send("kafka", {
        command: "removetopicfromcluster",
        topic: key,
      });
      // console.log(key);
      this.getMeta();
    },
  },
  mounted() {
    this.getMeta();
    this.$nextTick(function () {
      window.ipcRenderer.receive("kafkaResponse", (args) => {
        if (args.type === "meta") {
          let topics_ = args.meta.topics.filter(
            (topic) => topic.name !== "__consumer_offsets"
          );
          //   topics_;
          topics_.map((topic) => {
            let leaders = [];
            let partitionIds = [];
            let partitionErrorCodes = [];
            topic.leader = topic.partitions.map((partition) => {
              leaders.push(partition.leader);
              partitionIds.push(partition.partitionId);
              partitionErrorCodes.push(partition.partitionErrorCode);
            });
            topic.leader = leaders.join(", ");
            topic.partitionId = partitionIds.join(", ");
            topic.partitionErrorCode = partitionErrorCodes.join(", ");
          });
          // console.log(topics_);
          this.kafkatopics = topics_;
        }
      });
    });
  },
};
</script>
