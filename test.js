import { initDB, log, config, kafka } from "./backend/persistence";
import { ConsumerInit, ProducerInit, SendMessage } from "./backend/kafka";

const test = async () => {
  await initDB();
  // log("dfkdf", "asd")
  // console.log(await config.readConfig('KAFKA_BOOTSTRAP_SERVER'));
  // config.updateConfig('KAFKA_BOOTSTRAP_SERVER', 'localhost:9092')
  // config.updateConfig('KAFKA_USERNAME', '')
  // config.updateConfig('KAFKA_PASSWORD', '')

  // console.log(await kafka.getKafkaTopicsToConsume());
  // ConsumerInit();
  await ProducerInit();
  await SendMessage("testddd", "Accha", "my Message", 0);
};

test();
