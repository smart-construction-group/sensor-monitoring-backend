import { DB } from "./DB";
import { Table } from "./Table";

const table = {
    name: {
        type: 'VARCHAR(50)'   
    }
}

export class TypeTable extends Table{
    db : DB
    constructor(db: DB){
        super(db, "type", table)
    }
}