import { kafka } from "../kafka";
import { log, kafka as kakfkadetails } from "../../persistence";

// Create a Kafka producer instance
const producer = kafka.producer();

const init = async () => {
  await producer.connect();
};

const send = async (topic, messagekey, messagevalue, partition) => {
  const sender = await producer.send({
    topic: topic,
    messages: [{ key: messagekey, value: messagevalue, partition: partition }],
  });
  var publishStatus = true;

  if (sender.length === 0 || sender[0].errorCode !== 0) {
    log(`The message  ${messagevalue} failed to published to topic ${topic}`);
    publishStatus = false;
  }

  //   Add Message to DB
  kakfkadetails.addMessage(
    JSON.stringify({
      key: messagekey,
      value: messagevalue,
    }),
    topic,
    "produce",
    partition,
    publishStatus
  );
};

const close = async () => {
  producer.close();
};

export { init, send, close };
