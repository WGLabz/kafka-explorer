import db from "./config/config"
import { Log } from "./models"

const initDB = async () => {
    try {
        await db.sync();
        console.log('connected to Database ');
    } catch (err) {
        console.log("Error connecting to DB ", err);
    }
}

const log = (message, type) => {
    Log.create({
        timestamp: new Date(),
        type: type,
        message: message
    }).then(() => console.log('Log added.'))
}

export { initDB, log }

