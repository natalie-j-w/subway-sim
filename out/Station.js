import { CSS_VARS } from "../constants.js";
export class Station {
    parent;
    element;
    labelElement;
    coords;
    name = "Unnamed";
    tracks = new Set();
    constructor(parent, coord, name = "Unnamed") {
        this.parent = parent;
        this.coords = coord;
        this.createDomElement();
    }
    createDomElement() {
        const station = document.createElement("div");
        const label = document.createElement("div");
        station.classList.add(CSS_VARS.STATION_CLASSNAME);
        label.classList.add(CSS_VARS.STATION_LABEL_CLASSNAME);
        label.textContent = this.name;
        station.style.position = "absolute";
        station.style.left = `${this.coords.x}px`;
        station.style.top = `${this.coords.y}px`;
        station.appendChild(label);
        this.parent.appendChild(station);
        this.element = station;
        this.labelElement = label;
    }
    addTrack(tr) {
        this.tracks.add(tr);
    }
    removeTrack(tr) {
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
    move(newCoords) {
        this.coords = newCoords;
        this.element.style.left = `${this.coords.x}px`;
        this.element.style.top = `${this.coords.y}px`;
        this.tracks.forEach(tr => {
            tr.moveWithStation(this);
        });
    }
    startDrag() {
        this.element.classList.add("dragging");
        // console.log("Started dragging", this)
    }
    endDrag() {
        this.element.classList.remove("dragging");
        // console.log("Stopped dragging", this)
    }
    rename(newName) {
        if (this.name === newName)
            return;
        else {
            console.log(`Renamed`, this, `from ${this.name} to ${newName}`);
            this.name = newName;
            this.labelElement.textContent = this.name;
        }
    }
}
//# sourceMappingURL=Station.js.map