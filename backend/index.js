import { logs, log } from "./persistence";
const Log = {
  get: (query) => {
    return logs.getlogs(query);
  },
  log: (message, type) => {
    log(message, type);
  },
};

export { Log };
