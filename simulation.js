let stations = [
    { name: "A", lat: 38.01699345044407, lon: -121.94638573082345 }, // Bay Point (Bart)
    { name: "B", lat: 38.01837994162642, lon: -121.95760346848552 },
    { name: "C", lat: 38.01973230013453, lon: -121.96459866921425 },  
    { name: "D", lat: 38.026595134855945, lon: -121.95498563262994 },  
    { name: "E", lat: 38.02673035666877, lon: -121.94545842672945 }, 
    { name: "F", lat: 38.02666274580736, lon: -121.93923570170942 }, 
    { name: "G", lat: 38.02689549995812, lon: -121.9321178052867 }, 
    { name: "H", lat: 38.02689938359431, lon: -121.92610360658814 }, 
    { name: "I", lat: 38.02967136956211, lon: -121.91104032020498 }, 
    { name: "J", lat: 38.03149676632553, lon: -121.90674878601556 }, 
    { name: "K", lat: 38.03197000991321, lon: -121.90069772280849 }, 
    { name: "L", lat: 38.03261226412525, lon: -121.8833170083404 }, // Pittsburg
    { name: "M", lat: 38.02635849624187, lon:  -121.88610650556352 }, 
    { name: "N", lat: 38.02108463378863, lon: -121.88778020400991 }, 
    { name: "O", lat: 38.01695993843636, lon: -121.8895826483695 }, // Pittsburg Center Bart
    { name: "P", lat: 38.01259832763476, lon: -121.89099885474108 },
    { name: "Q", lat: 38.0113134625897, lon: -121.88597775973945 },
    { name: "R", lat: 38.01107677446706, lon: -121.88580609837187 },
    { name: "S", lat: 38.01002857493957, lon: -121.88155747896411 },
    { name: "T", lat: 38.00921705539965, lon: -121.87636472259491 },
    { name: "U", lat: 38.0084055268009, lon: -121.87164403474979 },
    { name: "V", lat: 38.00823645722786, lon: -121.86692334714142 },
    { name: "W", lat: 38.00806738726494, lon: -121.86078645325057 }, // LMC
    // antioch
    { name: "X", lat: 38.00378938397287, lon: -121.85056791253373 }, // Turner Elementary School
    { name: "Y", lat: 38.00331720142464, lon: -121.84540926125906 }, // Sommersville Town Center 1
    { name: "Z", lat: 38.00329667167967, lon: -121.83806209126182 }, // Sommersville Town Center 2
    { name: "AA", lat: 38.00596549034543, lon: -121.83464904382069 }, // Lowe's home improvement
    { name: "AB", lat: 38.01078964686703, lon: -121.83045438256431 }, 
    { name: "AC", lat: 38.015757169897796, lon: -121.82026734853966 }, 
    { name: "AD", lat: 38.01787134405292, lon: -121.81609874144903 }, // Antioch/Pittsburg Amtrak station 
    { name: "AE", lat: 38.01707083871175, lon: -121.81109641252044 }, 
    { name: "AF", lat: 38.00958262249506, lon: -121.80581586558077 }, 
    { name: "AG", lat: 38.006076205786805, lon: -121.80609184583933 }, 
    { name: "AH", lat: 38.00509764096123, lon: -121.80243510741363 }, 
    { name: "AI", lat: 38.00485299771418, lon: -121.78853260188956 }, 
    { name: "AJ", lat: 37.99596526145414, lon: -121.78069165047567 }, 
    // Oakley
    { name: "AK", lat: 37.99323616265046, lon: -121.75833942391635 }, 
    // AK connets to both AL and AM
    { name: "AL", lat: 37.983608625886056, lon: -121.7424867043436}, 
    { name: "AM", lat: 37.97976240057517, lon: -121.74080766373412}, 
    { name: "AN", lat: 37.98311235002304, lon: -121.7323599914176}, 
    { name: "AO", lat: 37.986875691066096, lon: -121.71457265653993}, 
    { name: "AP", lat: 37.99072154357454, lon: -121.70617745334363},  
    { name: "AQ", lat: 37.99502204295972, lon: -121.7053904031278}, 
    { name: "AR", lat: 37.99795781599213, lon: -121.7126312651134},
    // AM connets to AS and through the Brentwood line
    { name: "AS", lat: 37.97393064214193, lon: -121.73645265215873},
    // Brentwood 
    { name: "AT", lat: 37.96966071934799, lon: -121.7352040878904},
    { name: "AU", lat: 37.96528540012603, lon: -121.73657255611303},
    { name: "AV", lat: 37.96210863513287, lon: -121.7411341168551},
    { name: "AW", lat: 37.96151907242513, lon: -121.75097818623304},
    { name: "AX", lat: 37.95767631036896, lon: -121.74992696372814}, 
    { name: "AY", lat: 37.95496365143684, lon: -121.74677329551652}, 
    { name: "AZ", lat: 37.950857083949174, lon: -121.74805319767091}, 
    { name: "BA", lat: 37.947563068616994, lon: -121.74306367607852}, 
    { name: "BB", lat: 37.94545848150268, lon: -121.74120710990465} // AMC Brentwood  

];

// Define connections between stations (as paths)
let connections = [
    ["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], 
    // Assuming direct connections between "E" and "AK" for simplicity
    ["E", "F"], ["F", "G"], ["G", "H"], ["H", "I"], ["I", "J"], 
    ["J", "K"], ["K", "L"], ["L", "M"], ["M", "N"], ["N", "O"], 
    ["O", "P"], ["P", "Q"], ["Q", "R"], ["R", "S"], ["S", "T"], 
    ["T", "U"], ["U", "V"], ["V", "W"], ["W", "X"], ["X", "Y"], 
    ["Y", "Z"], ["Z", "AA"], ["AA", "AB"], ["AB", "AC"], ["AC", "AD"], 
    ["AD", "AE"], ["AE", "AF"], ["AF", "AG"], ["AG", "AH"], ["AH", "AI"], 
    ["AI", "AJ"], ["AJ", "AK"],
    // Path 1 from AK
    ["AK", "AL"], ["AL", "AN"], ["AN", "AO"], ["AO", "AP"], ["AP", "AQ"], ["AQ", "AR"],
    // Path 2 from AK
    ["AK", "AM"], ["AM", "AS"], ["AS", "AT"], ["AT", "AU"], ["AU", "AV"], ["AV", "AW"], ["AW", "AX"], ["AX", "AY"], ["AY", "AZ"], ["AZ", "BA"], ["BA", "BB"]
];

for (let connection of connections) {
    let startStation = stations.find(station => station.name === connection[0]);
    let endStation = stations.find(station => station.name === connection[1]);
    if (!startStation || !endStation) {
        console.error(`Invalid connection: ${connection[0]} to ${connection[1]}`);
    }
}

let cars = [];
let riders = [];
let numCars = 1;
let currentTime = 0; // in minutes, 0 to 720 for 12 hours (8am to 8pm)
let timeStep = 1.2; // 1.2 minutes per frame to simulate 12 hours in 10 minutes of real time
let startTime = 8 * 60; // Start at 8:00 AM
let simulationRunning = true;
let targetFrameRate = 60; // Target frame rate in frames per second

let carIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/cabs.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

let blueMarkerIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

let redMarkerIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

let yellowMarkerIcon = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

class Car {
    constructor(id, startStation) {
        this.id = id;
        this.position = mapCoordsToCanvas(startStation.lat, startStation.lon);
        this.currentStation = startStation;
        this.destinationStation = null;
        this.direction = createVector(0, 0);
        this.speed = 2;
        this.moving = false;
        this.rider = null;
        this.marker = L.marker(mapCoordsToLatLng(this.position), { icon: carIcon }).addTo(myLeafletMap);
        this.path = [];
        this.pathIndex = 0;
    }

    assignRider(rider) {
        console.log(`Assigning rider ${rider.id} to car ${this.id}`);
        this.rider = rider;
        this.destinationStation = rider.endStation;
        rider.inCar = true;
        rider.startTravelTime = currentTime; // Track the start of the travel time
        this.setPathTo(this.destinationStation);
        this.moving = true;
    }

    moveTo(station) {
        console.log(`Moving car ${this.id} to station ${station.name}`);
        this.destinationStation = station;
        this.setPathTo(this.destinationStation);
        this.moving = true;
    }

    setPathTo(station) {
        console.log(`Setting path for car ${this.id} to station ${station.name}`);
        this.path = this.calculatePath(this.currentStation, station);
        this.pathIndex = 0;
        if (this.path.length > 1) {
            this.direction = p5.Vector.sub(this.path[1], this.path[0]).normalize().mult(this.speed);
        } else {
            this.direction = createVector(0, 0);
        }
        console.log(`Path for car ${this.id}:`, this.path);
    }

    calculatePath(startStation, endStation) {
        console.log(`Calculating path from ${startStation.name} to ${endStation.name}`);
        let path = [];
        let visited = new Set();
        let queue = [[startStation]];

        while (queue.length > 0) {
            let currentPath = queue.shift();
            let currentStation = currentPath[currentPath.length - 1];

            if (currentStation === endStation) {
                for (let station of currentPath) {
                    path.push(mapCoordsToCanvas(station.lat, station.lon));
                }
                break;
            }

            visited.add(currentStation.name);

            for (let connection of connections) {
                let nextStation = null;
                if (connection[0] === currentStation.name) {
                    nextStation = stations.find(station => station.name === connection[1]);
                } else if (connection[1] === currentStation.name) {
                    nextStation = stations.find(station => station.name === connection[0]);
                }

                if (nextStation && !visited.has(nextStation.name)) {
                    queue.push([...currentPath, nextStation]);
                    visited.add(nextStation.name); // Ensure we don't re-add this station
                }
            }
        }

        if (path.length === 0) {
            console.log(`No path found from ${startStation.name} to ${endStation.name}`);
        } else {
            console.log(`Path for car ${this.id}:`, path);
        }

        return path;
    }

    update() {
        if (this.moving && this.path.length > 0) {
            let nextPos = this.path[this.pathIndex + 1];
            if (!nextPos) {
                console.error(`Car ${this.id} has no next position to move to.`);
                this.moving = false;
                return;
            }

            let distanceToNext = p5.Vector.dist(this.position, nextPos);

            // If the car is very close to the next position, snap to the next position
            if (distanceToNext < this.speed) {
                this.position = nextPos.copy(); // Snap to the next position
                this.pathIndex++;
                if (this.pathIndex < this.path.length - 1) {
                    this.direction = p5.Vector.sub(this.path[this.pathIndex + 1], this.path[this.pathIndex]).normalize().mult(this.speed);
                } else {
                    this.moving = false;
                    this.currentStation = this.destinationStation;
                    this.destinationStation = null;

                    if (this.rider) {
                        changeStationMarkerColor(this.rider.startStation, "blue");
                        changeStationMarkerColor(this.rider.endStation, "blue");
                        this.rider.inCar = false;
                        this.rider.arrived = true;
                        this.rider.endTravelTime = currentTime;
                        this.rider = null;
                    }

                    // Check for next rider after completing current ride
                    let nextRider = riders.find(rider => !rider.inCar && rider.startStation === this.currentStation && !rider.arrived);
                    if (nextRider) {
                        this.assignRider(nextRider);
                        changeStationMarkerColor(nextRider.startStation, "red");
                        changeStationMarkerColor(nextRider.endStation, "red");
                    }
                }
            } else {
                this.position.add(this.direction);
                this.marker.setLatLng(mapCoordsToLatLng(this.position));
            }
        }
    }

    display() {
        // Visualization handled by marker update
    }

    hasReachedStation(station) {
        return this.currentStation === station && !this.moving;
    }
}


class Rider {
    constructor(id, startStation, endStation) {
        this.id = id;
        this.startStation = startStation;
        this.endStation = endStation;
        this.inCar = false;
        this.arrived = false;
        this.position = mapCoordsToCanvas(startStation.lat, startStation.lon);
        this.waitStartTime = currentTime;
        this.startTravelTime = null;
        this.endTravelTime = null;
    }

    update() {
        if (!this.inCar && !this.arrived) {
            this.waitTime = currentTime - this.waitStartTime;
        }
    }

    getTravelTime() {
        return this.endTravelTime !== null ? this.endTravelTime - this.startTravelTime : null;
    }

    getWaitTime() {
        return this.endTravelTime !== null ? this.startTravelTime - this.waitStartTime : null;
    }
}

function initializeSimulation() {
    cars = [];
    riders = [];
    currentTime = 0;
    simulationRunning = true;

    // Initialize cars but without assigning any specific ride
    for (let i = 0; i < numCars; i++) {
        let startStation = stations[0]; // Starting all cars at the first station for simplicity
        cars.push(new Car(i, startStation));
    }
}

function restartSimulation() {
    initializeSimulation();
    loop();
}

function changeStationMarkerColor(station, color) {
    let markerIcon;
    if (color === "red") {
        markerIcon = redMarkerIcon;
    } else if (color === "yellow") {
        markerIcon = yellowMarkerIcon;
    } else {
        markerIcon = blueMarkerIcon;
    }
    station.marker.setIcon(markerIcon);
}

function updateOverlay() {
    let overlay = document.getElementById('overlay');
    let currentTimeStr = new Date((currentTime + startTime) * 60 * 1000).toISOString().substr(11, 5);
    let overlayText = `<strong>Current Time:</strong> ${currentTimeStr}<br><strong>Riders:</strong><br>`;
    let totalRideTime = 0;
    let totalWaitTime = 0;
    let totalRides = 0;
    let totalWaits = 0;

    for (let rider of riders) {
        overlayText += `Rider ${rider.id}: `;
        if (rider.arrived) {
            let travelTime = rider.getTravelTime();
            let waitTime = rider.getWaitTime();
            overlayText += `Arrived at ${rider.endStation.name}. Ride Time: ${travelTime.toFixed(2)} mins, Wait Time: ${waitTime.toFixed(2)} mins<br>`;
            if (travelTime !== null) {
                totalRideTime += travelTime;
                totalRides++;
            }
            if (waitTime !== null) {
                totalWaitTime += waitTime;
                totalWaits++;
            }
        } else if (rider.inCar) {
            overlayText += `Traveling from ${rider.startStation.name} to ${rider.endStation.name}, traveled ${(currentTime - rider.startTravelTime).toFixed(2)} mins<br>`;
        } else {
            overlayText += `Waiting at ${rider.startStation.name} for ${(currentTime - rider.waitStartTime).toFixed(2)} mins<br>`;
        }
    }

    overlayText += `<br><strong>Cars:</strong><br>`;
    for (let car of cars) {
        overlayText += `Car ${car.id}: `;
        if (car.moving) {
            overlayText += `Traveling from ${car.currentStation.name} to ${car.destinationStation.name}<br>`;
        } else {
            overlayText += `At ${car.currentStation.name}<br>`;
        }
    }

    if (totalRides > 0) {
        overlayText += `<br><strong>Statistics:</strong><br>`;
        overlayText += `Average Ride Time: ${(totalRideTime / totalRides).toFixed(2)} mins<br>`;
    }
    if (totalWaits > 0) {
        overlayText += `Average Wait Time: ${(totalWaitTime / totalWaits).toFixed(2)} mins<br>`;
    }

    overlay.innerHTML = overlayText;
}
