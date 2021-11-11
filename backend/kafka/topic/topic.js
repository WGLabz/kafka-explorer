
const createTopic = async (topic, partition, replicationFactor) => {
  const admin = global.kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: topic,
        numPartitions: partition,
        replicationFactor: replicationFactor,
      },
    ],
    waitForLeaders: true,
  });
  await admin.disconnect();
};

const deleteTopic = async (topic) => {
  const admin = kafka.admin();
  await admin.connect();
  await admin.createTopics({
    topics: [topic],
  });
  await admin.disconnect();
};

export { createTopic, deleteTopic };
