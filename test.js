import { initDB, log } from "./backend/persistence"

const test = async () => {
    await initDB()
    log("dfkdf", "asd")
}

test();