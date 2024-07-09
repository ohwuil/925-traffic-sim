let stations = [
    // Pittsburg
    { name: "Railroad Ave & E Leland Rd", lat: 38.0169, lon: -121.8854 },
    { name: "Railroad Ave & Central Ave", lat: 38.0139, lon: -121.8893 },
    { name: "E Leland Rd & Harbor St", lat: 38.0141, lon: -121.8845 },
    { name: "Railroad Ave & E 10th St", lat: 38.0085, lon: -121.8921 },
    // Antioch
    { name: "A St & W 10th St", lat: 38.0020, lon: -121.8067 },
    { name: "Lone Tree Way & Hillcrest Ave", lat: 37.9817, lon: -121.8058 },
    { name: "Deer Valley Rd & Lone Tree Way", lat: 37.9785, lon: -121.7962 },
    { name: "Davison Dr & Hillcrest Ave", lat: 37.9799, lon: -121.7822 },
    // Oakley
    { name: "Main St & Norcross Ln", lat: 37.9989, lon: -121.7483 },
    { name: "Main St & Empire Ave", lat: 37.9964, lon: -121.7373 },
    { name: "Main St & O'Hara Ave", lat: 37.9960, lon: -121.7297 },
    { name: "Laurel Rd & Empire Ave", lat: 37.9973, lon: -121.7324 },
    // Brentwood
    { name: "Balfour Rd & Walnut Blvd", lat: 37.9271, lon: -121.7142 },
    { name: "Balfour Rd & Griffith Ln", lat: 37.9256, lon: -121.7033 },
    { name: "Balfour Rd & John Muir Pkwy", lat: 37.9233, lon: -121.6874 },
    { name: "Brentwood Blvd & Sand Creek Rd", lat: 37.9234, lon: -121.7020 }
];

// Define connections between stations (as paths)
let connections = [
    ["Railroad Ave & E Leland Rd", "Railroad Ave & Central Ave"],
    ["Railroad Ave & Central Ave", "E Leland Rd & Harbor St"],
    ["E Leland Rd & Harbor St", "Railroad Ave & E 10th St"],
    ["Railroad Ave & E 10th St", "A St & W 10th St"],
    ["A St & W 10th St", "Lone Tree Way & Hillcrest Ave"],
    ["Lone Tree Way & Hillcrest Ave", "Deer Valley Rd & Lone Tree Way"],
    ["Deer Valley Rd & Lone Tree Way", "Davison Dr & Hillcrest Ave"],
    ["Davison Dr & Hillcrest Ave", "Main St & Norcross Ln"],
    ["Main St & Norcross Ln", "Main St & Empire Ave"],
    ["Main St & Empire Ave", "Main St & O'Hara Ave"],
    ["Main St & O'Hara Ave", "Laurel Rd & Empire Ave"],
    ["Laurel Rd & Empire Ave", "Balfour Rd & Walnut Blvd"],
    ["Balfour Rd & Walnut Blvd", "Balfour Rd & Griffith Ln"],
    ["Balfour Rd & Griffith Ln", "Balfour Rd & John Muir Pkwy"],
    ["Balfour Rd & John Muir Pkwy", "Brentwood Blvd & Sand Creek Rd"]
];

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
        this.rider = rider;
        this.destinationStation = rider.endStation;
        rider.inCar = true;
        rider.startTravelTime = currentTime; // Track the start of the travel time
        this.setPathTo(this.destinationStation);
        this.moving = true;
    }

    moveTo(station) {
        this.destinationStation = station;
        this.setPathTo(this.destinationStation);
        this.moving = true;
    }

    setPathTo(station) {
        this.path = this.calculatePath(this.currentStation, station);
        this.pathIndex = 0;
        if (this.path.length > 1) {
            this.direction = p5.Vector.sub(this.path[1], this.path[0]).normalize().mult(this.speed);
        } else {
            this.direction = createVector(0, 0);
        }
    }

    calculatePath(startStation, endStation) {
        // Use connections to find path between startStation and endStation
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
            visited.add(currentStation);
            for (let connection of connections) {
                let nextStation = null;
                if (connection[0] === currentStation.name) {
                    nextStation = stations.find(station => station.name === connection[1]);
                } else if (connection[1] === currentStation.name) {
                    nextStation = stations.find(station => station.name === connection[0]);
                }
                if (nextStation && !visited.has(nextStation)) {
                    queue.push([...currentPath, nextStation]);
                }
            }
        }
        return path;
    }

    update() {
        if (this.moving && this.path.length > 0) {
            this.position.add(this.direction);
            this.marker.setLatLng(mapCoordsToLatLng(this.position));
            let nextPos = this.path[this.pathIndex + 1];
            if (p5.Vector.dist(this.position, nextPos) < this.speed) {
                this.pathIndex++;
                if (this.pathIndex < this.path.length - 1) {
                    this.direction = p5.Vector.sub(this.path[this.pathIndex + 1], this.path[this.pathIndex]).normalize().mult(this.speed);
                } else {
                    this.moving = false;
                    if (this.rider) {
                        changeStationMarkerColor(this.rider.startStation, "blue");
                        changeStationMarkerColor(this.rider.endStation, "blue");
                        this.rider.inCar = false;
                        this.rider.arrived = true;  // Mark the rider as arrived
                        this.rider = null;
                    }
                    this.currentStation = this.destinationStation;
                    this.destinationStation = null;

                    // Check for next rider after completing current ride
                    let nextRider = riders.find(rider => !rider.inCar && rider.startStation === this.currentStation && !rider.arrived);
                    if (nextRider) {
                        this.assignRider(nextRider);
                        changeStationMarkerColor(nextRider.startStation, "red");
                        changeStationMarkerColor(nextRider.endStation, "red");
                    } else {
                        // Move to start station of second rider if available
                        let secondRider = riders.find(rider => rider.id === 1 && !rider.inCar && !rider.arrived);
                        if (secondRider) {
                            this.moveTo(secondRider.startStation);
                        }
                    }
                }
            }
        }
    }

    display() {
        // Visualization handled by marker update
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
    }

    update() {
        if (!this.inCar && !this.arrived) {
            // Update the wait time for the rider
            this.waitTime = currentTime - this.waitStartTime;
        }
    }

    display() {
        if (!this.inCar && !this.arrived) {
            fill(0, 100, 255);
            ellipse(this.position.x, this.position.y, 10, 10);
            fill(0);
            textAlign(CENTER, CENTER);
            text(this.id, this.position.x, this.position.y);
        }
    }
}

function initializeSimulation() {
    cars = [];
    riders = [];
    currentTime = 0;
    simulationRunning = true;

    // Create one car at the start station
    let startStation = stations.find(station => station.name === "Brentwood Blvd & Sand Creek Rd");
    cars.push(new Car(0, startStation));

    // Create one rider at the start station with a specific destination
    let endStation = stations.find(station => station.name === "Main St & Norcross Ln");
    riders.push(new Rider(0, startStation, endStation));
}

function addSecondRider() {
    let startStation = stations.find(station => station.name === "Railroad Ave & Central Ave");
    let endStation = stations.find(station => station.name === "Balfour Rd & Walnut Blvd");
    riders.push(new Rider(1, startStation, endStation));
}

function restartSimulation() {
    initializeSimulation();
    loop();
}

function changeStationMarkerColor(station, color) {
    let markerIcon = color === "red" ? redMarkerIcon : blueMarkerIcon;
    station.marker.setIcon(markerIcon);
}

function updateOverlay() {
    let overlay = document.getElementById('overlay');
    let currentTimeStr = new Date((currentTime + startTime) * 60 * 1000).toISOString().substr(11, 5);
    let overlayText = `<strong>Current Time:</strong> ${currentTimeStr}<br><strong>Riders:</strong><br>`;
    for (let rider of riders) {
        overlayText += `Rider ${rider.id}: `;
        if (rider.arrived) {
            overlayText += `Arrived at ${rider.endStation.name}<br>`;
        } else if (rider.inCar) {
            overlayText += `Traveling from ${rider.startStation.name} to ${rider.endStation.name}, traveled ${(currentTime - rider.startTravelTime).toFixed(2)} minutes<br>`;
        } else {
            overlayText += `Waiting at ${rider.startStation.name} for ${(currentTime - rider.waitStartTime).toFixed(2)} minutes<br>`;
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

    overlay.innerHTML = overlayText;
}
