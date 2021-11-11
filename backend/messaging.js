import { webContents } from "electron";

const sendUserMessage = (type, message) => {
  webContents.getAllWebContents().map((content) => {
    content.send("userMessage", {
      type: type,
      message: message,
    });
  });
};

const sendCluseterDetails = (data) => {
  webContents.getAllWebContents().map((content) => {
    content.send("clusterdata", data);
  });
};

export { sendUserMessage, sendCluseterDetails };
