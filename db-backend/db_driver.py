import alchemy_models as am
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

connection_string = "mysql+mysqlconnector://root:abcd@localhost/subway_sim"
engine = create_engine(connection_string)
Session = sessionmaker(bind=engine)


def get_station_by_id(station_id:int):
    with Session() as session:
        return session.query(am.Station).filter_by(StationID=station_id).first()
    
if __name__ == "__main__":
    s = get_station_by_id(1)
    print(s.StationID)