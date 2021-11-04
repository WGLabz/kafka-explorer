import { Sequelize } from 'sequelize'
import sqlite3 from "sqlite3"

const db = new Sequelize('db', '', '', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'db.sqlite',
    dialectModule: sqlite3, 
    operatorsAliases: false,
    logging: false
});

export default db;