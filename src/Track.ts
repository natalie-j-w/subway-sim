import {CSS_VARS} from "../constants.js"
import { Station } from "./Station";
import { Coordinate, TrackCoordinate, TrackStations } from "./Interfaces";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export class Track {
    element: SVGLineElement;
    selectionElement: SVGLineElement;
    parent: SVGElement;
    stations: TrackStations;
    coords: TrackCoordinate;

    constructor(parent: SVGElement, stations: TrackStations) {
        this.parent = parent;
        this.stations = stations;
        this.coords = {
            x1: this.stations.startpoint.x, y1: this.stations.startpoint.y,
            x2: this.stations.endpoint.y, y2: this.stations.endpoint.y
        }
        this.element = this.createDomElement();
        (this.element as any)._trackInstance = this;
    }

    private createDomElement(): SVGLineElement {
        const group = document.createElementNS(SVG_NAMESPACE, "g");
        const newTrack = document.createElementNS(SVG_NAMESPACE, "line");
        const newSelectionLine = document.createElementNS(SVG_NAMESPACE, "line");

        newSelectionLine.classList.add(CSS_VARS.SELECTION_LINE_CLASSNAME);
        newTrack.classList.add(CSS_VARS.TRACK_CLASSNAME);

        const s1Center = this.stations.startpoint.getCenterCoords();
        const s2Center = this.stations.endpoint.getCenterCoords();
        const coords: TrackCoordinate = { x1: s1Center.x, y1: s1Center.y, x2: s2Center.x, y2: s2Center.y };

        [newSelectionLine, newTrack].forEach(line => {
            line.setAttribute("x1", String(coords.x1));
            line.setAttribute("y1", String(coords.y1));
            line.setAttribute("x2", String(coords.x2));
            line.setAttribute("y2", String(coords.y2));
        });

        group.appendChild(newSelectionLine);
        group.appendChild(newTrack);
        this.parent.appendChild(group);

        this.stations.startpoint.addTrack(this);
        this.stations.endpoint.addTrack(this);

        return newTrack;
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
    moveWithStation(station: Station) {
        if (this.stations.startpoint === station) {
            this.element.setAttribute("x1", String(station.coords.x));
            this.element.setAttribute("y1", String(station.coords.y));
            this.selectionElement.setAttribute("x1", String(station.coords.y));
            this.selectionElement.setAttribute("y1", String(station.coords.y));
        } else if (this.stations.endpoint === station) {
            this.element.setAttribute("x2", String(station.coords.x));
            this.element.setAttribute("y2", String(station.coords.y));
            this.selectionElement.setAttribute("x2", String(station.coords.y));
            this.selectionElement.setAttribute("y2", String(station.coords.y));
        } else {
            return;
        }
    }

    delete() {
        this.parent.removeChild(this.element);
        this.parent.removeChild(this.selectionElement);
    }
}