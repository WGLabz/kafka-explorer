const loki = require("lokijs/src/lokijs.js");
const lfsa = require("lokijs/src/loki-fs-structured-adapter.js");

var db_ = new loki("kafka_eplorer.db", {
  adapter: new lfsa(),
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 4000,
});

process.on("SIGINT", function() {
  console.log("flushing database");
  db_.close();
});

function databaseInitialize() {
  console.log("Loading Collections");

  // Config Collection
  var config = db_.getCollection("config");
  if (config === null) {
    config = db_.addCollection("config");
  }

  //messages collection
  var messages = db_.getCollection("messages");
  if (messages === null) {
    messages = db_.addCollection("messages");
  }

  // topics collection
  var topics = db_.getCollection("topics");
  if (topics === null) {
    topics = db_.addCollection("topics");
  }

  // log collection
  var log = db_.getCollection("log");
  if (log === null) {
    log = db_.addCollection("log");
  }
  runProgramLogic();
}

function runProgramLogic() {
  console.log(
    "Entiries in log Collection : " + db_.getCollection("log").count()
  );
}

export { db_, databaseInitialize };
