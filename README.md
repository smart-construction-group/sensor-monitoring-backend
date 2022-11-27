# Sensor Monitoring Backend
This source is the backend for the monitoring dashboard. It's wrapper between the dashboard and the sensor api. The data is fetched from the sensor api and stored in the local database regularly.
In order to setup and run, you need Docker and Postgres installed. Follow the instruction below.

## Install Docker
The following installation script is built for Ubuntu16+, for other distributions of linux please search online.
```
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get -y update
sudo apt-get -y install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Docker official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# set up the stable repository.
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  
sudo apt-get -y update
sudo apt-get -y install docker-ce docker-ce-cli containerd.io

# verify docker is installed correctly 
sudo docker run hello-world
```
## Install Docker Compose
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

## Define Environments

The following environment variables are needed to setup the database, connect to Hibou API. You can add them either with creating a `.env` file within the code root or by exporting each using `export KEY=VALUE` command. Also if you're using Github actions as CI provider, you can specify environment in the Runner's config.
```
PG_PASSWORD = "<postgres_password>"
DATABASE_URL = "postgres://postgres:<postgres_password>@localhost:30432/postgres"
REST_PORT=9090
HIBOU_URL = "https://www.hibouconnect.com/tapi"
HIBOU_CODE = "<hibou_api_code>"
HIBOU_KEY = "<hibou_api_key>"
HIBOU_APP = "hibou5775"
```

## Run the source code

Clone this repository
```
git clone https://github.com/smart-construction-group/sensor-monitoring-backend
```
Install with docker compose
```
docker-compose up -d
```
verify the app is running
```
docker ps
```

## Define Types and Devices

You're going to need a database interface tool, select one you're comfortable with, we recommend Jetbrains DataGrip.
Connect the interface to your database with the credentials specified in the installation command.
You can find 4 tables in the `pollution_heatmap` schema. You should fill the type table and device table yourself. The fetching mechanism will look into these two tables to start the fetching process, as long as they are empty fetching won't start.
![image](https://user-images.githubusercontent.com/5804816/204128804-c13d85de-bbf4-47ac-a6d3-6e59d44fc486.png)

You should fill up the tables with following data. These records might change through time so please verify with Hibou API.
* type

```
1,temperature
2,pressure
3,humidity
4,light
5,ultrav
6,particleavg
```

* device
```
28,02_ComputerLab_012_Near,ssd_42C322,271,270
29,12_Guthrie_028_Door,ssd_432541,348,546
30,11_LOST,ssd_432971,,
31,10_LOST,ssd_432B02,,
32,05_KitchenArea_034_Fridge,ssd_432F60,440,441
33,09_ComputerLab_014,ssd_4336AB,219,279
34,06_LOST,ssd_434946,,
35,04_Guthrie_Foyer_025,ssd_434B9F,226,487
36,01_ComputerLab_012_Far,ssd_4352F4,270,124
37,08_ComputerLab_013,ssd_43344A,225,211
38,03_ComputerLab_019,ssd_4350B8,337,343
39,07_LT_022_Door,ssd_435C70,405,333
40,53_Foyer_DoorOutside,ssd_60C52B,147,340
41,50_Foyer_DoorInside,ssd_60DC3A,179,339
42,51_PlantRoom_Outside,ssd_6086A7,,
43,52_Foyer_Lifts,ssd_60FD8B,,
44,55_PlantRoom_Inside,ssd_594739,,
45,54_HarrisStreet,ssd_36B017,56,292
46,20_ComputerLab_015,ssd_056EB5,318,81
47,21_ComputerLab_016,ssd_056EF9,379,129
48,22_ComputerLab_017,ssd_05500B,382,210
49,23_StudyArea_050,ssd_057DC6,475,384
50,24_Classroom_051,ssd_056EBE,598,268
51,25_Classroom_052,ssd_0589C3,598,231
52,26_Classroom_053,ssd_0544AA,602,146
53,27_LT_056,ssd_0565F6,453,43
54,28_LT_022_Front,ssd_058F31,410,258
55,29_GuthrieLT_028_Front,ssd_056E8B,207,651
```

Note: the location_x and location_y columns are pixel location of the sensors on the corresponding UI canvas on client dashboard.

After filling these two tables the fetching process will start.
The sensor data is saved in `sensor` table and the log of progress is saved in `sync_log` table. It is a slow fetching process as we don't want to encounter `too many requests` error from Hibou API.
The fetching starts at `1 September 2022`, in order to change it you should look for `let from = new Date("2022-09-01")` in the code at `/src/fetch/Fetch.ts`.

In case something is wrong with the data recorded in the sensor table, after you fixed the issue in code, you can remove the sync_log for that particular corrupted data and the fetching for that data will restart. Note that there's the code never updates the sensor table records so make sure you removed the corrupted data too.
