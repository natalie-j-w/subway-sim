import {JS_VARS} from '../constants.js'
import {TrackData } from './TrackData.js'

/**
 * Represents the data model for a station in the metro map.
 * Stores station metadata including id, name, and connections to other stations.
 */
export class StationData {
    /** @type {string|number|null}*/
    id
    
    /** @type {string}*/
    name

    // TODO: Coordinate object coordinates = {x, y}
    /** @type {number} */
    coordinateX

    /** @type {number} */
    coordinateY

    
    /**
     * Creates a new StationData instance.
    * @param {Object} params - Station configuration
    * @param {number} params.id - Unique identifier
    * @param {string} params.name  - Station name (default: "Unnamed")
    * @param {number} params.coordinateX - X coordinate on canvas (default: 0)
    * @param {number} params.coordinateY - Y coordinate on canvas (default: 0)
    */
    constructor({id = 0, name = "Unnamed", coordinateX = 0, coordinateY = 0}) {
        this.id = this.validateId(id);
        this.name = this.validateName(name);
        this.coordinateX = this.validateCoordinate(coordinateX);
        this.coordinateY = this.validateCoordinate(coordinateY);
    }
    
    // Field validation

    /**
     * Returns validated station name. Too long name will be shortened to max length.
     * @returns New station name.
     * @param {string} newName
     */
    validateName(newName) {
        if (newName && newName.length > JS_VARS.STATION_NAME_MAXLENGTH) {
            return newName.substring(0, JS_VARS.STATION_NAME_MAXLENGTH-1); 
        }
        if (!newName) {
            return this.name;
        }

        return newName;
    }

    /**
     * Returns validated station id.
     * @param {*} id 
     * @returns {int} id
     * @throws {TypeError} If id is not an integer.
     */
    validateId(id) {
        if (!Number.isInteger(id)) {throw new TypeError("ID has to be of type 'integer'")}

        return id;
    }

    /**
     * Returns validated coordinate.
     * @param {*} coord
     * @returns {number} coord
     * @throws {TypeError} If coord is not a number.
     */
    validateCoordinate(coord) {
        if (!typeof coord === "number") {throw new TypeError("Coordinate has to be of type 'number")}
        
        return coord;
    }
}