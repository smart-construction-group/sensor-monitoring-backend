import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as Joi from 'joi';
import * as debug from 'debug';
import { DB } from '../db/DB';
import { SensorTable } from '../db/SensorTable';
import { formatDate } from '../utils/Utils';


export function startRestAPIServer(db){

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.REST_PORT || 8080;

// here we are adding middleware to parse all incoming requests as JSON 
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
app.route('/sensors').get(async (req: express.Request, res: express.Response) => {
    const schema = Joi.object({
        type: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        interval: Joi.string().required()
    })
    const {error} = schema.validate(req.query)
    if(error){
        return res.status(400).json({error})
    }
    const ret = await (new SensorTable(db)).getSensorReport(
        req.query.type,
        req.query.from,
        req.query.to,
        req.query.interval
    )
    let sensorsData = {}
    for(let record of ret){
        var dateStr = formatDate(record.ts)
        if(!sensorsData[dateStr]){
            sensorsData[dateStr] = [record]
        } else {
            sensorsData[dateStr].push(record)
        }
    }

    res.status(200).json(sensorsData)
})
// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});

console.log("Starting the server")
server.listen(port, () => {
    // our only exception to avoiding Debug.log(), because we
    // always want to know when the server is done starting up
    console.log(runningMessage);
});

}
