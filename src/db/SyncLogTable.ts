import { DB } from "./DB";
import { Table } from "./Table";

const table = {
    device_id: {
        type: 'VARCHAR(50)'   
    },
    type: {
        type: "VARCHAR(50)"
    },
    first_record_date: {
        type: "timestamp"
    },
    last_record_date: {
        type: "timestamp"
    }
}

export class SyncLogTable extends Table{
    db : DB
    constructor(db: DB){
        super(db, "sync_log", table)
    }
}