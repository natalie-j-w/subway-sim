import {CSS_VARS} from "../constants.js"
import {Coordinate} from "./Interfaces.js"
import { Track } from "./Track.js";



export class Station {
    parent: HTMLElement;
    element: HTMLElement;
    labelElement: HTMLElement;
    coords: Coordinate;
    name: string = "Unnamed";
    tracks: Set<Track> = new Set();

    constructor(parent: HTMLElement, coord: Coordinate, name: string = "Unnamed") {
        this.parent = parent;
        this.coords = coord;
        this.createDomElement();
    }

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

    addTrack(tr: Track) {
        this.tracks.add(tr);
    }

    removeTrack(tr: Track) {
        this.tracks.delete(tr);
    }

    select() {
        this.element.classList.add("selected");
        // console.log("Selected", this)
    }

    deselect() {
        this.element.classList.remove("selected");
        // console.log("Deselected", this);
    }

    delete() {
        this.parent.removeChild(this.element);
    }

    move(newCoords: Coordinate) {
        this.coords = newCoords;
        this.element.style.left = `${this.coords.x}px`;
        this.element.style.top = `${this.coords.y}px`;

        this.tracks.forEach(tr => {
            tr.moveWithStation(this);
        })
    }

    startDrag() {
        this.element.classList.add("dragging");
        // console.log("Started dragging", this)
    }

    endDrag() {
        this.element.classList.remove("dragging");
        // console.log("Stopped dragging", this)
    }

    rename(newName: string) {
        if (this.name === newName) return;
        else {
            console.log(`Renamed`, this, `from ${this.name} to ${newName}`)
            this.name = newName;
            this.labelElement.textContent = this.name;
        }
    }
}

