import { sleep } from "../utils/Utils";
import { DeviceTable } from "../db/DeviceTable";
import { DB } from "../db/DB";
import { TypeTable } from "../db/TypeTable";
import { SyncLogTable } from "../db/SyncLogTable";
import { SensorTable } from "../db/SensorTable";

const axios = require("axios")

type SensorValue = {
  sensorid: string;
  value: string;
  ts: string;
};

export async function fetchOneSensor(sensorId: string, type: string, from: Date, to: Date): Promise<SensorValue[]> {
  let fromString = from.toISOString().split('T')[0]
  let toString = to.toISOString().split('T')[0]

  let config = {
    headers: {
      "api-key": process.env.HIBOU_KEY,
      code: process.env.HIBOU_CODE,
      app: process.env.HIBOU_APP,
      from: fromString,
      to: toString,
      sensor: sensorId
    }
  }

  const res = await axios.get(
    `${process.env.HIBOU_URL}/${type}`,
    config
  );

  return res.data
}


export async function sensorsFetchEngine(db: DB) {
  console.log("fetching sensors data started")

  let deviceTable = new DeviceTable(db)
  let syncLongTable = new SyncLogTable(db)
  let sensorTable = new SensorTable(db)

  while (1) {
    let devices = await deviceTable.get("True")
    let types = await (new TypeTable(db)).get("True")

    for (let device of devices) {
      for (let type of types) {


        let syncLogs = await syncLongTable.get(`device_id='${device.device_id}' and type='${type.name}'`)
        let syncLog = syncLogs[0]

        /* If there's no record for this device */
        if (!syncLog) {
          let from = new Date("2022-09-1")
          let to = new Date("2022-09-1")

          await syncLongTable.insert(
            ['device_id', 'type', 'first_record_date', 'last_record_date'],
            [device.device_id, type.name, from, to]
          )
          syncLogs = await syncLongTable.get(`device_id='${device.device_id}' and type='${type.name}'`)
          syncLog = syncLogs[0]

        }

        let to = new Date(syncLog.last_record_date)
        let currentDate = new Date()

        while(to < currentDate){
          let from = new Date(syncLog.last_record_date)
          to.setDate(to.getDate() + 1)
          if(to > currentDate){
            to = currentDate
          }
          let records = await fetchOneSensor(device.device_id, type.name, from, to)
          for (let record of records) {
            sensorTable.insert(
              ['time', 'name', 'device_id', 'type', 'value'],
              [record.ts, device.name, record.sensorid, type.name, record.value]
            )
          }
          
          syncLongTable.update(
            ['last_record_date'],
            [to.toLocaleString()],
            `id=${syncLog.id}`)

          await sensorTable.removeDuplicate()
          await sleep(2000) // avoid too many requests
        }

      }

    }

    await sleep(1 * 60 * 1000) //every 1 min
  }
}