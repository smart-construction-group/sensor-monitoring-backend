import { DB } from "./DB";
import { Table } from "./Table";

const table = {
    time: {
        type: 'timestamp'
    },
    name: {
        type: 'VARCHAR(50)'
    },
    device_id: {
        type: 'VARCHAR(50)'
    },
    type: {
        type: 'VARCHAR(30)'
    },
    value: {
        type: 'double precision'
    }
}

export class SensorTable extends Table {
    db: DB
    constructor(db: DB) {
        super(db, "sensor", table)
    }
    async getSensorReport(type: String, from: String, to: String, interval: String) {
        switch (interval) {
            case "hourly": interval = "hour"
                break;
            case "minutely": interval = "minute"
                break;
            case "daily": interval = "day"
                break;
            default: throw Error("interval is not defined")
        }
        var q = `
                SELECT type, device.name, device.device_id, location_x as x, location_y as y, date_trunc('${interval}', time) AS ts
                , count(*) AS total_records, avg(value) as value
                FROM   pollution_heatmap.sensor inner join pollution_heatmap.device on device.device_id = sensor.device_id
                WHERE time >= '${from}' and time <= '${to}' and type = '${type}'
                GROUP  BY type, device.name, device.device_id, ts, location_y, location_x
                ORDER  BY ts;
            `

        const res = await this.db.pool.query(q)
        return res.rows
    }
}