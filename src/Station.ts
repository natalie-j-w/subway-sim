import {CSS_VARS} from "../constants.js"
import {Coordinate} from "./Interfaces.js"
import { Track } from "./Track.js";

/**
 * Represents a subway station on the canvas.
 * Handles creation, positioning, selection, and interaction of station elements.
 * 
 * @property {HTMLElement} parent - The container element where the station is rendered
 * @property {HTMLElement} element - The DOM element representing the station
 * @property {HTMLElement} labelElement - The DOM element displaying the station name
 * @property {Coordinate} coords - The current position of the station on the canvas
 * @property {string} name - The name of the station (default: "Unnamed")
 * @property {Set<Track>} tracks - Set of tracks connected to this station
 * 
 * @example
 * const station = new Station(parentElement, {x: 100, y: 200}, "Central Station");
 * station.select();
 * station.move({x: 150, y: 250});
 */
export class Station {
    parent: HTMLElement;
    /** The DOM element representing the station */
    element: HTMLElement;
    /** The DOM element displaying the station name label */
    labelElement: HTMLElement;
    /** The current coordinate position of the station */
    coords: Coordinate;
    /** The name of the station */
    name: string = "Unnamed";
    /** Set of tracks connected to this station */
    tracks: Set<Track> = new Set();
    /** Set label visibility */
    labelVisible: boolean = true;

    /**
     * Creates a new Station instance and initializes its DOM element.
     * 
     * @param {HTMLElement} parent - The container element where the station will be rendered
     * @param {Coordinate} coord - The initial position of the station on the canvas
     * @param {string} [name="Unnamed"] - The name of the station (optional, default: "Unnamed")
     */
    constructor(parent: HTMLElement, coord: Coordinate, name: string = "Unnamed") {
        this.parent = parent;
        this.coords = coord;
        this.createDomElement();
    }

    /**
     * Creates the DOM element for the station with a label and adds it to the parent.
     * Sets up the initial styling and positioning.
     * 
     * @private
     */
    private createDomElement(): void {
        const station = document.createElement("div");
        const label = document.createElement("div");

        station.classList.add(CSS_VARS.STATION_CLASSNAME);
        label.classList.add(CSS_VARS.STATION_LABEL_CLASSNAME);
        label.textContent = this.name;

        station.style.position = "absolute";

        station.style.left = `${this.coords.x}px`;
        station.style.top = `${this.coords.y}px`;

        station.appendChild(label);
        this.parent.appendChild(station)

        this.element = station;
        this.labelElement = label;
    }

    /**
     * Adds a track to this station's set of connected tracks.
     * 
     * @param {Track} tr - The track to add
     */
    addTrack(tr: Track) {
        this.tracks.add(tr);
    }

    /**
     * Removes a track from this station's set of connected tracks.
     * 
     * @param {Track} tr - The track to remove
     */
    removeTrack(tr: Track) {
        this.tracks.delete(tr);
    }

    /**
     * Selects the station by adding the "selected" CSS class.
     * Updates the visual state to show the station as selected.
     */
    select() {
        this.element.classList.add("selected");
        // console.log("Selected", this)
    }

    /**
     * Deselects the station by removing the "selected" CSS class.
     * Updates the visual state to show the station as deselected.
     */
    deselect() {
        this.element.classList.remove("selected");
        // console.log("Deselected", this);
    }

    /**
     * Deletes the station from the DOM by removing its element from the parent.
     */
    delete() {
        this.parent.removeChild(this.element);
    }

    /**
     * Moves the station to a new coordinate position.
     * Updates the station's internal coordinates and CSS positioning.
     * Also updates positions of all connected tracks.
     * 
     * @param {Coordinate} newCoords - The new position for the station
     */
    move(newCoords: Coordinate) {
        this.coords = newCoords;
        this.element.style.left = `${this.coords.x}px`;
        this.element.style.top = `${this.coords.y}px`;

        this.tracks.forEach(tr => {
            tr.moveWithStation(this);
        })
    }

    /**
     * Marks the start of a drag operation.
     * Adds the "dragging" CSS class to indicate visual feedback during dragging.
     */
    startDrag() {
        this.element.classList.add("dragging");
        // console.log("Started dragging", this)
    }

    /**
     * Marks the end of a drag operation.
     * Removes the "dragging" CSS class to restore normal visual state.
     */
    endDrag() {
        this.element.classList.remove("dragging");
        // console.log("Stopped dragging", this)
    }

    /**
     * Renames the station if the new name is different from the current name.
     * Updates both the internal name property and the label element text content.
     * 
     * @param {string} newName - The new name for the station
     */
    rename(newName: string) {
        if (this.name === newName || newName == "") return;
        else {
            console.log(`Renamed`, this, `from ${this.name} to ${newName}`)
            this.name = newName;
            this.labelElement.textContent = this.name;
        }
    }

    setLabelVisibility(val: boolean) {
        this.labelVisible = val;
        this.labelElement.style.display = this.labelVisible ? "block" : "none";
    }
}

