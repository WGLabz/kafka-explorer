import { logs } from "../backend/persistence";

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
