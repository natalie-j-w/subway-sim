from sqlalchemy import Column, Integer, String, Float , UniqueConstraint
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Station(Base):
    """
    StationID: int
    Name: str
    LocationX: int
    LocationY: int
    """

    __tablename__ = 'Stations'

    StationID = Column(Integer, primary_key=True)
    Name = Column(String(255), nullable=True)
    LocationX = Column(Integer, nullable=True)
    LocationY = Column(Integer, nullable=True)

    __table_args__ = (UniqueConstraint("Name", name="UniqueName"),)

    def __repr__(self):
        return(f"ID: {self.StationID}, Name:{self.Name}, LocationX:{self.LocationX}, LocationY:{self.LocationY}")


# class StationConnection(Base):
#     """
#     StationConnectionID: int
#     LengthKm: float
#     FK_FromStationID: int
#     FK_ToStationID: int

#     TODO: Relationships
#     """

#     __tablename__ = "Station_Connections"

#     StationConnectionID = Column(Integer, primary_key=True)
#     LengthKm = Column(Integer)
#     FK_FromStationID = Column(Integer)
#     FK_ToStationID = Column(Integer)

#     # TODO: Print names of stations instead of ID
#     __table_args__ = (UniqueConstraint("FK_FromStationID", "FK_ToStationID", name="UniqueFromTo"),)

#     def __repr__(self):
#         return (f"ID: {self.StationConnectionID}, Length in km: {self.LengthKm}, FK_FromStationID:{self.FK_FromStationID}, FK_ToStationID:{self.FK_ToStationID}")
    
# class Line(Base):
#     """
#     TODO: Docstring
#     TODO: Columns
#     TODO: Table args
#     """

#     __tablename__ = "Lines"

#     LineID = Column(Integer, primary_key=True)
#     Name = None
#     Color = None
#     ScheduleFrequency = None

#     __table_args__ = None

#     def __repr__(self):
#         return(f"ID: {self.LineID}, Name: {self.Name}, Color: {self.Color}, ScheduleFrequency: {self.ScheduleFrequency}")
    

# class StationLine(Base):
#     """
#     TODO: Docstring
#     TODO: Columns
#     TODO: Relationships
#     TODO: table_args
#     """

#     __tablename__ = "Stations_Lines"

#     StationLineID = Column(Integer, primary_key=True)
#     SequenceNumber = None
#     FK_StationID = None
#     FK_LineID = None

#     __table_args__ = None

#     # TODO: Print Station and Line name instead of ID
#     def __repr__(self):
#         return(f"ID: {self.StationLineID}, SequenceNumber: {self.Name}, FK_StationID: {self.FK_StationID}, FK_LineID: {self.FK_LineID}")


# class Train(Base):
#     """
#     TODO: Docstring
#     TODO: Columns
#     TODO: Relationships
#     TODO: table_args
#     TODO: repr
#     """

#     __tablename__ = "Trains"

#     TrainID = Column(Integer, primary_key=True)
#     Name = None
#     FK_TrainPositionID = None

#     __table_args__ = None

#     def __repr__(self):
#         return None
    

# class Train_Journey(Base):
#     """
#     TODO: Docstring
#     TODO: Columns
#     TODO: Relationships
#     TODO: table_args
#     TODO: repr
#     """

#     __tablename__ = "Trains_Journeys"

#     TrainJourneyID = Column(Integer, primary_key=True)
#     Direction = None
#     FK_TrainID = None
#     FK_LineID = None

#     __table_args__ = None

#     def __repr__(self):
#         return None


# class Train_Position(Base):
#     """
#     TODO: Docstring
#     TODO: Columns
#     TODO: Relationships
#     TODO: table_args
#     TODO: repr
#     """

#     __tablename__ = "Trains_Positions"

#     TrainPositionID = Column(Integer, primary_key=True)
#     Position = None
#     Status = None

#     __table_args__ = None

#     def __repr__(self):
#         return None