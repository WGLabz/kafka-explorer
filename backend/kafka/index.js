import { init as ConsumerInit, close as ConsumerClose } from "./consumer";
import {
  init as ProducerInit,
  close as ProducerClose,
  send as SendMessage,
} from "./producer";
import { createTopic } from "./topic/topic";

export {
  ConsumerInit,
  ConsumerClose,
  ProducerInit,
  ProducerClose,
  SendMessage,
  createTopic,
};
