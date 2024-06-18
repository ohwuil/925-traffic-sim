# Smart Transportation System Simulation

## Overview

This project simulates a personal rapid transit system using Glydways vehicles. The simulation aims to optimize station placements, estimate potential ridership, and evaluate service efficiency. The simulation is built using Python and SimPy, a process-based discrete-event simulation framework.

## Stations

We are starting with five stations in the Concord, Walnut Creek, and Pleasant Hill areas:

1. **Broadway Plaza** (Walnut Creek)
   - A major shopping destination with over 80 stores and restaurants.
2. **Heather Farm Park** (Walnut Creek)
   - A large community park offering gardens, sports fields, a lake, and picnic areas.
3. **Sunvalley Shopping Center** (Concord)
   - A large indoor shopping mall with a wide variety of retail stores, dining options, and entertainment facilities.
4. **Woodlands** (Residential area)
   - A residential area in Walnut Creek.
5. **Limeridge** (Residential area)
   - A residential area in Concord.

## Simulation Details

- **Number of Glydways Vehicles (Glydcars)**: 5
- **Number of Riders**: 10

### Travel and Wait Time Calculation

- **Travel Time**: Calculated based on the distance between stations and the speed of the Glydways vehicles (30 mph).
- **Wait Time**: Riders may have to wait for an available vehicle if all vehicles are in use.

Distances between the stations (miles):
- Broadway Plaza to Heather Farm Park: 2.0 miles
- Heather Farm Park to Woodlands: 2.0 miles
- Woodlands to Limeridge: 2.5 miles
- Limeridge to Sunvalley Shopping Center: 3.0 miles
- Sunvalley Shopping Center to Broadway Plaza: 4.0 miles