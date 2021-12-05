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

  //   const logger = winston.createLogger({
  //     level: toCustomLogLevel(logLevel),
  //     transports: [
  //         new winston.transports.Console(),
  //         new winston.transports.File({ filename: 'myapp.log' })
  //     ]
  // })

  // return ({ namespace, level, label, log }) => {
  //     const { message, ...extra } = log
  //     logger.log({
  //         level: toCustomLogLevel(level),
  //         message,
  //         extra,
  //     })
  // }
};

export { CustomLogCreator };
