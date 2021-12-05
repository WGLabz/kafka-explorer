import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => {
    let validChannels = ["logGet", "logGetResponse", "kafka", "conf"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = [
      "logGet",
      "logGetResponse",
      "kafkaResponse",
      "userMessage",
      "confres",
      "clusterdata",
      "kafkamessagesresponse",
      "kafkatopics",
      "autologs",
      "dbsize",
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
