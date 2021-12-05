const { Kafka } = require("kafkajs");
import { config } from "../persistence";
import { CustomLogCreator } from "../CustomLogger";

const kafkaInit = () => {
  global.kafka = null;
  let username, password, brokers, sasl, ssl;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (global.kafka === null) reject(new Error("Failed to connect!"));
      else resolve("Connected!");
    }, 15000);
    global.kafka = new Kafka({
      clientId: "a-random-client-id",
      brokers: async () => {
        username = await config.readConfig("KAFKA_USERNAME");
        password = await config.readConfig("KAFKA_PASSWORD");
        brokers = await config.readConfig("KAFKA_BOOTSTRAP_SERVER");
        sasl =
          username && password
            ? { username, password, mechanism: "plain" }
            : null;
        ssl = !!sasl;
        brokers = brokers.split(",");
        return brokers;
      },
      ssl,
      sasl,
      requestTimeout: 25000,
      logCreator: CustomLogCreator,
    });
  });
};

export { kafkaInit };
