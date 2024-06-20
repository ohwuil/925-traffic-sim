# utils.py

import heapq
from constants import distances, foot_traffic_data

def calculate_travel_time(distance):
    speed_mph = 30
    return distance / speed_mph * 60  # Convert to minutes

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

def get_estimated_foot_traffic(station, hour):
    return foot_traffic_data.get(station, {}).get(hour, 0)
