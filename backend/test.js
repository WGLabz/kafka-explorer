// import { log, logs, kafka, config } from "./persistence";

// logs
//   .getlogs()
//   .then((logs) => {
//     console.log(logs);
//   });
// log('Hellp','WARN');
// console.log(kafka.addTopic("test", "consume"));
// kafka.addTopic("test3", "consume");
// // // kafka.
// kafka.getKafkaTopicsToConsume().then((data) => {
//   console.log(data);
// });
// config.updateConfig('KAFKA_USERNAME','')
// config.updateConfig('KAFKA_PASSWORD','')
// config.updateConfig('KAFKA_BOOTSTRAP_SERVER','localhost:9092')
// config.updateConfig('KAFKA_USERNAME','')
// config.readConfig('KAFKA_BOOTSTRAP_SERVER').then((val) =>{
//     console.log(val);
// // })
// import {
//   ConsumerInit,
//   ConsumerClose,
//   ProducerInit,
//   ProducerClose,
//   SendMessage,
//   createTopic,
// } from "./kafka";

// // ConsumerInit();
// ProducerInit().then(() =>{

//   SendMessage('test3','Helloworld','HeloWorld',0)
// });

// kafka
//   .admin()
//   .describeCluster()
//   .then((res) => {
//     console.log(res);
//   });

// import { init as RunTimer } from "./Timer";

// RunTimer();

// import { kafka } from "./persistence/index";
// kafka
//   .getMessages({
//     start: new Date(new Date() - 24 * 1000 * 60 * 60),
//     end: new Date(),
//   })
//   .then((res) => {
//     console.log(res);
//   });

// import { kafka } from "./persistence";

// kafka.addTopic("test329ddd43dd", "consume").then((res) => {
//   console.log(res);
// });

const { ConfigResourceTypes } = require("kafkajs");

import { kafkaInit } from "./kafka/kafka";
//Start again
kafkaInit().then(async () => {
  let admin = global.kafka.admin();
  await admin.connect();
  const offsets = await admin.fetchTopicOffsets();
  //console.log(JSON.stringify(topicMeta));
  // console.log(JSON.stringify(offsets));
  // const meta = await admin.fetchTopicMetadata({ topics: ["test"] });
  // console.log(meta);
  // const cluseter = await admin.describeCluster();
  // console.log(cluseter);

  // const res = await admin.describeConfigs({
  //   includeSynonyms: false,
  //   resources: [
  //     {
  //       type: ConfigResourceTypes.BROKER,
  //       name: "LAPTOP-0PDKQV5Q",
  //     },
  //   ],
  // });
  // const res = await admin.describeGroups(["KAFKA_EXPLORER"]); // await admin.listGroups();
  // console.log(res);
});
