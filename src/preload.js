import { contextBridge, ipcRenderer } from "electron";

// Expose ipcRenderer to the client
// window.ipcRenderer = require('electron').ipcRenderer;
contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => {
    let validChannels = ["logGet", "logGetResponse"]; // <-- Array of all ipcRenderer Channels used in the client
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["logGet", "logGetResponse"]; // <-- Array of all ipcMain Channels used in the electron
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
// require("../backend/backend.js");
// alert("It Worked!"); // Remove this line once you confirm it worked
