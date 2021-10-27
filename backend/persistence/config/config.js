import { Sequelize } from 'sequelize'

const db = new Sequelize('db', '', '', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'db.sqlite',
    operatorsAliases: false,
    logging: false
});

export default db;