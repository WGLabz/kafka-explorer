// var PouchDB = require("pouchdb");
// import PouchDB from 'pouchdb-browser'
// import PouchDB from 'pouchdb-node'
PouchDB.plugin(require('pouchdb-find').default);
var directory = "database";
var db = {
  messages: new PouchDB(`${directory}/messages`),
  topics: new PouchDB(`${directory}/topics`),
  config: new PouchDB(`${directory}/config`),
  logs: new PouchDB(`${directory}/logs`),
};
export default db;
