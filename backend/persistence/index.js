import { db } from "./config";

const log = async (message, type) => {
  try {
    await db.log.insert({
      message: message,
      timestamp: new Date(),
      type: type,
    });
  } catch (err) {
    return false;
  }
};

// Kafka configurations methods
const config = {
  readConfig: async (name) => {
    const config = await db.config
      .find({
        name: name,
      })
      .sort();
    return config.length > 0 ? config[0].value : false;
  },
  updateConfig: async (name, value) => {
    // Check if config already exists
    const config = await db.config
      .find({
        name: name,
      })
      .sort();

    // Update
    if (config.length !== 0) {
      try {
        await db.config.update(
          {
            name: name,
          },
          { $set: { value: value, lastchange: new Date() } }
        );
        return true;
      } catch (e) {
        return false;
      }
    } else {
      // Create
      try {
        await db.config.insert({
          created: new Date(),
          lastchange: new Date(),
          name: name,
          value: value,
        });
        return true;
      } catch (e) {
        return false;
      }
    }
  },
  reset: () => {},
};

// Kafka related methods
const kafka = {
  removeTopic: async (id) => {
    return await db.topics.remove({ _id: id });
  },
  disableTopic: async (id) => {
    return await db.topics.update(
      { _id: id },
      { $set: { isActive: false, lastedit: new Date() } }
    );
  },
  enableTopic: async (id) => {
    return await db.topics.update(
      { _id: id },
      { $set: { isActive: true, lastedit: new Date() } }
    );
  },
  getKafkaTopicsToConsume: async () => {
    const topicsData = await db.topics
      .find({
        type: "consume",
      })
      .sort();

    return topicsData;
  },
  addMessage: async (message, topic, type, partition, publishstatus) => {
    try {
      await db.messages.insert({
        timestamp: new Date(),
        topic: topic,
        message: message,
        type: type,
        partition: partition,
        publishstatus: publishstatus,
      });
    } catch (err) {
      return false;
    }
  },
  addTopic: async (topic, type) => {
    try {
      const topic_ = await db.topics.find({
        $and: [
          {
            type: type,
          },
          {
            name: topic,
          },
        ],
      });

      if (topic_.length === 0) {
        // Check if the topic already exists with same type
        return await db.topics.insert({
          created: new Date(),
          name: topic,
          type: type,
          state: true,
          lastedit: new Date(),
          isActive: true,
        });
      } else {
        console.log("Exist");
        // console.log("Topic already exists!");
        return Promise.resolve("false");
      }
    } catch (err) {
      return false;
    }
  },
  getTopics: async () => {
    return await db.topics.find({}).sort({ lastedit: -1 });
  },
  getMessages: async (query) => {
    const messages = await db.messages
      .find({
        $and: [
          { timestamp: { $gt: query.start } },
          { timestamp: { $lt: query.end } },
        ],
      })
      .sort({ timestamp: -1 });
    return messages;
  },
};

// All log related Ops
const logs = {
  getlogs: async (query) => {
    let type = query.type;
    let filter = {};
    switch (type) {
      case "WARN":
        filter.$or = [
          {
            type: "WARN",
          },
          {
            type: "ERROR",
          },
        ];
        break;
      case "INFO":
        filter.$or = [
          {
            type: "INFO",
          },
          {
            type: "WARN",
          },
          {
            type: "ERROR",
          },
        ];
        break;
      case "ERROR":
        filter.$or = [
          {
            type: "ERROR",
          },
        ];
        break;
    }
    const docs = await db.log
      .find({
        $and: [
          filter,
          {
            $and: [
              { timestamp: { $gt: query.start } },
              { timestamp: { $lt: query.end } },
            ],
          },
        ],
      })
      .sort({ timestamp: -1 });
    return docs;
  },
};
export { log, logs, kafka, config };

//9668863074
