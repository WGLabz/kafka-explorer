/* eslint-disable vue/no-v-model-argument */
<template>
  <v-container>
    <v-row height="25vh">
      <v-col sm2>
        <v-select :items="items" label="log Level" dense outlined></v-select
      ></v-col>
      <v-col>
        <v-dialog ref="dialog" v-model="modal" persistent width="290px">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startDate"
              label="From"
              dense
              outlined
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="startDate" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(startDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog></v-col
      >
      <v-col>
        <v-dialog ref="dialog" v-model="modal" persistent width="290px">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endDate"
              label="To"
              dense
              outlined
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endDate" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(endDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col>
      <v-col>
        <v-btn outlined color="grey" @click="refresh">
          <v-icon>
            mdi-refresh
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row height="75vh">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="logs"
          :items-per-page="8"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { Log } from "../../backend";
import moment from "moment";
export default {
  data() {
    return {
      select: "Info",
      items: ["Info", "Warn", "Error"],
      startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      modal: false,
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "_id",
        },
        { text: "Date", value: "timestamp" },
        { text: "Type", value: "type" },
        { text: "message", value: "message" },
      ],
      logs: [],
    };
  },
  mounted() {
    this.loadLogs();
  },
  methods: {
    refresh() {
      this.loadLogs();
      console.log(this.startDate);
    },
    loadLogs() {
      Log.get({})
        .then((res) => {
          // let logs_ = [];
          res.docs.map((doc) => {
            doc.timestamp = moment(doc.timestamp).format("HH:mm DD/MM/YYYY");
          });
          this.logs = res.docs;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
::-webkit-scrollbar {
  display: none;
}
body {
  overflow-x: hidden;
}
</style>
