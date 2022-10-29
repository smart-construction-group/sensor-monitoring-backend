import { DB } from "./DB";

/**
 * Abstract Class Table.
 *
 * @class Table
 */
export class Table {
    tableName: String
    db: DB
    table: Object
    constructor(db: DB, tableName: String, table: Object) {
      if (this.constructor == Table) {
        throw new Error("Abstract classes can't be instantiated.");
      }
      this.db = db
      this.tableName = tableName
      this.table = table
    }
  
    async init(){
        /* Create `sensor` Table */
        await this.db.query(`CREATE TABLE IF NOT EXISTS ${this.tableName} (id SERIAL PRIMARY KEY)`)
        
        /* Add columns to the table */
        let keys = Object.keys(this.table)
        for(let fieldName of keys){
            await this.db.query(`ALTER TABLE ${this.tableName} ADD COLUMN IF NOT EXISTS ${fieldName} ${this.table[fieldName].type};`)
        }
    }

    async get(where: String){
        let res =  await this.db.query(`select * from ${this.db.schema +"."+ this.tableName} where ${where}`)
        return res.rows
    }

    async insert(keys: Array<string>, values: Array<any>){
      var q = {
        text: `
        insert into ${this.db.schema +"."+ this.tableName}
        (${keys.join(",")})
        values
        (${getValueNumbersString(values.length)})
        `,
        values
      }
      const ret = await this.db.query(q)
    }

    async update(keys: string[], values: string[], where: string){
      var q = {
        text: `
        update ${this.db.schema +"."+ this.tableName}
        set
        ${(()=>{
          let str = ""
          for(let i=0; i<keys.length; i++){
            str += keys[i] +'='+ `$${i+1}`
            if(i != keys.length-1) str += ","
          }
          return str
        })()}
        where ${where}
        `,
        values
      }
      const ret = await this.db.query(q)
    }

    async removeDuplicate(){
      var self = this
      const q = `DELETE  FROM
      ${this.db.schema +"."+ this.tableName} a
      USING ${this.db.schema +"."+ this.tableName} b
      WHERE
      a.id > b.id
      ${(()=>{
        let str = ""
        for(let key in self.table){
          str += ` AND a.${key}=b.${key}`
        }
        return str
      })()}`
      await this.db.query(q)
    }
  }
  

  function getValueNumbersString(len: number){
    if(len < 1) throw Error("len should be greater than 1")
    let str = ""
    for(let i=0; i<len; i++){
      str += `$${i+1}`
      if(i+1 != len) str += ","
    }
    return str
  }