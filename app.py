# app.py

import dash
import dash_core_components as dcc
import dash_html_components as html
import dash_leaflet as dl
from dash.dependencies import Input, Output
import simpy
import random
from glydways_system import GlydwaysSystem
from constants import STATION_COORDINATES

app = dash.Dash(__name__, external_stylesheets=['https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'])

app.layout = html.Div([
    html.H1("Glydways Simulation"),
    dl.Map(center=[37.975, -121.85], zoom=12, style={'height': '500px'}, children=[
        dl.TileLayer(),
        dl.LayerGroup(id="layer")
    ]),
    dcc.Interval(id='interval', interval=1000, n_intervals=0)  # Update every second
])

visualization_data = []
env = simpy.Environment()
glydways = GlydwaysSystem(env, num_vehicles=5)

def rider(env, glydways, rider_id, from_station, to_station):
    arrival_time = env.now
    car_id = random.choice(list(glydways.car_ids.keys()))
    with glydways.vehicles[car_id].request() as request:
        yield request
        wait_time = env.now - arrival_time
        glydways.total_wait_time += wait_time
        glydways.passengers_transported += 1
        yield env.process(glydways.travel(car_id, rider_id, from_station, to_station))

def run_simulation_step():
    global env, glydways
    env.step()
    return glydways.visualization_data

stations = list(STATION_COORDINATES.keys())
for rider_id in range(10):  # Simulating 10 riders
    from_station = random.choice(stations)
    to_station = random.choice([s for s in stations if s != from_station])
    start_time = random.randint(0, 60)  # Random start time within the first hour
    env.process(rider(env, glydways, rider_id, from_station, to_station))

@app.callback(
    Output('layer', 'children'),
    [Input('interval', 'n_intervals')]
)
def update_map(n_intervals):
    if env.now < 120:  # Run the simulation for 120 minutes
        visualization_data = run_simulation_step()
        markers = []
        for data in visualization_data:
            path = [STATION_COORDINATES[point] for point in data['path']]
            markers.append(dl.Polyline(positions=path, color='red'))
            markers.append(dl.CircleMarker(center=STATION_COORDINATES[data['to_station']],
                                           radius=5, color='red',
                                           children=[dl.Popup(children=[html.Div(f"Car: {data['car_id']}, Rider: {data['rider_id']}, Time: {data['time']}")])]))
        return markers
    return []

if __name__ == '__main__':
    app.run_server(debug=True)
