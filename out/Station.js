import { CSS_VARS } from "../constants.js";
const VAR_STATION_SIZE = parseFloat(getComputedStyle(document.documentElement)
    .getPropertyValue(CSS_VARS.STATION_SIZE));
export class Station {
    parent;
    element;
    coords;
    name = "Unnamed";
    tracks = new Set();
    constructor(parent, coord, name = "Unnamed") {
        this.parent = parent;
        this.coords = coord;
        this.element = this.createDomElement();
        this.element._stationInstance = this;
    }
    createDomElement() {
        const station = document.createElement("div");
        const label = document.createElement("div");
        station.classList.add(CSS_VARS.STATION_CLASSNAME);
        label.classList.add(CSS_VARS.STATION_LABEL_CLASSNAME);
        label.textContent = this.name;
        station.style.position = "absolute";
        station.style.left = `${this.coords.x - VAR_STATION_SIZE / 2}px`;
        station.style.top = `${this.coords.y - VAR_STATION_SIZE / 2}px`;
        station.appendChild(label);
        this.parent.appendChild(station);
        return station;
    }
    getCenterCoords() {
        return {
            x: this.coords.x + VAR_STATION_SIZE / 2,
            y: this.coords.y + VAR_STATION_SIZE / 2
        };
    }
    addTrack(tr) {
        this.tracks.add(tr);
    }
    removeTrack(tr) {
        this.tracks.delete(tr);
    }
    select() {
        this.element.classList.add("selected");
    }
    deselect() {
        this.element.classList.remove("selected");
    }
    delete() {
        this.parent.removeChild(this.element);
    }
    move(newCoords) {
        this.coords = newCoords;
        this.element.style.left = `${this.coords.x - VAR_STATION_SIZE / 2}px`;
        this.element.style.top = `${this.coords.y - VAR_STATION_SIZE / 2}px`;
        this.tracks.forEach(tr => {
            tr.moveWithStation(this);
        });
    }
}
//# sourceMappingURL=Station.js.map