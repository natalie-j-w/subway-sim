import { CSS_VARS } from "../constants.js";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
export class Track {
    element;
    selectionElement;
    parent;
    stations;
    coords;
    constructor(parent, coords) {
        this.parent = parent;
        this.coords = coords;
        this.element = this.createDomElement();
        this.element._trackInstance = this;
    }
    createDomElement() {
        const group = document.createElementNS(SVG_NAMESPACE, "g");
        const track = document.createElementNS(SVG_NAMESPACE, "line");
        const selectionLine = document.createElementNS(SVG_NAMESPACE, "line");
        selectionLine.classList.add(CSS_VARS.SELECTION_LINE_CLASSNAME);
        track.classList.add(CSS_VARS.TRACK_CLASSNAME);
        const s1Center = this.stations.startpoint.getCenterCoords();
        const s2Center = this.stations.endpoint.getCenterCoords();
        const coords = { x1: s1Center.x, y1: s1Center.y, x2: s2Center.x, y2: s2Center.y };
        [selectionLine, track].forEach(line => {
            line.setAttribute("x1", String(coords.x1));
            line.setAttribute("y1", String(coords.y1));
            line.setAttribute("x2", String(coords.x2));
            line.setAttribute("y2", String(coords.y2));
        });
        group.appendChild(selectionLine);
        group.appendChild(track);
        this.parent.appendChild(group);
        this.stations.startpoint.addTrack(this);
        this.stations.endpoint.addTrack(this);
        return track;
    }
    select() {
        this.element.classList.add("selected");
    }
    deselect() {
        this.element.classList.remove("selected");
    }
    /**
     * Moves track with provided station if station is either the start or endpoint.
     * @param station
     * @returns
     */
    moveWithStation(station) {
        if (this.stations.startpoint === station) {
            this.element.setAttribute("x1", String(station.coords.x));
            this.element.setAttribute("y1", String(station.coords.y));
            this.selectionElement.setAttribute("x1", String(station.coords.y));
            this.selectionElement.setAttribute("y1", String(station.coords.y));
        }
        else if (this.stations.endpoint === station) {
            this.element.setAttribute("x2", String(station.coords.x));
            this.element.setAttribute("y2", String(station.coords.y));
            this.selectionElement.setAttribute("x2", String(station.coords.y));
            this.selectionElement.setAttribute("y2", String(station.coords.y));
        }
        else {
            return;
        }
    }
    delete() {
        this.parent;
    }
}
//# sourceMappingURL=Track.js.map