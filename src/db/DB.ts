import { DBError } from "../errors/DBError";
import { SensorTable } from "./SensorTable";
import { DeviceTable } from "./DeviceTable";
import { TypeTable } from "./TypeTable";
import { SyncLogTable } from "./SyncLogTable";
var {Pool} = require('pg');


export class DB {
    pool = null
    schema = ""
    constructor(schema: string) {
        try {
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: false
            });

        } catch (e) {
            throw new DBError('failed to start connection pool', e)
        }
        if (schema)
            this.schema = schema
    }

    /**
     * 
     * @param {string} q SQL query string
     */
    async query(q) {
        return await this.pool.query(q)
    }

    async init() {
        try {
            /* create Schema */
            await this.query(`CREATE SCHEMA IF NOT EXISTS ${this.schema}`)

            /* use schema */
            await this.query(`SET search_path TO ${this.schema},public`)

            /* Create Tables */
            let sensorTable = new SensorTable(this)
            await sensorTable.init()
            
            let deviceTable = new DeviceTable(this)
            await deviceTable.init()

            let typeTable = new TypeTable(this)
            await typeTable.init()

            let syncLogTable = new SyncLogTable(this)
            await syncLogTable.init()

        } catch (e) {
            throw new DBError("Database init failed", e)
        }
    }
}