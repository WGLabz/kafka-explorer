import { logs } from "./persistence";

console.log("Backend Triggered!");

const { ipcMain } = require("electron");

ipcMain.on("logGet", (event, arg) => {
  console.log(arg);
  let logs_ = logs.getlogs();
  console.log(logs_);
  //   event.reply("logGetResponse", logs_);
});
