let mapWidth = 800, mapHeight = 600;
let canvas, myLeafletMap;
let startButton, resetButton;

function setup() {
    console.log('Setup initialized'); // Debugging log
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

    // Add the start/pause button
    startButton = createButton('Start');
    startButton.position(10, 10);
    startButton.id('start-pause-button');
    startButton.mousePressed(toggleSimulation);
    console.log('Start button initialized'); // Debugging log

    // Add the reset button
    resetButton = createButton('Reset');
    resetButton.position(10, 50);
    resetButton.id('reset-button');
    resetButton.mousePressed(resetSimulation);
    console.log('Reset button initialized'); // Debugging log
}

function draw() {
    if (simulationRunning && !darkModeRunning) {
        clear();

        // Update current time
        currentTime += timeStep / targetFrameRate;
        if (currentTime >= 720) { // 720 minutes in 12 hours
            simulationRunning = false;
            noLoop();
            alert(`Simulation complete. Hours simulated: ${(currentTime / 60).toFixed(2)}`);
        }

        // Start predefined rides at the proper simulated times
        for (let ride of predefinedRides) {
            if (currentTime >= ride.time && !riders.some(r => r.startStation.name === ride.start && r.endStation.name === ride.end && r.name === ride.name)) {
                let startStation = stations.find(station => station.name === ride.start);
                let endStation = stations.find(station => station.name === ride.end);
                let riderId = riders.length;
                let rider = new Rider(riderId, ride.name, startStation, endStation);
                
                if (ride.start === ride.end) { // Instant completion for rides with same start and end station
                    rider.arrived = true;
                    rider.startTravelTime = currentTime;
                    rider.endTravelTime = currentTime;
                    let completedRide = {
                        id: rider.id,
                        name: rider.name,
                        startStation: rider.startStation.name,
                        endStation: rider.endStation.name,
                        rideStartTime: rider.startTravelTime,
                        rideTime: rider.getTravelTime(),
                        waitTime: rider.getWaitTime(),
                        carId: null // No car used for instant completion
                    };
                    completedRides.push(completedRide);
                    console.log("Completed ride:", completedRide); // Log the completed ride to the console
                } else {
                    riders.push(rider);
                    console.log(`Starting ride ${riderId} from ${ride.start} to ${ride.end} at time ${ride.time} minutes`);
                    changeStationMarkerColor(startStation, "yellow");
                    changeStationMarkerColor(endStation, "yellow");
                }
            }
        }

        // Update and draw cars
        for (let car of cars) {
            car.update();
        }

        // Allocate cars to waiting riders
        for (let rider of riders) {
            if (!rider.inCar && !rider.arrived) {
                let closestCar = null;
                let minDistance = Infinity;
                let waitingRiders = riders.filter(r => r.startStation.name === rider.startStation.name && !r.inCar && !r.arrived);

                // Shuffle the array to randomly choose the order
                for (let i = waitingRiders.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [waitingRiders[i], waitingRiders[j]] = [waitingRiders[j], waitingRiders[i]];
                }

                for (let car of cars) {
                    if (!car.moving && car.waitTime <= 0) {
                        let distance = p5.Vector.dist(car.position, mapCoordsToCanvas(rider.startStation.lat, rider.startStation.lon));
                        if (distance < minDistance) {
                            closestCar = car;
                            minDistance = distance;
                        }
                    }
                }

                if (closestCar) {
                    for (let waitingRider of waitingRiders) {
                        if (closestCar.hasReachedStation(waitingRider.startStation)) {
                            closestCar.assignRider(waitingRider);
                            changeStationMarkerColor(waitingRider.startStation, "red");
                            changeStationMarkerColor(waitingRider.endStation, "red");
                            break;
                        } else {
                            closestCar.moveTo(waitingRider.startStation);
                        }
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
