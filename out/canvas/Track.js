import { CSS_VARS } from "../../constants.js";
import { getDistance } from "../util/UtilFunctions.js";
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
    /** Unique ID of the track */
    id;
    /** The main SVG line element representing the visible track */
    element;
    /** An invisible SVG line overlaid for easier selection and hover detection */
    selectionElement;
    /** Track label */
    labelElement;
    /** The parent SVG container element */
    parent;
    /** The two stations connected by this track */
    stations;
    /** The current line coordinates of the track */
    coords;
    length;
    /**
     * Creates a new Track instance connecting two stations.
     * Initializes the SVG elements for both the track and selection line.
     *
     * @param {SVGElement} parent - The SVG container where the track will be rendered
     * @param {TrackStations} stations - Object containing startpoint and endpoint station instances
     */
    constructor(parent, stations, id) {
        this.parent = parent;
        this.stations = stations;
        this.coords = {
            x1: this.stations.startpoint.coords.x, y1: this.stations.startpoint.coords.y,
            x2: this.stations.endpoint.coords.x, y2: this.stations.endpoint.coords.y
        };
        this.id = id;
        this.createDomElement();
        this.updateLength();
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
        const newLabel = document.createElementNS(SVG_NAMESPACE, "text");
        newTrack.classList.add(CSS_VARS.TRACK_CLASSNAME);
        newLabel.classList.add(CSS_VARS.TRACK_LABEL_CLASSNAME);
        newSelectionLine.classList.add(CSS_VARS.SELECTION_LINE_CLASSNAME);
        [newSelectionLine, newTrack].forEach(line => {
            line.setAttribute("x1", String(this.coords.x1));
            line.setAttribute("y1", String(this.coords.y1));
            line.setAttribute("x2", String(this.coords.x2));
            line.setAttribute("y2", String(this.coords.y2));
        });
        newLabel.setAttribute("x", this.getMid().x.toString());
        newLabel.setAttribute("y", this.getMid().y.toString());
        group.appendChild(newSelectionLine);
        group.appendChild(newTrack);
        group.appendChild(newLabel);
        this.element = newTrack;
        this.selectionElement = newSelectionLine;
        this.labelElement = newLabel;
        this.updateLength();
        this.parent.appendChild(group);
        this.stations.startpoint.addTrack(this);
        this.stations.endpoint.addTrack(this);
    }
    getMid() {
        const midX = (this.coords.x1 + this.coords.x2) / 2;
        const midY = (this.coords.y1 + this.coords.y2) / 2;
        return { x: midX, y: midY };
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
     * Updates track length automatically.
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
        this.coords = {
            x1: Math.round(this.stations.startpoint.coords.x), y1: Math.round(this.stations.startpoint.coords.y),
            x2: Math.round(this.stations.endpoint.coords.x), y2: Math.round(this.stations.endpoint.coords.y)
        };
        if (this.stations.startpoint === station) {
            this.element.setAttribute("x1", String(this.coords.x1));
            this.element.setAttribute("y1", String(this.coords.y1));
            this.selectionElement.setAttribute("x1", String(this.coords.x1));
            this.selectionElement.setAttribute("y1", String(this.coords.y1));
        }
        else if (this.stations.endpoint === station) {
            this.element.setAttribute("x2", String(this.coords.x2));
            this.element.setAttribute("y2", String(this.coords.y2));
            this.selectionElement.setAttribute("x2", String(this.coords.x2));
            this.selectionElement.setAttribute("y2", String(this.coords.y2));
        }
        else {
            return;
        }
        this.updateLength();
        this.labelElement.setAttribute("x", this.getMid().x.toString());
        this.labelElement.setAttribute("y", this.getMid().y.toString());
    }
    /**
     * Updates length attribute to current distance between start- and endpoint.
     * Also updates label.
     */
    updateLength() {
        const currStationSize = getComputedStyle(document.documentElement).getPropertyValue(CSS_VARS.STATION_SIZE);
        const newLength = getDistance({ x: this.coords.x1, y: this.coords.y1 }, { x: this.coords.x2, y: this.coords.y2 });
        const correctedLength = Math.round((newLength - Number.parseFloat(currStationSize)) / 40);
        if (correctedLength < 0)
            this.length = 0;
        else if (correctedLength == this.length) {
            return;
        }
        else
            this.length = correctedLength;
        this.labelElement.textContent = this.length.toString();
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