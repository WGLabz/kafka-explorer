import {
  ConsumerInit,
  ConsumerClose,
  ProducerInit,
  ProducerClose,
  SendMessage,
  createTopic,
} from "./kafka";
import { config, kafka, logs } from "./persistence";
import { ipcMain } from "electron";
import { sendUserMessage } from "./messaging";
import { init as RunTimer } from "./timer";
import {
  closeAdmin,
  initAdmin,
  getTopicsMeta,
  deleteTopicFromCluster,
} from "./kafka/admin/admin";
import { kafkaInit } from "./kafka/kafka";

const reconnectKafka = () => {
  // Stop existing client
  try {
    ConsumerClose();
    ProducerClose();
    closeAdmin();
    sendUserMessage("WARN", `Disconnnected!`);
  } catch (e) {
    sendUserMessage("ERROR", `Failed to disconnect!`);
  }
  try {
    //Start again
    kafkaInit()
      .then(() => {
        ConsumerInit();
        ProducerInit();
        initAdmin();
      })
      .catch((err) => {
        console.log("Kafka", err);
      });
    sendUserMessage("INFO", `Reconnected!`);
  } catch (e) {
    sendUserMessage("ERROR", `Failed to reconnect!`);
  }
};
ipcMain.on("logGet", (event, arg) => {
  logs
    .getlogs(arg)
    .then((logs_) => {
      event.reply("logGetResponse", logs_);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on("kafka", (event, arg) => {
  var command = arg.command;

  switch (command) {
    case "init":
      kafkaInit()
        .then(() => {
          ConsumerInit();
          ProducerInit();
          RunTimer();
          event.reply("userMessage", { type: "load", value: true });
        })
        .catch(() => {
          event.reply("userMessage", { type: "load", value: false });
        });
      break;

    case "close":
      ConsumerClose();
      ProducerClose();
      closeAdmin();
      break;

    case "message":
      var payload = arg.payload;
      SendMessage(payload.topic, payload.key, payload.value, payload.partition)
        .then((res) => {
          if (res) {
            sendUserMessage("INFO", "Message published sucessfully.");
          } else {
            sendUserMessage("ERROR", "Failed to publish message.");
          }
        })
        .catch(() => {
          sendUserMessage("ERROR", "Failed to publish message.");
        });
      break;

    case "createtopic":
      var payload_ = arg.payload;
      kafka
        .addTopic(payload_.name, payload_.type)
        .then((res) => {
          if (res) sendUserMessage("INFO", "Topic added to the DB sucessfully");
          else sendUserMessage("WARN", "Topic already exists!");
        })
        .catch(() => {
          sendUserMessage("ERROR", "Error adding topic to the DB");
        });
      if (payload_.createincluseter) {
        createTopic(
          payload_.topic,
          payload_.partition || 1,
          payload_.replicationfactor || 1
        )
          .then(() => {
            sendUserMessage("INFO", "Topic created in the cluster.");
          })
          .catch(() => {
            sendUserMessage("ERROR", "Failed to create topic in the cluster.");
          });
      }
      reconnectKafka();
      break;

    case "gettopics":
      kafka.getTopics().then((topics) => {
        event.reply("kafkaResponse", { topics: topics, type: "topics" });
      });
      break;

    case "disabletopic":
      kafka
        .disableTopic(arg.id)
        .then(() => {
          sendUserMessage("INFO", "Topic disabled sucessfully");
        })
        .catch(() => {
          sendUserMessage("ERROR", "Error disbaling topic.");
        });
      reconnectKafka();
      break;

    case "enabletopic":
      kafka
        .enableTopic(arg.id)
        .then(() => {
          sendUserMessage("INFO", "Topic enabled sucessfully");
        })
        .catch(() => {
          sendUserMessage("ERROR", "Error enabling topic.");
        });
      reconnectKafka();
      break;

    case "removetopic":
      kafka
        .removeTopic(arg.id)
        .then(() => {
          sendUserMessage("INFO", "Topic removed from DB");
        })
        .catch(() => {
          sendUserMessage("ERROR", "Error while removing topic from the DB.");
        });
      reconnectKafka();
      break;

    case "getmessages":
      kafka
        .getMessages(arg)
        .then((res) => {
          event.reply("kafkamessagesresponse", res);
        })
        .catch(() => {
          sendUserMessage("ERROR", "Failed loading kafka messages");
        });
      break;

    case "gettopicsmeta":
      getTopicsMeta()
        .then((res) => {
          event.reply("kafkaResponse", { type: "meta", meta: res });
        })
        .catch(() => {
          sendUserMessage("ERROR", "Failed loading topics from cluster.");
        });
      return;
    case "removetopicfromcluster":
      // deleteTopicFromCluster(arg.topic)
      //   .then(() => {
      //     sendUserMessage(
      //       "INFO",
      //       "Topic removed from the cluster successfully."
      //     );
      //   })
      //   .catch(() => {
      //     sendUserMessage(
      //       "ERROR",
      //       "Failed to delete topic. Check if cluster allows it."
      //     );
      //   });
      sendUserMessage(
        "INFO",
        "Feature coming soon.. Topic will be removed from DB if exists!"
      );
      kafka.removeTopicByName(arg.topic).catch(() => {
        sendUserMessage("ERROR", "Failed to remove topic from the DB.");
      });
      return;
  }
});

// Configuration Related.
ipcMain.on("conf", async (event, arg) => {
  var command = arg.command;
  if (command === "GET") {
    event.reply("confres", {
      type: "GET",
      server: await config.readConfig("KAFKA_BOOTSTRAP_SERVER"),
      username: await config.readConfig("KAFKA_USERNAME"),
      password: await config.readConfig("KAFKA_PASSWORD"),
      consgrp: await config.readConfig("KAFKA_CONSUMER_GROUP"),
    });
  }
  if (command === "SET") {
    try {
      console.log(arg);
      await config.updateConfig("KAFKA_USERNAME", arg.username);
      await config.updateConfig("KAFKA_PASSWORD", arg.password);
      await config.updateConfig("KAFKA_BOOTSTRAP_SERVER", arg.server);
      reconnectKafka();
      sendUserMessage("INFO", `Server config updated sucessfully!`);
    } catch (e) {
      sendUserMessage("ERROR", `Server config update failed!`);
    }
  }
  if (command === "STOP") {
    ConsumerClose();
    ProducerClose();
    closeAdmin();
  }
  if (command === "SET_CONS_GRP") {
    try {
      await config.updateConfig("KAFKA_CONSUMER_GROUP", arg.val);
      reconnectKafka();
      sendUserMessage("INFO", `Default consumer group updated sucessfully!`);
    } catch (e) {
      sendUserMessage("ERROR", `Default consumer group update failed!`);
    }
  }

  if (command === "START") {
    kafkaInit()
      .then(() => {
        ConsumerInit();
        ProducerInit();
        initAdmin();
        console.log("Kafka Initialized");
      })
      .catch((err) => {
        console.log("Kafka", err);
      });
  }
  if (command === "PURGE_DATABASE") {
    if (arg.CONFIG) {
      config
        .removeAllConfig()
        .then(() => {
          sendUserMessage("INFO", `App config cleared!`);
        })
        .catch(() => {
          sendUserMessage("ERROR", `App config clear failed!`);
        });
    }
    if (arg.LOGS) {
      logs
        .removeAllLogs()
        .then(() => {
          sendUserMessage("INFO", `Logs purged successfully!`);
        })
        .catch(() => {
          sendUserMessage("ERROR", `Failed to purge logs`);
        });
    }
    if (arg.MESSAGES) {
      kafka
        .removeAllMessages()
        .then(() => {
          sendUserMessage("INFO", `Messages purged successfully!`);
        })
        .catch(() => {
          sendUserMessage("ERROR", `Failed to purge messages`);
        });
    }
    if (arg.TOPICS) {
      kafka
        .removeAllTopics()
        .then(() => {
          sendUserMessage("INFO", `Kafka topics purged successfully!`);
        })
        .catch(() => {
          sendUserMessage("ERROR", `Failed to purge kafka topics.`);
        });
    }
  }
});
