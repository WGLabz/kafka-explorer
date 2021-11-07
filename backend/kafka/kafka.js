const { Kafka } = require('kafkajs')
import { config } from "../persistence"
let username, password, brokers, sasl, ssl

async function init() {
  username = await config.readConfig('KAFKA_USERNAME');
  password = await config.readConfig('KAFKA_PASSWORD');
  brokers = await config.readConfig('KAFKA_BOOTSTRAP_SERVER');
  sasl = username && password ? { username, password, mechanism: 'plain' } : null
  ssl = !!sasl
  brokers = brokers.split(',');
}

const kafka = new Kafka({
  clientId: 'a-random-client-id',
  brokers: async () => {
    await init();
    return brokers;
  },
  ssl,
  sasl
})

export { kafka }
