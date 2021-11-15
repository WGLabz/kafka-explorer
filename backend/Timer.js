import { initAdmin, getClusterInfo } from "./kafka/admin/admin";
import { kafka } from "./persistence/index";
import {
  sendCluseterDetails,
  sendKafkaMessages,
  sendKafkaTopics,
} from "./messaging";
import { log } from "./persistence";

const init = () => {
  initAdmin();
  setInterval(() => {
    try {
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
            brokers: [
              {
                host: "Not connected",
                nodeId: -1,
              },
            ],
            controller: -1,
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

      // Senda all kafka topics
      kafka.getTopics().then((res) => {
        sendKafkaTopics(res);
      });
    } catch (e) {
      log(`Error occured in timer!` + e, "ERROR");
    }
  }, 5000);
};

export { init };
