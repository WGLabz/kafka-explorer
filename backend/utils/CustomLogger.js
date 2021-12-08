const { logLevel } = require("kafkajs");
import { log as log_} from "../persistence/index";
const toCustomLogLevel = (level) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return "ERROR";
    case logLevel.WARN:
      return "WARN";
    case logLevel.INFO:
      return "INFO";
    case logLevel.DEBUG:
      return "DEBUG";
  }
};

const CustomLogCreator = () => {
  return ({ level, log }) => {
    const { message } = log;
    log_(message, toCustomLogLevel(level));
  };
};

export { CustomLogCreator };
