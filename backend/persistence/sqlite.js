const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('db', 'user', 'pass', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'db.sqlite',
    operatorsAliases: false
});

// DB tables init
class Config extends Model { }
class Messages extends Model { }
class Log extends Model { }
class Topics extends Model { }

//  Initilize Tables
const init = () => {
    Log.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        timestamp: DataTypes.DATE,
        type: DataTypes.STRING,
        message: DataTypes.STRING
    }, { sequelize, modelName: 'log' });

    Config.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        created: DataTypes.DATE,
        lastchange: DataTypes.DATE,
        name: DataTypes.STRING,
        value: DataTypes.STRING
    }, { sequelize, modelName: 'config' })

    Messages.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        timestamp: DataTypes.DATE,
        topic: DataTypes.STRING,
        message: DataTypes.STRING,
    }, { sequelize, modelName: 'messages' })

    Topics.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        created: DataTypes.DATE,
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        state: DataTypes.BOOLEAN,
        lastedit: DataTypes.DATE
    }, { sequelize, modelName: 'messages' })

}

module.exports = { init }


