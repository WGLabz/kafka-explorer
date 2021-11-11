import { initAdmin, getClusterInfo } from "./kafka/admin/admin";
import { sendCluseterDetails } from "./messaging";
import { log } from "./persistence";

const init = () => {
  initAdmin();
  setInterval(() => {
    getClusterInfo()
      .then((res) => {
        console.log("Sending cluster info.")
        res.timestamp = new Date();
        res.status = true;
        sendCluseterDetails(res);
      })
      .catch(() => {
        console.log("Error ffetching cluster info.")
        sendCluseterDetails({
          timestamp: new Date(),
          status: false,
        });
        log(`Failed to fetch cluster data`, "ERROR");
      });
  }, 60000);
};

export { init };
