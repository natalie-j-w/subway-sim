from pydantic import BaseModel

class Station(BaseModel):
    StationID: int
    Name: str
    LocationX: int
    LocationY: int

    model_config = {
        "from_attributes": True
    }

class Line(BaseModel):
    LineID: int
    Name: str
    Color: str
    ScheduleFrequency: float

    model_config = {
        "from_attributes": True
    }

