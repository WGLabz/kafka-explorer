import db from "./config/config"
import { Log, Topics, Messages, Config } from "./models"

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

const addTopic = (topic, type) => {
    Topics.create({
        created: new Date(),
        name: topic,
        type: type,
        state: true,
        lastedit: new Date()
    });
}


// Kafka configurations methods
const config = {
    readConfig: async (name) => {
        const config = await Config.findAll({
            where: {
                name: name
            }
        });
        return config.length > 0 ? config[0].dataValues.value : false;
    },
    updateConfig: async (name, value) => {
        // Check if config already exists
        const config = await Config.findAll({
            where: {
                name: name
            }
        });
        // Update
        if (config.length !== 0) {
            try {
                await Config.update({
                    value: value,
                    lastchange: new Date()
                }, {
                    where: {
                        name: name
                    }
                });
                return true;
            } catch (e) {
                return false;
            }
        } else {
            // Create
            try {
                await Config.create({
                    created: new Date(),
                    lastchange: new Date(),
                    name: name,
                    value: value
                });
                return true;
            } catch (e) {
                return false;
            }
        }
    },
    reset: () => {

    }
}

// Kafka related methods
const kafka = {
    getKafkaTopicsToConsume: async () => {
        const topicsToConsume = await Topics.findAll({
            where: {
                type: 'consume'
            }
        });

        var topicsData = [];
        topicsToConsume.map((topic) => {
            topicsData.push(topic.dataValues);
        });

        return topicsData;
    },
    addMessage: async (message, topic, type, partition) => {
        await Messages.create({
            timestamp: new Date(),
            topic: topic,
            message: message,
            type: type,
            partition: partition
        })
    }

};
export { initDB, log, config, kafka }

