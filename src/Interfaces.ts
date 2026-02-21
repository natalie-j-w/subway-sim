import { Station } from "./Station";

export interface Coordinate {
    x: number,
    y: number
}

export interface TrackCoordinate {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

export interface TrackStations {
    startpoint: Station,
    endpoint: Station
}