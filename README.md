# Smart Transportation System Simulation

## Overview

This project simulates a personal rapid transit system with self-driving cars, focusing on station placements and user accessibility. The simulation uses real-time visualization to display the movement of cars between various stations.

## Features

- Simulates car movements between predefined stations.
- Provides real-time updates and visualization using Dash and Dash-Leaflet.
- Calculates and displays travel times and wait times for each rider.
- Updates the map dynamically to show car movements.

## Installation

### Prerequisites

- Python 3.7+
- pip

### Install Required Libraries

```sh
pip install dash dash-core-components dash-html-components dash-bootstrap-components dash-leaflet simpy


## Running the simulation

- python3 app.py
- Navigate to http://127.0.0.1:8050/ in your web browser to view the interactive map.


## Simulation Details
Stations: The simulation uses the following stations in Eastern Contra Costa County:

Pittsburg Stations:
- Railroad Ave & E Leland Rd
- Railroad Ave & Central Ave
- E Leland Rd & Harbor St
- Railroad Ave & E 10th St

Antioch Stations:
- A St & W 10th St
- Lone Tree Way & Hillcrest Ave
- Deer Valley Rd & Lone Tree Way
- Davison Dr & Hillcrest Ave

Oakley Stations:
- Main St & Norcross Ln
- Main St & Empire Ave
- Main St & O'Hara Ave
- Laurel Rd & Empire Ave

Brentwood Stations:
- Balfour Rd & Walnut Blvd
- Balfour Rd & Griffith Ln
- Balfour Rd & John Muir Pkwy
- Brentwood Blvd & Sand Creek Rd

Simulation Parameters
- Number of Cars: 5
- Number of Riders: 10
- Simulation Time: 120 minutes (simulated) running for approximately 30 seconds (real-time)