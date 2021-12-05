import { initAdmin, getClusterInfo } from "../kafka/admin/admin";
import { kafka, logs, log } from "../persistence/index";
import { dirsizeSync } from "./DBSize";
import {
  sendCluseterDetails,
  sendKafkaMessages,
  sendKafkaTopics,
  sendLogs,
  sendDbSize,
} from "./messaging";

const init = () => {
  initAdmin();
  setInterval(() => {
    try {
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

      // send logs latest
      logs.getLatestLogs(6).then((res) => {
        sendLogs(res);
      });
    } catch (e) {
      log(`Error occured in timer!` + e, "ERROR");
    }
  }, 5000);
  setInterval(() => {
    try {
      var dbSize = dirsizeSync("kafka_explorer");
      sendDbSize(dbSize);
      
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
    } catch (e) {
      log(`Error occured in timer!` + e, "ERROR");
    }
  }, 30000);
};

export { init };
