from db_driver import get_station_by_id
import alchemy_models as am
from fastapi import FastAPI
import uvicorn

app = FastAPI()

# TODO: APIs - Always check if ID exists

# Get station data by ID
@app.get("/stations/{station_id}")
async def get_station(station_id:int):
    
    station = get_station_by_id(station_id)
    
    return {"StationID": station.StationID,
            "Name": station.Name,
            "LocationX": station.LocationX,
            "LocationY": station.LocationY}

# TODO: Return all stations
@app.get("/stations/{station_id}")
async def get_station(station_id:int):
    pass

# TODO: Add new station and return it
@app.post("/stations")
async def create_station():
    pass

# TODO: Edit existing station and return new data
@app.post("/stations/{station_id}")
async def edit_station(station_id:int):
    # TODO: How to communicate additional parameters?
    pass

# TODO: Delete existing station and return it
@app.delete("/stations/{station_id}")
def delete_station(station_id:int):
    pass


if __name__ == '__main__':
    uvicorn.run(app, port=8001, host='127.0.0.1')