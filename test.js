import { initDB, log, config} from "./backend/persistence"

const test = async () => {
    await initDB()
    log("dfkdf", "asd")
    config.readConfig('servers');
    config.updateConfig('servers','Server xys')
}

test();