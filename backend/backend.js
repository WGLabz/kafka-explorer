import { logs } from "../backend/persistence";
import {
  ConsumerInit,
  ConsumerClose,
  ProducerInit,
  ProducerClose,
  SendMessage,
  createTopic,
} from "./kafka";
const { ipcMain } = require("electron");

ipcMain.on("logGet", (event, arg) => {
  console.log(arg);
  logs
    .getlogs()
    .then((logs_) => {
      event.reply("logGetResponse", logs_);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on("kafka", (event,arg) => {
  console.log('Kafka',arg);
  var command = arg.command;
  switch (command) {
    case "init":
      ConsumerInit();
      ProducerInit();
      break;
    case "close":
      ConsumerClose();
      ProducerClose();
      break;
    case "message":
      var payload = arg.payload;
      SendMessage(payload.topic, payload.key, payload.value, payload.partition);
      break;

    case "createtopic":
      var payload_ = arg.payload;
      createTopic(payload_.topic);
      break;
  }
});
