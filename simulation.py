# simulation.py

import simpy
import random
from glydways_system import GlydwaysSystem
from constants import STATION_COORDINATES
from visualization import setup_map, update_map, display_map

def rider(env, glydways, rider_id, from_station, to_station):
    arrival_time = env.now
    car_id = random.choice(list(glydways.car_ids.keys()))
    with glydways.vehicles[car_id].request() as request:
        yield request
        wait_time = env.now - arrival_time
        glydways.total_wait_time += wait_time
        glydways.passengers_transported += 1
        print(f"Rider {rider_id} waiting at {from_station} for {wait_time:.2f} minutes at time {glydways.time_format(env.now)}")
        yield env.process(glydways.travel(car_id, rider_id, from_station, to_station))

def simulate_and_collect_data():
    # Simulate the system
    env = simpy.Environment()
    glydways = GlydwaysSystem(env, num_vehicles=5)

    stations = list(STATION_COORDINATES.keys())
    for rider_id in range(10):  # Simulating 10 riders
        from_station = random.choice(stations)
        to_station = random.choice([s for s in stations if s != from_station])
        env.process(rider(env, glydways, rider_id, from_station, to_station))

    env.run(until=120)  # Run the simulation for 120 minutes

    # Summary statistics
    total_passengers = glydways.passengers_transported
    hours_of_simulation = 120 / 60
    num_glydcars = len(glydways.vehicles)
    average_wait_time = glydways.total_wait_time / total_passengers if total_passengers else 0
    num_trips = glydways.total_trips
    average_trip_time = glydways.total_travel_time / num_trips if num_trips else 0

    print("\nSimulation Summary:")
    print(f"Number of passengers transported: {total_passengers}")
    print(f"Hours of simulation: {hours_of_simulation}")
    print(f"Number of glydcars used: {num_glydcars}")
    print(f"Average wait time: {average_wait_time:.2f} minutes")
    print(f"Number of trips taken: {num_trips}")
    print(f"Average trip time: {average_trip_time:.2f} minutes")

    return glydways.visualization_data

# Simulate and collect data
visualization_data = simulate_and_collect_data()

# Visualization
setup_map()
display_map(visualization_data)
