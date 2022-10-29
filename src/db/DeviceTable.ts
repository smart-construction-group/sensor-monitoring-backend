import { DB } from "./DB";
import { Table } from "./Table";

const table = {
    name: {
        type: 'VARCHAR(50)'   
    },
    device_id: {
        type: 'VARCHAR(50)'
    },
    location_x: {
        type: 'double precision'
    },
    location_y: {
        type: 'double precision'
    }
}

export class DeviceTable extends Table{
    db : DB
    constructor(db: DB){
        super(db, "device", table)
    }
}