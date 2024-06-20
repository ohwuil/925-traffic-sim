# simulation.py

import simpy
import random
import pandas as pd
from glydways_system import GlydwaysSystem
from utils import get_estimated_foot_traffic

def rider(env, glydways, rider_id, from_station, to_station):
    arrival_time = env.now
    # Allocate a vehicle
    car_id, car_travel_time = yield env.process(glydways.allocate_vehicle(from_station))
    with glydways.vehicles[car_id].request() as request:
        yield request
        wait_time = env.now - arrival_time + car_travel_time
        glydways.total_wait_time += wait_time
        glydways.rider_count += 1
        print(f"Rider {rider_id} traveling from {from_station} to {to_station} in {glydways.car_ids[car_id]} at time {glydways.time_format(env.now)}, waited for {wait_time:.2f} minutes")
        travel_time = yield env.process(glydways.travel(car_id, rider_id, from_station, to_station))
        glydways.car_locations[car_id] = to_station
        glydways.log[-1]['wait_time'] = wait_time
        print(f"{glydways.car_ids[car_id]} is now at {to_station} waiting for the next rider.")
        return travel_time

# Instantiate the system
initial_stations = ['Broadway Plaza', 'Heather Farm Park', 'Sunvalley Shopping Center', 'Woodlands', 'Limeridge']
env = simpy.Environment()
glydways = GlydwaysSystem(env, num_vehicles=5, initial_stations=initial_stations)

# Simulate riders based on estimated foot traffic
stations = ['Heather Farm Park', 'Broadway Plaza', 'Sunvalley Shopping Center', 'Woodlands', 'Limeridge']
rider_id = 0  # Initialize rider ID

for hour in range(8, 22):  # Simulate from 8 AM to 9 PM
    for station in stations:
        foot_traffic = get_estimated_foot_traffic(station, hour)
        for _ in range(foot_traffic):  # Create a rider for each estimated person
            from_station = station
            to_station = random.choice([s for s in stations if s != from_station])
            env.process(rider(env, glydways, rider_id, from_station, to_station))
            rider_id += 1

# Run the simulation
env.run(until=14*60)  # Simulate for 14 hours

# Save the logs to a DataFrame
log_df = pd.DataFrame(glydways.log)
log_df.to_csv('rider_logs.csv', index=False)

# Calculate and print the average wait time
if glydways.rider_count > 0:
    average_wait_time = glydways.total_wait_time / glydways.rider_count
    print(f"Average wait time: {average_wait_time:.2f} minutes")
else:
    print("No riders were simulated.")

# Print final locations of each Glydcar
for car_id, location in glydways.car_locations.items():
    print(f"{glydways.car_ids[car_id]} is at {location}")
