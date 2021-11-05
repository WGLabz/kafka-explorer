import db from "./config/config";
import { v4 as uuidv4 } from "uuid";
const log = (message, type) => {
  db.logs.put(
    {
      _id: uuidv4(),
      type: type,
      timestamp: new Date(),
      message: message,
    },
    function callback(err) {
      if (!err) {
        console.log("Successfully posted a log!");
      }
    }
  );
};

// // Kafka configurations methods
// const config = {
//   readConfig: async (name) => {
//     const config = await Config.findAll({
//       where: {
//         name: name,
//       },
//     });
//     return config.length > 0 ? config[0].dataValues.value : false;
//   },
//   updateConfig: async (name, value) => {
//     // Check if config already exists
//     const config = await Config.findAll({
//       where: {
//         name: name,
//       },
//     });
//     // Update
//     if (config.length !== 0) {
//       try {
//         await Config.update(
//           {
//             value: value,
//             lastchange: new Date(),
//           },
//           {
//             where: {
//               name: name,
//             },
//           }
//         );
//         return true;
//       } catch (e) {
//         return false;
//       }
//     } else {
//       // Create
//       try {
//         await Config.create({
//           created: new Date(),
//           lastchange: new Date(),
//           name: name,
//           value: value,
//         });
//         return true;
//       } catch (e) {
//         return false;
//       }
//     }
//   },
//   reset: () => {},
// };

// // Kafka related methods
// const kafka = {
//   getKafkaTopicsToConsume: async () => {
//     const topicsToConsume = await Topics.findAll({
//       where: {
//         type: "consume",
//       },
//     });

//     var topicsData = [];
//     topicsToConsume.map((topic) => {
//       topicsData.push(topic.dataValues);
//     });

//     return topicsData;
//   },
//   addMessage: async (message, topic, type, partition, publishstatus) => {
//     await Messages.create({
//       timestamp: new Date(),
//       topic: topic,
//       message: message,
//       type: type,
//       partition: partition,
//       publishstatus: publishstatus,
//     });
//   },
//   addTopic: (topic, type) => {
//     Topics.create({
//       created: new Date(),
//       name: topic,
//       type: type,
//       state: true,
//       lastedit: new Date(),
//     });
//   },
// };

// All log related Ops
const logs = {
  getlogs: async (query) => {
    console.log(query);
    return await db.logs.allDocs({ include_docs: true });
  },
};
export { log, logs };
