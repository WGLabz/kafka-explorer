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
              v-model="date"
              label="From"
              dense
              outlined
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog></v-col
      >
      <v-col>
        <v-dialog ref="dialog" v-model="modal" persistent width="290px">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="To"
              dense
              outlined
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col>
      <v-col>
        <v-btn outlined color="grey">
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
          :items="desserts"
          :items-per-page="8"
          class="elevation-1"
        ></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { Log } from "../../backend";
export default {
  data() {
    return {
      select: "Info",
      items: ["Info", "Warn", "Error"],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      headers: [
        {
          text: "Sl. No",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Date", value: "date" },
        { text: "Type", value: "type" },
        { text: "message", value: "message" },
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%",
        },
      ],
    };
  },
  mounted() {
    console.log(Log.get())
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
