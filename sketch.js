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
  let numCars = 5;
  let numRiders = 10;
  let currentTime = 0; // in minutes, 0 to 1440 for 24 hours
  let timeStep = 6; // 6 minutes per frame to simulate 24 hours in 5 minutes of real time
  let startTime = 8 * 60; // Start at 8:00 AM
  let simulationRunning = true;
  let targetFrameRate = 30; // Target frame rate in frames per second
  
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
      L.marker([station.lat, station.lon]).addTo(myMap)
        .bindPopup(station.name);
    }
  
    initializeSimulation();
  }
  
  function draw() {
    if (simulationRunning) {
      clear();
  
      // Update current time
      currentTime += timeStep / targetFrameRate;
      if (currentTime >= 1440) {
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
  
  function updateOverlay() {
    let overlay = document.getElementById('overlay');
    let currentTimeStr = new Date((currentTime + startTime) * 60 * 1000).toISOString().substr(11, 5);
    let overlayText = `<strong>Current Time:</strong> ${currentTimeStr}<br><strong>Riders:</strong><br>`;
    for (let rider of riders) {
      overlayText += `Rider ${rider.id}: `;
      if (rider.inCar) {
        overlayText += `Traveling to ${rider.endStation.name}<br>`;
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
  
    // Create cars at random stations
    for (let i = 0; i < numCars; i++) {
      let station = random(stations);
      cars.push(new Car(i, station));
    }
  
    // Create riders at random stations with random destinations
    for (let i = 0; i < numRiders; i++) {
      let startStation = random(stations);
      let endStation = random(stations.filter(station => station !== startStation));
      riders.push(new Rider(i, startStation, endStation));
    }
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
    }
  
    assignRider(rider) {
      this.rider = rider;
      this.destinationStation = rider.endStation;
      rider.inCar = true;
      let endPos = mapCoordsToCanvas(this.destinationStation.lat, this.destinationStation.lon);
      this.direction = p5.Vector.sub(endPos, this.position).normalize().mult(this.speed);
      this.moving = true;
    }
  
    update() {
        if (this.moving) {
          this.position.add(this.direction);
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
        fill(255, 0, 0);
        ellipse(this.position.x, this.position.y, 15, 15);
        if (this.rider) {
          fill(0);
          textAlign(CENTER, CENTER);
          text(this.rider.id, this.position.x, this.position.y);
        }
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
    
  