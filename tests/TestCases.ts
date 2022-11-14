export const TestCases = {
    particleavg: [
        {
            "sensorid": "ssd_42C322",
            "apm10": "0.00",
            "apm25": "0.00",
            "apm1": "0.00",
            "d": "2022-11-02",
            "h": "1"
        },
        {
            "sensorid": "ssd_42C322",
            "apm10": "2.00",
            "apm25": "4.00",
            "apm1": "6.00",
            "d": "2022-11-02",
            "h": "2"
        },
        {
            "sensorid": "ssd_42C322",
            "apm10": "",
            "apm25": "6.a00",
            "apm1": "9x.00",
            "d": "2022-11-02",
            "h": "3"
        },
        {
            "sensorid": "ssd_42C322",
            "apm10": "",
            "apm25": "1.00",
            "apm1": "3.00",
            "d": "2022-11-02",
            "h": "4"
        },
        {
            "sensorid": "ssd_42C322",
            "apm10": "1.24",
            "apm25": "1.00",
            "apm1": "",
            "d": "2022-11-02",
            "h": "5"
        }
    ]
}

export const CorrectResults = {
    particleavg: [
        {
            value: 0
        },
        {
            value: 4
        },
        {
            value: 7.5
        },
        {
            value: 2
        },
        {
            value: 1.12
        }
    ]
}