import {SensorValue} from './Fetch'

export function parseData(sensorType: String, data: Object[]): SensorValue[] {
    if(sensorType === "particleavg"){
        var parsed = []
        const valueKeys = ['apm10', 'apm25', 'apm1']

        try{

            for(var i in data){
                var value = 0
                var validKeys = 0
                for(var k of valueKeys){
                    if (data[i].hasOwnProperty(k)){
                        var float = parseFloat(data[i][k])
                        if(!isNaN(float)){
                            value += float
                            validKeys++;
                        }
                    }
                }

                /* calculate the average */
                if(validKeys > 0)
                    value = value/validKeys

                /* convert the time based on the d & h keys */
                var time = new Date(data[i]['d'])
                time.setHours(data[i]['h'], 0, 0, 0)
                
                parsed[i] = {
                    sensorid: data[i]['sensorid'],
                    value,
                    ts: time
                }
            }
            return parsed
        }catch(e){}

    } else {
        return <SensorValue[]>data
    }
}