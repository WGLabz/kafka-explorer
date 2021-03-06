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
    return config.length > 0 ? config[0].value : "";
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
  removeAllConfig: async () => {
    return await db.config.remove({}, { multi: true });
  },
  reset: () => {},
};

// Kafka related methods
const kafka = {
  removeTopicByName: async (name) => {
    const topic_ = await db.topics.find({
      $and: [
        {
          name: name,
        },
      ],
    });
    if (topic_.length !== 0) {
      await db.topics.remove({ _id: topic_._id });
    } else {
      return Promise.resolve("true");
    }
  },
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
        return Promise.resolve("false");
      }
    } catch (err) {
      return false;
    }
  },
  getTopics: async (query) => {
    return await db.topics
      .find({
        $where: function () {
          var topic = this;
          if (query.text && query.text !== "") {
            return topic.name.indexOf(query.text) > -1;
          } else return true;
        },
      })
      .sort({ lastedit: -1 });
  },
  getMessages: async (query) => {
    return await db.messages
      .find({
        $where: function () {
          var message = this;
          var val =
            message.timestamp > query.start && message.timestamp < query.end;

          if (query.text && query.text !== "") {
            val = val && message.message.indexOf(query.text) > -1;
          }
          return val;
        },
      })
      .sort({ timestamp: -1 });
  },
  removeAllMessages: async () => {
    return await db.messages.remove({}, { multi: true });
  },
  removeAllTopics: async () => {
    return await db.topics.remove({}, { multi: true });
  },
};

// All log related Ops
const logs = {
  removeAllLogs: async () => {
    return await db.log.remove({}, { multi: true });
  },
  getlogs: async (query) => {
    let type = query.type;
    // let filter = {};

    return await db.log
      .find({
        $where: function () {
          var log = this;
          var val = log.timestamp > query.start && log.timestamp < query.end;

          if (query.text && query.text !== "") {
            val = val && log.message.indexOf(query.text) > -1;
          }

          switch (type) {
            case "WARN":
              val = val && (log.type === "WARN" || log.type === "ERROR");
              break;
            case "INFO":
              val =
                val &&
                (log.type === "WARN" ||
                  log.type === "ERROR" ||
                  log.type === "INFO");

              break;
            case "ERROR":
              val = val && log.type === "ERROR";

              break;
            default:
              val =
                val &&
                (log.type === "WARN" ||
                  log.type === "ERROR" ||
                  log.type === "INFO");
              break;
          }
          return val;
        },

        // $and: [
        //   filter,
        //   {
        //     $and: [
        //       { timestamp: { $gt: query.start } },
        //       { timestamp: { $lt: query.end } },
        //     ],
        //   },
        // ],
      })
      .sort({ timestamp: -1 });
  },
  getLatestLogs: async (limit) => {
    return await db.log.find().sort({ timestamp: -1 }).limit(limit);
  },
};
export { log, logs, kafka, config };

//9668863074
