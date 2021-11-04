import { logs, initDB } from "./persistence";
const Log = {
  get: async (query) => {
    await initDB();
    return logs.getlogs(query);
  },
};

export { Log };
