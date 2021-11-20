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

export { createTopic };
