import { CSS_VARS } from "../constants.js";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
/**
 * Represents a track (line) connecting two subway stations.
 * Handles creation, positioning, selection, and interaction of track elements as SVG lines.
 *
 * @property {SVGLineElement} element - The main SVG line element representing the track
 * @property {SVGLineElement} selectionElement - An invisible SVG line for easier selection/hovering
 * @property {SVGElement} parent - The SVG container where the track is rendered
 * @property {TrackStations} stations - The start and end stations connected by this track
 * @property {TrackCoordinate} coords - The line coordinates (x1, y1, x2, y2)
 *
 * @example
 * const track = new Track(svgElement, {
 *   startpoint: station1,
 *   endpoint: station2
 * });
 * track.select();
 */
export class Track {
    /** The main SVG line element representing the visible track */
    element;
    /** An invisible SVG line overlaid for easier selection and hover detection */
    selectionElement;
    /** The parent SVG container element */
    parent;
    /** The two stations connected by this track */
    stations;
    /** The current line coordinates of the track */
    coords;
    /**
     * Creates a new Track instance connecting two stations.
     * Initializes the SVG elements for both the track and selection line.
     *
     * @param {SVGElement} parent - The SVG container where the track will be rendered
     * @param {TrackStations} stations - Object containing startpoint and endpoint station instances
     */
    constructor(parent, stations) {
        this.parent = parent;
        this.stations = stations;
        this.coords = {
            x1: this.stations.startpoint.coords.x, y1: this.stations.startpoint.coords.y,
            x2: this.stations.endpoint.coords.x, y2: this.stations.endpoint.coords.y
        };
        this.element = this.createDomElement();
        this.element._trackInstance = this;
    }
    /**
     * Creates the DOM/SVG elements for the track.
     * Creates both the visible track line and an invisible selection line for better interaction.
     * Registers this track with both connected stations.
     *
     * @private
     * @returns {SVGLineElement} The main track line element
     */
    createDomElement() {
        const group = document.createElementNS(SVG_NAMESPACE, "g");
        const newTrack = document.createElementNS(SVG_NAMESPACE, "line");
        const newSelectionLine = document.createElementNS(SVG_NAMESPACE, "line");
        newTrack.classList.add(CSS_VARS.TRACK_CLASSNAME);
        newSelectionLine.classList.add(CSS_VARS.SELECTION_LINE_CLASSNAME);
        [newSelectionLine, newTrack].forEach(line => {
            line.setAttribute("x1", String(this.coords.x1));
            line.setAttribute("y1", String(this.coords.y1));
            line.setAttribute("x2", String(this.coords.x2));
            line.setAttribute("y2", String(this.coords.y2));
        });
        group.appendChild(newSelectionLine);
        group.appendChild(newTrack);
        this.parent.appendChild(group);
        this.stations.startpoint.addTrack(this);
        this.stations.endpoint.addTrack(this);
        this.selectionElement = newSelectionLine;
        return newTrack;
    }
    /**
     * Selects the track by adding the "selected" CSS class.
     * Updates the visual state to show the track as selected.
     */
    select() {
        this.element.classList.add("selected");
        // console.log("Selected", this);
    }
    /**
     * Deselects the track by removing the "selected" CSS class.
     * Updates the visual state to show the track as deselected.
     */
    deselect() {
        this.element.classList.remove("selected");
        // console.log("Deselected", this);
    }
    /**
     * Moves the track with a given station if it is one of the track's endpoints.
     * Updates the coordinates of both the main track and selection line elements.
     * This method is called when a connected station is moved.
     *
     * @param {Station} station - The station that has been moved
     * @returns {void} Returns early if station is not an endpoint of this track
     *
     * @remarks
     * Updates x1/y1 coordinates if station is the startpoint, or x2/y2 if it's the endpoint.
     */
    moveWithStation(station) {
        if (this.stations.startpoint === station) {
            this.element.setAttribute("x1", String(station.coords.x));
            this.element.setAttribute("y1", String(station.coords.y));
            this.selectionElement.setAttribute("x1", String(station.coords.x));
            this.selectionElement.setAttribute("y1", String(station.coords.y));
        }
        else if (this.stations.endpoint === station) {
            this.element.setAttribute("x2", String(station.coords.x));
            this.element.setAttribute("y2", String(station.coords.y));
            this.selectionElement.setAttribute("x2", String(station.coords.x));
            this.selectionElement.setAttribute("y2", String(station.coords.y));
        }
        else {
            return;
        }
    }
    /**
     * Deletes the track by removing its SVG group element from the parent SVG.
     * This removes both the visible track and the selection line from the DOM.
     */
    delete() {
        this.element.parentElement.remove();
    }
}
//# sourceMappingURL=Track.js.map