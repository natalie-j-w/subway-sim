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
            x1: this.stations.startpoint.coords.x, y1: this.stations.startpoint.coords.y,
            x2: this.stations.endpoint.coords.x, y2: this.stations.endpoint.coords.y
        }
        this.element = this.createDomElement();
        (this.element as any)._trackInstance = this;
    }

    private createDomElement(): SVGLineElement {
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

    select() {
        this.element.classList.add("selected");
        // console.log("Selected", this);
    }

    deselect() {
        this.element.classList.remove("selected");
        // console.log("Deselected", this);
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
        this.element.parentElement.remove();
    }
}