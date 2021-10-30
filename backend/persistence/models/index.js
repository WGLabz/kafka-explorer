import { Model, DataTypes } from "sequelize";
import db from "../config/config";

// DB tables init
class Config extends Model {}
class Messages extends Model {}
class Log extends Model {}
class Topics extends Model {}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timestamp: DataTypes.DATE,
    type: DataTypes.STRING,
    message: DataTypes.STRING,
  },
  { sequelize: db, tableName: "log" }
);

Config.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    created: DataTypes.DATE,
    lastchange: DataTypes.DATE,
    name: DataTypes.STRING,
    value: DataTypes.STRING,
  },
  { sequelize: db, tableName: "config" }
);

Messages.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timestamp: DataTypes.DATE,
    topic: DataTypes.STRING,
    message: DataTypes.STRING,
    type: DataTypes.STRING,
    publishstatus: DataTypes.BOOLEAN,
  },
  { sequelize: db, tableName: "messages" }
);

Topics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    created: DataTypes.DATE,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    isactive: DataTypes.BOOLEAN,
    lastedit: DataTypes.DATE,
    group: DataTypes.STRING,
    partition: DataTypes.INTEGER,
  },
  { sequelize: db, tableName: "topics" }
);

export { Log, Messages, Config, Topics };
