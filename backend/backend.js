import { logs } from "./persistence";
import {
  ConsumerInit,
  ConsumerClose,
  ProducerInit,
  ProducerClose,
  SendMessage,
  createTopic,
} from "./kafka";
import { config } from "./persistence";
import { ipcMain, webContents } from "electron";

ipcMain.on("logGet", (event, arg) => {
  logs
    .getlogs(arg)
    .then((logs_) => {
      event.reply("logGetResponse", logs_);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on("kafka", (event, arg) => {
  console.log("Kafka", arg);
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
ipcMain.on("conf", async (event, arg) => {
  var command = arg.command;
  if (command === "GET") {
    event.reply("confres", {
      type: "GET",
      server: await config.readConfig("KAFKA_BOOTSTRAP_SERVER"),
      username: await config.readConfig("KAFKA_USERNAME"),
      password: await config.readConfig("KAFKA_PASSWORD"),
    });
  }
  if (command === "SET") {
    try {
      await config.updateConfig("KAFKA_USERNAME", arg.username);
      await config.updateConfig("KAFKA_PASSWORD", arg.password);
      await config.updateConfig("KAFKA_BOOTSTRAP_SERVER", arg.server);
      webContents.getAllWebContents().map((content) => {
        content.send("userMessage", {
          type: "INFO",
          message: `Server config updated sucessfully!`,
        });
      });
    } catch (e) {
      webContents.getAllWebContents().map((content) => {
        content.send("userMessage", {
          type: "ERROR",
          message: `Server config update failed!`,
        });
      });
    }
  }
});
