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

export interface TrackConnection {
    track: SVGLineElement,
    /** 'start' if station is at x1,y1; 'end' if at x2,y2 */
    endpoint: 'start' | 'end'
}

export interface TrackStations {
    startpoint: Station,
    endpoint: Station
}