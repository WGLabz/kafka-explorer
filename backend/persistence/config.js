const Datastore = require("nedb-promises");
var path = require("path");

var db = {};
var FOLDER_PATH = "kafka_explorer";

db.config = Datastore.create({
  filename: path.join(FOLDER_PATH, "config.db"),
});
db.messages = Datastore.create({
  filename: path.join(FOLDER_PATH, "messages.db"),
});
db.log = Datastore.create({
  filename: path.join(FOLDER_PATH, "log.db"),
});
db.topics = Datastore.create({
  filename: path.join(FOLDER_PATH, "topics.db"),
});

db.log
  .load()
  .then(() => console.log("DB log loaded!"))
  .catch((err) => console.log(err));

db.config
  .load()
  .then(() => console.log("DB config loaded!"))
  .catch((err) => console.log(err));
db.messages
  .load()
  .then(() => console.log("DB messages loaded!"))
  .catch((err) => console.log(err));
db.topics
  .load()
  .then(() => console.log("DB topics loaded!"))
  .catch((err) => console.log(err));

export { db };
