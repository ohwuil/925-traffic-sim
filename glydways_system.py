# glydways_system.py

import simpy
import random
from datetime import datetime, timedelta
from constants import STATION_COORDINATES

class GlydwaysSystem:
    def __init__(self, env, num_vehicles):
        self.env = env
        self.vehicles = [simpy.Resource(env, capacity=1) for _ in range(num_vehicles)]
        self.car_locations = {i: random.choice(list(STATION_COORDINATES.keys())) for i in range(num_vehicles)}
        self.car_ids = {i: f"Glydcar-{i}" for i in range(num_vehicles)}
        self.total_wait_time = 0
        self.total_travel_time = 0
        self.total_trips = 0
        self.passengers_transported = 0
        self.visualization_data = []  # To store data for visualization

    def travel(self, car_id, rider_id, from_station, to_station):
        travel_time = self.calculate_travel_time(from_station, to_station)
        yield self.env.timeout(travel_time)
        self.car_locations[car_id] = to_station
        self.total_travel_time += travel_time
        self.total_trips += 1
        print(f"Rider {rider_id} traveled from {from_station} to {to_station} in {self.car_ids[car_id]} at time {self.time_format(self.env.now)}, travel time {travel_time} minutes")
        
        # Add to visualization data
        self.visualization_data.append({
            'time': self.time_format(self.env.now),
            'car_id': self.car_ids[car_id],
            'rider_id': rider_id,
            'from_station': from_station,
            'to_station': to_station,
            'path': [from_station, to_station]
        })

    def calculate_travel_time(self, from_station, to_station):
        # Placeholder for actual travel time calculation
        return random.randint(5, 20)

    def time_format(self, env_time):
        start_time = datetime.strptime('08:00', '%H:%M')
        actual_time = start_time + timedelta(minutes=env_time)
        return actual_time.strftime('%H:%M')
