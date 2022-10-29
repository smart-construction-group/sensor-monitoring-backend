export class DBError extends Error {
    constructor (message, error) {
        if(error){
            super(message+ ": " +error.message)
            Error.captureStackTrace(error)
        }
        else{
            super(message)
            Error.captureStackTrace(this)
        }
        Object.setPrototypeOf(this, new.target.prototype)
    }
}