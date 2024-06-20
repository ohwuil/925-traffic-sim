# glydways_system.py

import simpy
from datetime import datetime, timedelta
from utils import calculate_travel_time, dijkstra
from constants import distances

# Create a graph representation of the distances
graph = {}
for (from_station, to_station), distance in distances.items():
    if from_station not in graph:
        graph[from_station] = {}
    graph[from_station][to_station] = distance

class GlydwaysSystem:
    def __init__(self, env, num_vehicles, initial_stations):
        self.env = env
        self.vehicles = [simpy.Resource(env, capacity=1) for _ in range(num_vehicles)]
        self.total_wait_time = 0
        self.rider_count = 0
        self.log = []
        self.car_locations = {i: initial_stations[i] for i in range(num_vehicles)}
        self.car_ids = {i: f"Glydcar-{i}" for i in range(num_vehicles)}

    def travel(self, car_id, rider_id, from_station, to_station):
        _, path = dijkstra(graph, from_station, to_station)
        total_travel_time = 0
        for i in range(len(path) - 1):
            segment_distance = graph[path[i]][path[i+1]]
            segment_travel_time = calculate_travel_time(segment_distance)
            yield self.env.timeout(segment_travel_time)
            total_travel_time += segment_travel_time
            print(f"Rider {rider_id} traveling in {self.car_ids[car_id]} from {path[i]} to {path[i+1]} in {segment_travel_time:.2f} minutes at time {self.time_format(self.env.now)}")
        self.log.append({
            'timestamp': datetime.now(),
            'car_id': self.car_ids[car_id],
            'rider_id': rider_id,
            'from_station': from_station,
            'to_station': to_station,
            'travel_time': total_travel_time,
            'path': path
        })
        print(f"Rider {rider_id} arrived at {to_station} from {from_station} via {path} in {total_travel_time:.2f} minutes at time {self.time_format(self.env.now)}")
        self.car_locations[car_id] = to_station
        print(f"{self.car_ids[car_id]} is now at {to_station} waiting for the next rider.")
        return total_travel_time

    def time_format(self, env_time):
        start_time = datetime.strptime('08:00', '%H:%M')
        actual_time = start_time + timedelta(minutes=env_time)
        return actual_time.strftime('%H:%M')

    def allocate_vehicle(self, from_station):
        for car_id, location in self.car_locations.items():
            if location == from_station:
                return car_id, 0
        # If no car is immediately available, find the nearest one
        nearest_car_id = None
        min_travel_time = float('inf')
        for car_id, location in self.car_locations.items():
            travel_time = calculate_travel_time(distances[(location, from_station)])
            if travel_time < min_travel_time:
                min_travel_time = travel_time
                nearest_car_id = car_id
        # Log the travel of the car to the waiting rider
        print(f"{self.car_ids[nearest_car_id]} traveling from {self.car_locations[nearest_car_id]} to {from_station} in {min_travel_time:.2f} minutes at time {self.time_format(self.env.now)}")
        yield self.env.timeout(min_travel_time)
        self.car_locations[nearest_car_id] = from_station
        return nearest_car_id, min_travel_time
