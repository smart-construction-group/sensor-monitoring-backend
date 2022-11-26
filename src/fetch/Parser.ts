import { SensorValue } from "./Fetch";

export function parseData(sensorType: String, data: Object[]): SensorValue[] {
  if (sensorType === "particleavg") {
    var parsed = [];
    const valueKeys = ["apm10", "apm25"];
    const targetSensors = ["particleavg10", "particleavg2.5"];
    try {
      for (var i in data) {
        var value = 0;
        for (var j in valueKeys) {
          if (data[i].hasOwnProperty(valueKeys[j])) {
            var value = parseFloat(data[i][valueKeys[j]]);
            if (isNaN(value)) continue;

            /* convert the time based on the d & h keys */
            var time = new Date(data[i]["d"]);
            time.setHours(data[i]["h"], 0, 0, 0);

            var newRecord = {
              type: targetSensors[j],
              sensorid: data[i]['sensorid'],
              value,
              ts: time,
            };

            parsed.push(newRecord);
          }
        }
      }
      return parsed;
    } catch (e) { }
  } else {
    data = data.map(d => {
      d['type'] = sensorType
      return d
    })
    return <SensorValue[]>data;
  }
}
