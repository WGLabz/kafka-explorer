import { webContents } from "electron";

const sendUserMessage = (type, message) => {
  webContents.getAllWebContents().map((content) => {
    content.send("userMessage", {
      type: type,
      message: message,
    });
  });
};

export { sendUserMessage };
