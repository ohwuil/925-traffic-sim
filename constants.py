# constants.py

foot_traffic_data = {
    'Broadway Plaza': {8: 10, 9: 20, 10: 30, 11: 50, 12: 60, 13: 70, 14: 70, 15: 80, 16: 80, 17: 80, 18: 70, 19: 60, 20: 50, 21: 40},
    'Heather Farm Park': {8: 5, 9: 10, 10: 20, 11: 30, 12: 40, 13: 50, 14: 50, 15: 60, 16: 60, 17: 70, 18: 60, 19: 50, 20: 40, 21: 30},
    'Sunvalley Shopping Center': {8: 5, 9: 10, 10: 20, 11: 40, 12: 60, 13: 80, 14: 100, 15: 120, 16: 120, 17: 120, 18: 100, 19: 80, 20: 60, 21: 40}
}

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
