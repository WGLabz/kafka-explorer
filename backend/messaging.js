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

const sendKafkaMessages = (data) => {
  let data_ = {};
  data_.type = "auto";
  data_.data = data;
  webContents.getAllWebContents().map((content) => {
    content.send("kafkamessagesresponse", data_);
  });
};

const sendKafkaTopics = (data) => {
  let data_ = {};
  data_.type = "auto";
  data_.data = data;
  webContents.getAllWebContents().map((content) => {
    content.send("kafkatopics", data_);
  });
};

export {
  sendUserMessage,
  sendCluseterDetails,
  sendKafkaMessages,
  sendKafkaTopics,
};
