import { CSS_VARS } from "../constants.js";
import { Station } from "./Station.js";
import { Track } from "./Track.js";
/**
 * Manages all canvas interactions and DOM element creation for the subway simulator.
 * Handles event listeners for user interactions including station/track creation, selection, and dragging.
 * Maintains maps of stations and tracks for quick instance lookup.
 *
 * @property container - The main container element for the canvas
 * @property svg - The SVG element for rendering tracks
 * @property {HTMLElement} canvas - The canvas element for rendering stations
 * @property {Map<HTMLElement, Station>} stationInstances - Map of station DOM elements to Station instances
 * @property {Map<SVGLineElement, Track>} trackInstances - Map of track SVG elements to Track instances
 * @property {Station} hoveredStation - The currently hovered station (if any)
 * @property {Track} hoveredTrack - The currently hovered track (if any)
 * @property {HTMLCollection} selectedStationElements - Collection of currently selected station elements
 * @property {HTMLCollection} selectedTrackElements - Collection of currently selected track elements
 * @property {Object} dragState - Object tracking current drag operation state
 * @property {Station} dragState.station - The station being dragged (if any)
 * @property {Coordinate} dragState.startPos - The starting position of the drag
 * @property {boolean} dragState.isDragging - Whether a drag is currently in progress
 *
 * @example
 * const handler = new CanvasHandler(containerElement, svgElement, canvasElement);
 * // Stations and a sample track are created automatically
 */
export class CanvasHandler {
    /** The main container element for the entire canvas application */
    container;
    /** The SVG element used for rendering track lines */
    svg;
    /** The HTML canvas/container element for rendering stations */
    canvas;
    /** Map of station DOM elements to their Station instances for quick lookup */
    stationInstances = new Map();
    /** Map of track SVG line elements to their Track instances for quick lookup */
    trackInstances = new Map();
    /** The station currently being hovered over by the mouse */
    hoveredStation;
    /** The track currently being hovered over by the mouse */
    hoveredTrack;
    /** Collection of currently selected station DOM elements */
    selectedStationElements;
    /** Collection of currently selected track DOM elements */
    selectedTrackElements;
    /**
     * State object tracking the current drag operation on a station.
     * @property {Station} [station] - The station currently being dragged
     * @property {Coordinate} [startPos] - The starting position coordinates of the drag
     * @property {boolean} isDragging - Flag indicating whether an active drag is in progress
     */
    dragState = { isDragging: false };
    /**
     * Initializes the CanvasHandler with DOM elements and sets up event listeners.
     * Creates sample stations and a connecting track for demonstration.
     * Also sets up a ResizeObserver to adjust the SVG viewBox when the container resizes.
     *
     * @param {HTMLElement} container - The main container element
     * @param {SVGElement} svg - The SVG element for rendering tracks
     * @param {HTMLElement} canvas - The canvas element for rendering stations
     */
    constructor(container, svg, canvas) {
        this.container = container;
        this.svg = svg;
        this.canvas = canvas;
        this.selectedStationElements = document.getElementsByClassName(CSS_VARS.STATION_CLASSNAME + " selected");
        this.selectedTrackElements = document.getElementsByClassName(CSS_VARS.TRACK_CLASSNAME + " selected");
        this.svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`);
        this.setupEventListeners();
        const s1 = this.createStation({ x: 30, y: 30 });
        const s2 = this.createStation({ x: 100, y: 200 });
        const tr = this.createTrack({ "startpoint": s1, "endpoint": s2 });
        console.log(s1, s2, tr);
        this.clearSelection();
        const resizeObserver = new ResizeObserver(() => {
            this.svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`);
        });
        resizeObserver.observe(container);
    }
    /**
     * Converts absolute page coordinates to coordinates relative to the canvas container.
     * Takes into account the container's position on the page using getBoundingClientRect.
     *
     * @private
     * @param {Coordinate} coords - The absolute page coordinates
     * @returns {Coordinate} The relative coordinates within the container
     */
    getRelativeCoords(coords) {
        const bounds = this.container.getBoundingClientRect();
        return {
            x: coords.x - bounds.left,
            y: coords.y - bounds.top
        };
    }
    /**
     * Sets up all event listeners for user interactions.
     * Handles the following events and actions:
     * - Click: Select stations/tracks, create new stations, connect stations with tracks
     * - Double-click: Rename stations
     * - Mouse down: Start dragging a station
     * - Mouse move: Update dragged station position
     * - Mouse up: End dragging a station
     * - Mouse over/out: Track hovered elements
     * - Key down: Delete hovered station/track with Delete key
     *
     * @private
     */
    setupEventListeners() {
        this.container.addEventListener('click', e => {
            if (this.dragState.isDragging) {
                this.dragState.isDragging = false;
                return;
            }
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                this.handleStationClick(target, e);
            }
            else if (target.classList.contains(CSS_VARS.SELECTION_LINE_CLASSNAME)) {
                this.handleTrackClick(target.nextElementSibling, e);
            }
            else if (target.classList.contains(CSS_VARS.TRACK_CLASSNAME)) {
                this.handleTrackClick(target, e);
            }
            else {
                this.handleCanvasClick(e);
            }
        });
        this.container.addEventListener('dblclick', e => {
            // e.preventDefault();
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                const newName = prompt("New name for station:");
                this.stationInstances.get(target).rename(newName);
            }
            //   if (document.getSelection() && document.getSelection().empty) {
            //         document.getSelection = undefined;
            //     } else if (window.getSelection) {
            //         const selection = window.getSelection();
            //         selection.removeAllRanges();
            //     }
        });
        /** Grab station */
        this.container.addEventListener('mousedown', e => {
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME) && !e.ctrlKey) {
                const st = this.stationInstances.get(target);
                this.selectElement(st, true);
                this.dragState = {
                    station: st,
                    startPos: this.getRelativeCoords({ x: e.pageX, y: e.pageY }),
                    isDragging: false
                };
            }
        });
        /** Drag station */
        this.container.addEventListener('mousemove', e => {
            if (!this.dragState.station || !this.dragState.startPos)
                return;
            const currentPos = this.getRelativeCoords({ x: e.pageX, y: e.pageY });
            const dx = currentPos.x - this.dragState.startPos.x;
            const dy = currentPos.y - this.dragState.startPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 3) {
                if (!this.dragState.isDragging) {
                    this.dragState.isDragging = true;
                    this.dragState.station.startDrag();
                }
                this.dragState.station.move(currentPos);
            }
        });
        /** Drop dragged station */
        this.container.addEventListener('mouseup', () => {
            if (this.dragState.station) {
                this.dragState.station.endDrag();
                this.dragState = { isDragging: false };
            }
        });
        this.container.addEventListener('mouseover', e => {
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                this.hoveredStation = this.stationInstances.get(target);
            }
            else if (target.classList.contains(CSS_VARS.SELECTION_LINE_CLASSNAME)) {
                this.hoveredTrack = this.trackInstances.get(target.nextElementSibling);
            }
        });
        this.container.addEventListener('mouseout', e => {
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                this.hoveredStation = null;
            }
        });
        /** Delete station or track by hovering + del key */
        document.addEventListener('keydown', e => {
            if (e.key === "Delete" && this.hoveredStation) {
                this.hoveredStation.delete();
                this.hoveredStation = null;
            }
            if (e.key === "Delete" && this.hoveredTrack) {
                this.hoveredTrack.delete();
                this.hoveredTrack = null;
            }
        });
    }
    /**
     * Handles click events on station elements.
     * Supports creating tracks by Ctrl+clicking two stations.
     * Deselects all other elements and selects the clicked station.
     *
     * @private
     * @param {HTMLElement} station - The clicked station DOM element
     * @param {MouseEvent} e - The click event object
     */
    handleStationClick(station, e) {
        const stationInstance = this.stationInstances.get(station);
        if (e.ctrlKey && this.selectedStationElements.length === 1) {
            const selected = this.selectedStationElements[0];
            this.createTrack({ "startpoint": this.stationInstances.get(selected), "endpoint": stationInstance });
        }
        this.clearSelection();
        stationInstance.select();
    }
    /**
     * Handles click events on track elements.
     * Deselects all other elements and selects the clicked track.
     * Prevents the click event from propagating to the canvas.
     *
     * @private
     * @param {SVGLineElement} track - The clicked track SVG line element
     * @param {MouseEvent} e - The click event object
     */
    handleTrackClick(track, e) {
        e.stopPropagation();
        this.clearSelection();
        this.selectElement(this.trackInstances.get(track));
    }
    /**
     * Handles click events on empty canvas areas.
     * Creates a new station at the click position.
     * If a station is already selected and Ctrl is held, creates a track connecting the two stations.
     *
     * @private
     * @param {MouseEvent} e - The click event object
     */
    handleCanvasClick(e) {
        const coord = this.getRelativeCoords({ x: e.pageX, y: e.pageY });
        const s1 = this.selectedStationElements[0];
        const s2 = this.createStation(coord, false);
        this.clearSelection();
        s2.select();
        if (e.ctrlKey && this.selectedStationElements.length == 1) {
            const tr = this.createTrack({ "startpoint": this.stationInstances.get(s1), "endpoint": s2 });
        }
    }
    /**
     * Deselects all currently selected stations and tracks.
     * Removes the "selected" CSS class from all selected elements.
     */
    clearSelection() {
        Array.from(this.selectedStationElements).forEach(s => this.stationInstances.get(s).deselect());
        Array.from(this.selectedTrackElements).forEach(tr => this.trackInstances.get(tr).deselect());
    }
    /**
     * Creates a new station at the specified coordinates.
     * Registers the station in the stationInstances map for quick lookup.
     *
     * @param {Coordinate} coords - The position where the station should be created
     * @param {boolean} [select=false] - If true, automatically selects the newly created station
     * @returns {Station} The newly created Station instance
     */
    createStation(coords, select = false) {
        const newSt = new Station(this.canvas, coords);
        this.stationInstances.set(newSt.element, newSt);
        if (select)
            this.selectElement(newSt, true);
        return newSt;
    }
    /**
     * Creates a new track connecting two stations.
     * Registers the track in the trackInstances map for quick lookup.
     *
     * @param {TrackStations} stations - Object containing startpoint and endpoint Station instances
     * @returns {Track} The newly created Track instance
     */
    createTrack(stations) {
        const newTr = new Track(this.svg, stations);
        this.trackInstances.set(newTr.element, newTr);
        return newTr;
    }
    /**
     * Selects a single element (station or track), optionally clearing all other selections first.
     *
     * @param {Station | Track} elem - The element to select (Station or Track instance)
     * @param {boolean} [clear=false] - If true, clears all other selections before selecting this element
     */
    selectElement(elem, clear = false) {
        if (clear)
            this.clearSelection();
        elem.select();
    }
}
//# sourceMappingURL=CanvasHandler.js.map