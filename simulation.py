import simpy
import random
from datetime import datetime, timedelta

# Constants
STATIONS_NEAR_BART = {
    'Railroad Ave & E Leland Rd': [38.0176, -121.8891],
    'Railroad Ave & Central Ave': [38.0170, -121.8925],
    'E Leland Rd & Harbor St': [38.0181, -121.8883],
    'Railroad Ave & E 10th St': [38.0184, -121.8971],
    'Lone Tree Way & Hillcrest Ave': [37.9762, -121.7978],
    'Deer Valley Rd & Lone Tree Way': [37.9814, -121.7803],
    'Davison Dr & Hillcrest Ave': [37.9876, -121.7808]
}

class GlydwaysSystem:
    def __init__(self, env, num_vehicles):
        self.env = env
        self.vehicles = [simpy.Resource(env, capacity=1) for _ in range(num_vehicles)]
        self.car_locations = {i: random.choice(list(STATIONS_NEAR_BART.keys())) for i in range(num_vehicles)}
        self.car_ids = {i: f"Glydcar-{i}" for i in range(num_vehicles)}
        self.total_wait_time = 0
        self.total_travel_time = 0
        self.total_trips = 0
        self.passengers_transported = 0

    def travel(self, car_id, rider_id, from_station, to_station):
        travel_time = self.calculate_travel_time(from_station, to_station)
        yield self.env.timeout(travel_time)
        self.car_locations[car_id] = to_station
        self.total_travel_time += travel_time
        self.total_trips += 1
        print(f"Rider {rider_id} traveled from {from_station} to {to_station} in {self.car_ids[car_id]} at time {self.time_format(self.env.now)}, travel time {travel_time} minutes")

    def calculate_travel_time(self, from_station, to_station):
        # Placeholder for actual travel time calculation
        return random.randint(5, 20)

    def time_format(self, env_time):
        start_time = datetime.strptime('08:00', '%H:%M')
        actual_time = start_time + timedelta(minutes=env_time)
        return actual_time.strftime('%H:%M')

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

# Simulate the system
env = simpy.Environment()
glydways = GlydwaysSystem(env, num_vehicles=5)

stations = list(STATIONS_NEAR_BART.keys())
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
