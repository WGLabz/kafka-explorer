import { initAdmin, getClusterInfo } from "./kafka/admin/admin";
import { kafka } from "./persistence/index";
import { sendCluseterDetails, sendKafkaMessages } from "./messaging";

const init = () => {
  initAdmin();
  setInterval(() => {
    // Send Cluster Info
    getClusterInfo()
      .then((res) => {
        res.timestamp = new Date();
        res.status = true;
        sendCluseterDetails(res);
      })
      .catch(() => {
        sendCluseterDetails({
          timestamp: new Date(),
          status: false,
        });
      });
    // Send latest messages
    kafka
      .getMessages({
        start: new Date(new Date() - 24 * 1000 * 60 * 60),
        end: new Date(),
      })
      .then((res) => {
        sendKafkaMessages(res);
      });
  }, 30000);
};

export { init };
