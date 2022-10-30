import { fetchOneSensor } from "../src/fetch/Fetch";
import { DeviceTable } from "../src/db/DeviceTable";
import { DB } from "../src/db/DB";
import { TypeTable } from "../src/db/TypeTable";
import { SensorTable } from "../src/db/SensorTable";
const dotenv = require("dotenv")

dotenv.config()
describe('Validate', function() {
    this.timeout(10000)
    xit('can fetch a sensor', async () => {
        let res = await fetchOneSensor("ssd_42C322",'temperature', new Date(), new Date())
        console.log(res[0])
    });
    xit("can get devices", async() =>{
        var db = new DB('pollution_heatmap')
        let res = await (new DeviceTable(db)).get("True")
        console.log(res)
    })

    xit("can insert a type", async()=>{
        var db = new DB('pollution_heatmap')
        let res = await (new TypeTable(db)).insert(['name'], ['humidity'])
        console.log(res)
    })
    xit("can remove duplicate records", async()=>{
        var db = new DB('pollution_heatmap')
        let res = await (new SensorTable(db)).removeDuplicate()
    })
    xit("can get the data report", async()=>{
        var db = new DB('pollution_heatmap')
        let res = await (new SensorTable(db)).getSensorReport(
            "temperature",
            "2022-10-24",
            "2022-10-25",
            "hourly"
        )
        console.log(res)
    })
    it("can get 5 min data report", async()=>{
        var db = new DB('pollution_heatmap')
        let res = await (new SensorTable(db)).getSensorReport(
            "temperature",
            "2022-10-24",
            "2022-10-25",
            "5min"
        )
        console.log(res)
    })
})