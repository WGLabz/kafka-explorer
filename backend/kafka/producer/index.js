import { log, kafka as kakfkadetails } from "../../persistence";

const init = async () => {
  // Create a Kafka producer instance
  global.producer = global.kafka.producer();

  return await global.producer.connect();
};

const send = async (topic, messagekey, messagevalue, partition) => {
  try {
    const sender = await global.producer.send({
      topic: topic,
      messages: [
        { key: messagekey, value: messagevalue, partition: partition },
      ],
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
    return true;
  } catch (e) {
    kakfkadetails.addMessage(
      JSON.stringify({
        key: messagekey,
        value: messagevalue,
      }),
      topic,
      "produce",
      partition,
      false
    );
    return false;
  }
};

const close = async () => {
  global.producer.disconnect();
};

export { init, send, close };
