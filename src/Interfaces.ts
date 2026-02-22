import { Station } from "./Station";

/**
 * Represents a 2D coordinate point on the canvas (-> relative to canvas coordinates).
 * @property {number} x - The x-coordinate 
 * @property {number} y - The y-coordinate
 */
export interface Coordinate {
    x: number,
    y: number
}

/**
 * Represents coordinates for a track line segment on the canvas (-> relative to canvas coordinates).
 * @property {number} x1 - The x-coordinate of the starting point
 * @property {number} y1 - The y-coordinate of the starting point
 * @property {number} x2 - The x-coordinate of the ending point
 * @property {number} y2 - The y-coordinate of the ending point
 */
export interface TrackCoordinate {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

/**
 * Represents the two stations connected by a track.
 * @property {Station} startpoint - The station at the start of the track
 * @property {Station} endpoint - The station at the end of the track
 */
export interface TrackStations {
    startpoint: Station,
    endpoint: Station
}