from sqlalchemy import Column, Integer, String, UniqueConstraint
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