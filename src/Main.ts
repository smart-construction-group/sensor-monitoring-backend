import {DB} from "./db/DB"
import * as dotenv from "dotenv"
import { sensorsFetchEngine } from "./fetch/Fetch";
import { startRestAPIServer } from "./rest/RestAPI";
dotenv.config()

async function main(){
    var db = new DB("pollution_heatmap");
    await db.init()
    sensorsFetchEngine(db)
    startRestAPIServer(db)
    console.log("Hello World!")
}

main();