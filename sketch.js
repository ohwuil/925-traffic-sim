let mapWidth = 800, mapHeight = 600;
let canvas, myLeafletMap;

let predefinedRides = [
    { time: 0, start: "A", end: "Z" },
    { time: 1, start: "G", end: "AA" },
    { time: 2, start: "BB", end: "AR" }
];

function setup() {
    frameRate(targetFrameRate);
    canvas = createCanvas(mapWidth, mapHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '400');
    myLeafletMap = L.map('map', { zoomControl: true, dragging: true }).setView([37.9762, -121.7978], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myLeafletMap);

    // Add markers for stations
    for (let station of stations) {
        let markerIcon = blueMarkerIcon;
        let marker = L.marker([station.lat, station.lon], { icon: markerIcon }).addTo(myLeafletMap)
            .bindPopup(station.name);
        station.marker = marker;  // Save the marker reference in the station object
    }

    // Draw connections between stations
    for (let connection of connections) {
        let startStation = stations.find(station => station.name === connection[0]);
        let endStation = stations.find(station => station.name === connection[1]);
        if (startStation && endStation) {
            L.polyline([[startStation.lat, startStation.lon], [endStation.lat, endStation.lon]], { color: 'blue' }).addTo(myLeafletMap);
        }
    }

    initializeSimulation();
}

function draw() {
    if (simulationRunning) {
        clear();

        // Update current time
        currentTime += timeStep / targetFrameRate;
        if (currentTime >= 720) { // 720 minutes in 12 hours
            simulationRunning = false;
            noLoop();
        }

        // Log the current time
        console.log(`Current Time: ${currentTime.toFixed(2)} minutes`);

        // Start predefined rides at the proper simulated times
        for (let ride of predefinedRides) {
            if (currentTime >= ride.time && !riders.some(r => r.startStation.name === ride.start && r.endStation.name === ride.end)) {
                let startStation = stations.find(station => station.name === ride.start);
                let endStation = stations.find(station => station.name === ride.end);
                let riderId = riders.length;
                riders.push(new Rider(riderId, startStation, endStation));
                console.log(`Starting ride ${riderId} from ${ride.start} to ${ride.end} at time ${ride.time} minutes`);
                changeStationMarkerColor(startStation, "yellow");
                changeStationMarkerColor(endStation, "yellow");
            }
        }

        // Update and draw cars
        for (let car of cars) {
            car.update();
        }

        // Allocate cars to waiting riders
        for (let car of cars) {
            if (!car.moving && riders.length > 0) {
                let waitingRider = riders.find(rider => !rider.inCar && !rider.arrived);
                if (waitingRider) {
                    if (car.hasReachedStation(waitingRider.startStation)) {
                        car.assignRider(waitingRider);
                        changeStationMarkerColor(waitingRider.startStation, "red");
                        changeStationMarkerColor(waitingRider.endStation, "red");
                    } else {
                        car.moveTo(waitingRider.startStation);
                    }
                }
            }
        }

        // Update overlay
        updateOverlay();
    }
}

function mapCoordsToCanvas(lat, lon) {
    let point = myLeafletMap.latLngToLayerPoint([lat, lon]);
    return createVector(point.x, point.y);
}

function mapCoordsToLatLng(vector) {
    let latLng = myLeafletMap.layerPointToLatLng([vector.x, vector.y]);
    return [latLng.lat, latLng.lng];
}
