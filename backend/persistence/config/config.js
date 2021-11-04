var Datastore = require("nedb");
var path = require("path");

var db = {};
var FOLDER_PATH = "./kafka_explorer";

db.config = new Datastore({
  filename: path.join(FOLDER_PATH, "config.db"),
});
db.messages = new Datastore({
  filename: path.join(FOLDER_PATH, "messages.db"),
});
db.log = new Datastore({
  filename: path.join(FOLDER_PATH, "log.db"),
});
db.topics = new Datastore({
  filename: path.join(FOLDER_PATH, "topics.db"),
});

db.config.loadDatabase();
db.messages.loadDatabase();
db.log.loadDatabase();
db.topics.loadDatabase();

export default db;
