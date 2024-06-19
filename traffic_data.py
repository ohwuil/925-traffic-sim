import simpy
import random
import pandas as pd
from datetime import datetime
import heapq
import matplotlib.pyplot as plt

# Simulated foot traffic data based on screenshots
foot_traffic_data = {
    'Broadway Plaza': {8: 10, 9: 20, 10: 30, 11: 50, 12: 60, 13: 70, 14: 70, 15: 80, 16: 80, 17: 80, 18: 70, 19: 60, 20: 50, 21: 40},
    'Heather Farm Park': {8: 5, 9: 10, 10: 20, 11: 30, 12: 40, 13: 50, 14: 50, 15: 60, 16: 60, 17: 70, 18: 60, 19: 50, 20: 40, 21: 30},
    'Sunvalley Shopping Center': {8: 5, 9: 10, 10: 20, 11: 40, 12: 60, 13: 80, 14: 100, 15: 120, 16: 120, 17: 120, 18: 100, 19: 80, 20: 60, 21: 40}
}

# Function to get estimated foot traffic at a station and hour
def get_estimated_foot_traffic(station, hour):
    return foot_traffic_data.get(station, {}).get(hour, 0)

# Define the distances between the stations in miles (based on the path network)
distances = {
    ("Broadway Plaza", "Heather Farm Park"): 2.0,
    ("Heather Farm Park", "Woodlands"): 2.0,
    ("Woodlands", "Limeridge"): 2.5,
    ("Limeridge", "Sunvalley Shopping Center"): 3.0,
    ("Sunvalley Shopping Center", "Broadway Plaza"): 4.0
}

# Ensure all pairs have distances (including reverse directions)
for (from_station, to_station), distance in list(distances.items()):
    distances[(to_station, from_station)] = distance

# Calculate travel time based on speed (30 mph)
def calculate_travel_time(distance):
    speed_mph = 30
    return distance / speed_mph * 60  # Convert to minutes

# Define a function to find the shortest path using Dijkstra's algorithm
def dijkstra(graph, start, goal):
    queue = [(0, start, [])]
    seen = set()
    mins = {start: 0}
    while queue:
        (cost, node, path) = heapq.heappop(queue)
        if node in seen:
            continue
        seen.add(node)
        path = path + [node]
        if node == goal:
            return (cost, path)
        for next_node in graph[node]:
            if next_node in seen:
                continue
            prev_cost = mins.get(next_node, None)
            next_cost = cost + graph[node][next_node]
            if prev_cost is None or next_cost < prev_cost:
                mins[next_node] = next_cost
                heapq.heappush(queue, (next_cost, next_node, path))
    return float("inf"), []

# Create a graph representation of the distances
graph = {}
for (from_station, to_station), distance in distances.items():
    if from_station not in graph:
        graph[from_station] = {}
    graph[from_station][to_station] = distance

# Define a class for the Glydways system with travel times
class GlydwaysSystem:
    def __init__(self, env, num_vehicles):
        self.env = env
        self.vehicles = simpy.Resource(env, capacity=num_vehicles)
        self.total_wait_time = 0
        self.rider_count = 0
        self.log = []

    def travel(self, from_station, to_station):
        _, path = dijkstra(graph, from_station, to_station)
        total_travel_time = 0
        for i in range(len(path) - 1):
            segment_distance = graph[path[i]][path[i+1]]
            segment_travel_time = calculate_travel_time(segment_distance)
            yield self.env.timeout(segment_travel_time)
            total_travel_time += segment_travel_time
            print(f"Traveling from {path[i]} to {path[i+1]} in {segment_travel_time:.2f} minutes at time {self.env.now}")
        self.log.append({
            'timestamp': datetime.now(),
            'from_station': from_station,
            'to_station': to_station,
            'travel_time': total_travel_time,
            'path': path
        })
        print(f"Arrived at {to_station} from {from_station} via {path} in {total_travel_time:.2f} minutes at time {self.env.now}")
        return total_travel_time

def rider(env, glydways, from_station, to_station):
    arrival_time = env.now
    with glydways.vehicles.request() as request:
        yield request
        wait_time = env.now - arrival_time
        glydways.total_wait_time += wait_time
        glydways.rider_count += 1
        print(f"Rider traveling from {from_station} to {to_station} at time {env.now}, waited for {wait_time:.2f} minutes")
        travel_time = yield env.process(glydways.travel(from_station, to_station))
        glydways.log[-1]['wait_time'] = wait_time
        return travel_time

# Instantiate the system
env = simpy.Environment()
glydways = GlydwaysSystem(env, num_vehicles=5)

# Simulate riders based on estimated foot traffic
stations = ['Heather Farm Park', 'Broadway Plaza', 'Sunvalley Shopping Center', 'Woodlands', 'Limeridge']
for hour in range(8, 22):  # Simulate from 8 AM to 9 PM
    for station in stations:
        foot_traffic = get_estimated_foot_traffic(station, hour)
        for _ in range(foot_traffic):  # Create a rider for each estimated person
            from_station = station
            to_station = random.choice([s for s in stations if s != from_station])
            env.process(rider(env, glydways, from_station, to_station))

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

# Visualization
# Plot the histogram of rider wait times
wait_times = log_df['wait_time']
plt.figure(figsize=(10, 6))
plt.hist(wait_times, bins=20, color='skyblue', edgecolor='black')
plt.title('Histogram of Rider Wait Times')
plt.xlabel('Wait Time (minutes)')
plt.ylabel('Frequency')
plt.grid(True)
plt.show()

# Plot the histogram of travel times
travel_times = log_df['travel_time']
plt.figure(figsize=(10, 6))
plt.hist(travel_times, bins=20, color='lightgreen', edgecolor='black')
plt.title('Histogram of Travel Times')
plt.xlabel('Travel Time (minutes)')
plt.ylabel('Frequency')
plt.grid(True)
plt.show()

# Plot the number of riders over time
log_df['timestamp'] = pd.to_datetime(log_df['timestamp'])
log_df.set_index('timestamp', inplace=True)
rider_counts = log_df.resample('H').size()
plt.figure(figsize=(10, 6))
rider_counts.plot(kind='line', marker='o')
plt.title('Number of Riders Over Time')
plt.xlabel('Time')
plt.ylabel('Number of Riders')
plt.grid(True)
plt.show()
