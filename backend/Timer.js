import { initAdmin, getClusterInfo } from "./kafka/admin/admin";
const init = () => {
  initAdmin();
  setInterval(() => {
    console.log("Hello");
    getClusterInfo().then((res) => {
      console.log(res);
    });
  }, 60000);
};

export { init };
