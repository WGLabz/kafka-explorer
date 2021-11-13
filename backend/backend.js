import { logs } from "./persistence";
import {
  ConsumerInit,
  ConsumerClose,
  ProducerInit,
  ProducerClose,
  SendMessage,
  createTopic,
} from "./kafka";
import { config, kafka } from "./persistence";
import { ipcMain } from "electron";
import { sendUserMessage } from "./messaging";
import { init as RunTimer } from "./timer";
import { closeAdmin, initAdmin } from "./kafka/admin/admin";
import { kafkaInit } from "./kafka/kafka";

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
          console.log("Kafka Initialized");
        })
        .catch((err) => {
          console.log("Kafka", err);
        });
      break;

    case "close":
      ConsumerClose();
      ProducerClose();
      closeAdmin();
      break;
    case "message":
      var payload = arg.payload;
      SendMessage(payload.topic, payload.key, payload.value, payload.partition);
      break;

    case "createtopic":
      var payload_ = arg.payload;
      kafka
        .addTopic(payload_.name, payload_.type)
        .then(() => {
          sendUserMessage("INFO", "Topic added to the DB sucessfully");
        })
        .catch(() => {
          sendUserMessage("ERROR", "Error adding topic to the DB");
        });
      if (payload.createincluseter) {
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
    });
  }
  if (command === "SET") {
    try {
      console.log(arg);
      await config.updateConfig("KAFKA_USERNAME", arg.username);
      await config.updateConfig("KAFKA_PASSWORD", arg.password);
      await config.updateConfig("KAFKA_BOOTSTRAP_SERVER", arg.server);

      sendUserMessage("INFO", `Server config updated sucessfully!`);

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
            console.log("Kafka Initialized");
          })
          .catch((err) => {
            console.log("Kafka", err);
          });

        sendUserMessage("INFO", `Reconnected!`);
      } catch (e) {
        sendUserMessage("ERROR", `Failed to reconnect!`);
      }
    } catch (e) {
      sendUserMessage("ERROR", `Server config update failed!`);
    }
  }
  if (command === "STOP") {
    ConsumerClose();
    ProducerClose();
    closeAdmin();
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
});
