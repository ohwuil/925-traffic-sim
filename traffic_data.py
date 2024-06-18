import simpy
import random
import heapq

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
        
    def travel(self, from_station, to_station):
        _, path = dijkstra(graph, from_station, to_station)
        total_travel_time = 0
        for i in range(len(path) - 1):
            segment_distance = graph[path[i]][path[i+1]]
            segment_travel_time = calculate_travel_time(segment_distance)
            yield self.env.timeout(segment_travel_time)
            total_travel_time += segment_travel_time
            print(f"Traveling from {path[i]} to {path[i+1]} in {segment_travel_time:.2f} minutes at time {self.env.now}")
        print(f"Arrived at {to_station} from {from_station} via {path} in {total_travel_time:.2f} minutes at time {self.env.now}")
        return total_travel_time

# Instantiate the system
env = simpy.Environment()
glydways = GlydwaysSystem(env, num_vehicles=5)

# Define a function to simulate ridership with travel times
def rider(env, glydways, from_station, to_station):
    arrival_time = env.now
    with glydways.vehicles.request() as request:
        yield request
        wait_time = env.now - arrival_time
        glydways.total_wait_time += wait_time
        glydways.rider_count += 1
        print(f"Rider traveling from {from_station} to {to_station} at time {env.now}, waited for {wait_time:.2f} minutes")
        travel_time = yield env.process(glydways.travel(from_station, to_station))
        return travel_time

# Simulate riders
stations = list(graph.keys())
for i in range(10):  # Number of riders
    from_station = random.choice(stations)
    to_station = random.choice([s for s in stations if s != from_station])
    env.process(rider(env, glydways, from_station, to_station))

# Run the simulation
env.run(until=200)

# Calculate and print the average wait time
if glydways.rider_count > 0:
    average_wait_time = glydways.total_wait_time / glydways.rider_count
    print(f"Average wait time: {average_wait_time:.2f} minutes")
else:
    print("No riders were simulated.")
