import { logs } from "./persistence";
const Log = {
  get: (query) => {
    return logs.getlogs(query);
  },
};

export { Log };
