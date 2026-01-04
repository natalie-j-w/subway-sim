import {JS_VARS} from '../constants.js'
import { TrackData } from './TrackData.js'

/**
 * Represents the data model for a station in the metro map.
 * Stores station metadata including id, name, and connections to other stations.
 */
export class StationData {
    /** @type {string|number} Unique identifier for the station */
    id
    
    /** @type {string} Station name
     * @private
     */
    #name

    /** @type TrackData[ ] - List of tracks that connect this station to another station
     */
    connections
    
    /**
     * Creates a new StationData instance.
    * @param {Object} params - Station configuration
    * @param {string|number} params.id - Unique identifier
    * @param {string} [params.name="Unnamed"] - Station name
    */
    constructor(id, name="Unnamed") {
        this.id = id;
        this.setName(name);
        this.connections = [];
    }

    // TODO: Implement addConnection
    addConnection(connectedStation) {
        // Check if connection already exists (same stations, same line)
        // If yes, don't do anything
        // If no, create
        return;
    }
    
    /**
     * Converts the station data to a plain object for serialization.
     * Used for sending to APIs.
     * @returns {Object} Plain object containing station data with public fields.
     * @example {id, name}
     */
    toDTO () {
        return {
            id: this.id,
            name: this.getName()
            // TODO: Add connections
        }
    }
    
    /**
     * Gets the station name.
     * Provides access to the private #name field.
     * @returns {string} The station name.
     */
    getName() {
        return this.#name;
    }
    
    /**
     * Sets a new name for the station with validation.
     * @param {string} newName - The new name for the station.
     * @throws {RangeError} If the name exceeds maximum allowed length.
     */
    setName(newName) {
        if (newName.length > JS_VARS.STATION_NAME_MAXLENGTH) {
            throw RangeError(`Station name length cannot exceed ${JS_VARS.STATION_NAME_MAXLENGTH} characters,
                Current length: ${newName.length}`)
        }
        this.#name = newName;
    }
}