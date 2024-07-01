# visualization.py

import folium
import ipywidgets as widgets
from IPython.display import display, clear_output, HTML
from constants import STATION_COORDINATES
from folium.plugins import AntPath

map_widget = None

def setup_map():
    global map_widget
    map_center = [37.975, -121.85]  # Approximate center of the map
    m = folium.Map(location=map_center, zoom_start=12)

    # Add station markers
    for station, coords in STATION_COORDINATES.items():
        folium.Marker(location=coords, popup=station, icon=folium.Icon(color='blue')).add_to(m)

    map_widget = widgets.Output()
    display(map_widget)

def update_map(visualization_data):
    global map_widget
    m = folium.Map(location=[37.975, -121.85], zoom_start=12)
    for station, coords in STATION_COORDINATES.items():
        folium.Marker(location=coords, popup=station, icon=folium.Icon(color='blue')).add_to(m)
    
    for data in visualization_data:
        path = [STATION_COORDINATES[point] for point in data['path']]
        AntPath(locations=path, color='red', weight=5).add_to(m)
        folium.CircleMarker(location=STATION_COORDINATES[data['to_station']],
                            radius=5,
                            popup=f"Car: {data['car_id']}, Rider: {data['rider_id']}, Time: {data['time']}",
                            color='red',
                            fill=True).add_to(m)
    with map_widget:
        clear_output(wait=True)
        display(HTML(m._repr_html_()))

def display_map(visualization_data):
    setup_map()
    update_map(visualization_data)
