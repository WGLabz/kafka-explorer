import { createRxDatabase, getRxStoragePouch, addPouchPlugin } from "rxdb";
import { model } from "../model/model";
// import * as PouchdbAdapterIdb from 'pouchdb-adapter-idb';
// addPouchPlugin(PouchdbAdapterIdb);

addPouchPlugin(require("pouchdb-adapter-leveldb"));
// addPouchPlugin(require("pouchdb-adapter-indexeddb"));

const leveldown = require("leveldown");
// const memdown = require("memdown");
// addPouchPlugin(require('pouchdb-adapter-idb'));
addPouchPlugin(require("pouchdb-adapter-memory"));

const dbInit = async () => {
  const db = await createRxDatabase({
    name: "kafka_explorer", // <- name
    storage: getRxStoragePouch(leveldown),
    // storage: getRxStoragePouch("indexeddb"),
    multiInstance: true,
    eventReduce: false,
  });
  // Create Log collection if not exists.
  console.log(db.log);
  if (!db.log) {
    console.log("Creating log collections!");
    // await db.collection({
    //   name: "log",
    //   schema: model.logs,
    // });
    await db.addCollections({
      log: {
        schema: model.logs,
      },
    });
    // console.log(db.log);
  }
  return db;
};

dbInit();
// export { dbInit };
