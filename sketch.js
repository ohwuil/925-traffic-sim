let mapWidth = 800, mapHeight = 600;
let canvas, myLeafletMap;

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
        if (currentTime >= 720) {
            simulationRunning = false;
            noLoop();
        }

        // Check if it's time to add the second rider
        // if (currentTime >= 2 && !riders.some(r => r.id === 1)) {
        //     addSecondRider();
        //     let secondRider = riders.find(r => r.id === 1);
        //     changeStationMarkerColor(secondRider.startStation, "red");
        //     changeStationMarkerColor(secondRider.endStation, "red");
        // }

        // Update and draw cars
        for (let car of cars) {
            car.update();
        }

        // Allocate cars to waiting riders
        for (let car of cars) {
            if (!car.moving && riders.length > 0) {
                let waitingRider = riders.find(rider => !rider.inCar && !rider.arrived);
                if (waitingRider) {
                    if (car.currentStation === waitingRider.startStation) {
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
