import { kafka } from "../kafka";
import { log, kafka as kakfkadetails } from "../../persistence";
import { sendUserMessage } from "../../messaging";

// Create a Kafka consumer.
const consumer = kafka.consumer({
  groupId: "KAFKA_EXPLORER",
});

const init = async () => {
  const topics = await kakfkadetails.getKafkaTopicsToConsume();

  // Connect
  await consumer.connect();

  // Subscribe to Kafka topic
  topics.map(async (topic) => {
    if (topic.isActive) {
      console.log(`Subscribing to topic ${topic.name}`, "INFO");
      log(`Subscribing to topic ${topic.name}`, "INFO");
      try {
        await consumer.subscribe({
          topic: topic.name,
          fromBeginning: false,
        });
      } catch (e) {
        sendUserMessage("ERROR", `Failed to subscribe to topic : ${topic.name}`);
      }
    }
  });

  // Listen to incoming messages
  await consumer.run({
    eachMessage: ({ topic, partition, message }) => {
      var msg = {
        key: message.key ? message.key.toString() : "",
        value: message.value ? message.value.toString() : "",
        headers: message.headers ? message.headers : "",
      };
      console.log(JSON.stringify(msg));
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
    await consumer.disconnect();
  } catch (e) {
    log(`Failed to disconnect consumer gracefully!`, "ERROR");
  }
};

export { init, close };
