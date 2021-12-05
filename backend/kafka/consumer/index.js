import { log, kafka as kakfkadetails, config } from "../../persistence";
import { sendUserMessage } from "../../utils/messaging";

const init = async () => {
  // Create a Kafka consumer.
  var consumerGroup = await config.readConfig("KAFKA_CONSUMER_GROUP");
  console.log("consumerGroup", consumerGroup);
  global.consumer = global.kafka.consumer({
    groupId:
      consumerGroup && consumerGroup !== "" ? consumerGroup : "KAFKA_EXPLORER",
  });

  const topics = await kakfkadetails.getKafkaTopicsToConsume();

  // Connect
  await global.consumer.connect();

  // Subscribe to Kafka topic
  topics.map(async (topic) => {
    if (topic.isActive) {
      // console.log(`Subscribing to topic ${topic.name}`, "INFO");
      log(`Subscribing to topic ${topic.name}`, "INFO");
      try {
        await global.consumer.subscribe({
          topic: topic.name,
          fromBeginning: false,
        });
      } catch (e) {
        sendUserMessage(
          "ERROR",
          `Failed to subscribe to topic : ${topic.name}`
        );
      }
    }
  });

  // Listen to incoming messages
  await global.consumer.run({
    eachMessage: ({ topic, partition, message }) => {
      var msg = {
        key: message.key ? message.key.toString() : "",
        value: message.value ? message.value.toString() : "",
        headers: message.headers ? message.headers : "",
      };
      // console.log(JSON.stringify(msg));
      kakfkadetails
        .addMessage(JSON.stringify(msg), topic, "consume", partition, true)
        .catch(async (error) => {
          log(
            `Failed to store incoming message ${topic} Error: ${error}`,
            "WARN"
          );
        });
    },
  });
};

const close = async () => {
  try {
    await global.consumer.disconnect();
  } catch (e) {
    log(`Failed to disconnect consumer gracefully!`, "ERROR");
  }
};

export { init, close };
