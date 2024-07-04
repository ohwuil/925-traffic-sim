let stations = [
    { name: "Railroad Ave & E Leland Rd", lat: 38.0176, lon: -121.8891 },
    { name: "Railroad Ave & Central Ave", lat: 38.0170, lon: -121.8925 },
    { name: "E Leland Rd & Harbor St", lat: 38.0181, lon: -121.8883 },
    { name: "Railroad Ave & E 10th St", lat: 38.0184, lon: -121.8971 },
    { name: "A St & W 10th St", lat: 38.0050, lon: -121.8091 },
    { name: "Lone Tree Way & Hillcrest Ave", lat: 37.9762, lon: -121.7978 },
    { name: "Deer Valley Rd & Lone Tree Way", lat: 37.9814, lon: -121.7803 },
    { name: "Davison Dr & Hillcrest Ave", lat: 37.9876, lon: -121.7808 },
    { name: "Main St & Norcross Ln", lat: 38.0059, lon: -121.7488 },
    { name: "Main St & Empire Ave", lat: 38.0071, lon: -121.7318 },
    { name: "Main St & O'Hara Ave", lat: 38.0076, lon: -121.7191 },
    { name: "Laurel Rd & Empire Ave", lat: 38.0121, lon: -121.7315 },
    { name: "Balfour Rd & Walnut Blvd", lat: 37.9275, lon: -121.7278 },
    { name: "Balfour Rd & Griffith Ln", lat: 37.9264, lon: -121.7179 },
    { name: "Balfour Rd & John Muir Pkwy", lat: 37.9237, lon: -121.6985 },
    { name: "Brentwood Blvd & Sand Creek Rd", lat: 37.9161, lon: -121.6997 }
  ];
  
  let cars = [];
  let riders = [];
  let myMap;
  let canvas;
  let minLat = 37.9161, maxLat = 38.0184;
  let minLon = -121.8971, maxLon = -121.6985;
  let mapWidth = 800, mapHeight = 600;
  let numCars = 1;
  let numRiders = 1;
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
  
  function setup() {
    frameRate(targetFrameRate);
    canvas = createCanvas(mapWidth, mapHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '400');
    myMap = L.map('map').setView([37.9762, -121.7978], 12);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
  
    // Add markers for stations
    for (let station of stations) {
      let markerColor = "blue";
      if (station.name === "Brentwood Blvd & Sand Creek Rd" || station.name === "Main St & Norcross Ln") {
        markerColor = "red";
      }
      let markerIcon = L.icon({
        iconUrl: `https://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
      L.marker([station.lat, station.lon], { icon: markerIcon }).addTo(myMap)
        .bindPopup(station.name);
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
  
      // Update and draw cars
      for (let car of cars) {
        car.update();
        car.display();
      }
  
      // Display riders
      for (let rider of riders) {
        rider.update();
        rider.display();
      }
  
      // Allocate cars to waiting riders
      for (let car of cars) {
        if (!car.moving && riders.length > 0) {
          let waitingRider = riders.find(rider => !rider.inCar);
          if (waitingRider) {
            car.assignRider(waitingRider);
          }
        }
      }
  
      // Update overlay
      updateOverlay();
    }
  }
  
  function mapCoordsToCanvas(lat, lon) {
    let point = myMap.latLngToLayerPoint([lat, lon]);
    return createVector(point.x, point.y);
  }
  
  function mapCoordsToLatLng(vector) {
    let latLng = myMap.layerPointToLatLng([vector.x, vector.y]);
    return [latLng.lat, latLng.lng];
  }
  
  function updateOverlay() {
    let overlay = document.getElementById('overlay');
    let currentTimeStr = new Date((currentTime + startTime) * 60 * 1000).toISOString().substr(11, 5);
    let overlayText = `<strong>Current Time:</strong> ${currentTimeStr}<br><strong>Riders:</strong><br>`;
    for (let rider of riders) {
      overlayText += `Rider ${rider.id}: `;
      if (rider.inCar) {
        overlayText += `Traveling to ${rider.endStation.name}, traveled ${(currentTime - rider.startTravelTime).toFixed(2)} minutes<br>`;
      } else {
        overlayText += `Waiting at ${rider.startStation.name} for ${(currentTime - rider.waitStartTime).toFixed(2)} minutes<br>`;
      }
    }
    
    overlayText += `<br><strong>Cars:</strong><br>`;
    for (let car of cars) {
      overlayText += `Car ${car.id}: `;
      if (car.moving) {
        overlayText += `Traveling to ${car.destinationStation.name} from ${car.currentStation.name}<br>`;
      } else {
        overlayText += `At ${car.currentStation.name}<br>`;
      }
    }
  
    overlay.innerHTML = overlayText;
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
  
  function restartSimulation() {
    initializeSimulation();
    loop();
  }
  
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
      this.marker = L.marker(mapCoordsToLatLng(this.position), { icon: carIcon }).addTo(myMap);
    }
  
    assignRider(rider) {
      this.rider = rider;
      this.destinationStation = rider.endStation;
      rider.inCar = true;
      rider.startTravelTime = currentTime; // Track the start of the travel time
      let endPos = mapCoordsToCanvas(this.destinationStation.lat, this.destinationStation.lon);
      this.direction = p5.Vector.sub(endPos, this.position).normalize().mult(this.speed);
      this.moving = true;
    }
  
    update() {
      if (this.moving) {
        this.position.add(this.direction);
        this.marker.setLatLng(mapCoordsToLatLng(this.position));
        let endPos = mapCoordsToCanvas(this.destinationStation.lat, this.destinationStation.lon);
        if (p5.Vector.dist(this.position, endPos) < this.speed) {
          this.position = endPos;
          this.moving = false;
          if (this.rider) {
            this.rider.inCar = false;
            this.rider = null;
          }
          this.currentStation = this.destinationStation;
          this.destinationStation = null;
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
      this.position = mapCoordsToCanvas(startStation.lat, startStation.lon);
      this.waitStartTime = currentTime;
    }
  
    update() {
      if (!this.inCar) {
        // Update the wait time for the rider
        this.waitTime = currentTime - this.waitStartTime;
      }
    }
  
    display() {
      if (!this.inCar) {
        fill(0, 100, 255);
        ellipse(this.position.x, this.position.y, 10, 10);
        fill(0);
        textAlign(CENTER, CENTER);
        text(this.id, this.position.x, this.position.y);
      }
    }
  }
  