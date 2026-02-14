import { CSS_VARS } from "../new/constants.js";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const VAR_DOT_SIZE = parseFloat(getComputedStyle(document.documentElement)
    .getPropertyValue(CSS_VARS.STATION_SIZE));
export class AppManager {
    container;
    svg;
    canvas;
    showStationLabels = true;
    /** Tracks if dragging just occured (prevents mouseup events) */
    wasDragging = false;
    selectedTrack = undefined;
    selectedStation = undefined;
    draggedStation = undefined;
    grabbedStation = undefined;
    /** Tracks if a dragging operation has been started */
    dragStarted = false;
    /** Mouse position of last mousedown over a station. Used to calculate distance to current mouse pos to initiate dragging. */
    lastMouseDownPos = {};
    /** <StationElement, [TrackElements]> */
    stationsTracks = new WeakMap();
    /**
     * Creates an instance of AppManager.
     * @param container - Container element
     * @param svg - SVG element where Tracks are placed.
     * @param canvas - Div element where Stations are placed. Positioned below svg.
     */
    constructor(container, svg, canvas) {
        this.container = container;
        this.svg = svg;
        this.canvas = canvas;
        this.svg.setAttribute('viewBox', `0 0 ${this.canvas.clientWidth} ${this.canvas.clientHeight}`);
        this.setupEventListeners();
        const s1 = this.createStation({ x: 30, y: 30 });
        const s2 = this.createStation({ x: 400, y: 300 });
        this.createTrack({}, s1, s2);
    }
    createTrack(coord, station1, station2) {
        const group = document.createElementNS(SVG_NAMESPACE, "g");
        const track = document.createElementNS(SVG_NAMESPACE, "line");
        track.classList.add(CSS_VARS.TRACK_CLASSNAME);
        const selectionLine = document.createElementNS(SVG_NAMESPACE, "line");
        selectionLine.classList.add(CSS_VARS.SELECTION_LINE);
        let actualCoords = coord;
        if (station1 && station2) {
            actualCoords = {
                x1: parseFloat(station1.style.left) + VAR_DOT_SIZE / 2,
                y1: parseFloat(station1.style.top) + VAR_DOT_SIZE / 2,
                x2: parseFloat(station2.style.left) + VAR_DOT_SIZE / 2,
                y2: parseFloat(station2.style.top) + VAR_DOT_SIZE / 2
            };
            [station1, station2].forEach(st => {
            });
        }
        [track, selectionLine].forEach(line => {
            this.moveTrack(line, actualCoords);
        });
        group.appendChild(selectionLine);
        group.appendChild(track);
        this.svg.appendChild(group);
        console.log("List of stations, tracks:", this.stationsTracks);
        return track;
    }
    createStation(coord, name = "Unnamed") {
        const station = document.createElement("div");
        const label = document.createElement("div");
        station.classList.add(CSS_VARS.STATION_CLASSNAME);
        label.classList.add(CSS_VARS.STATION_LABEL_CLASSNAME);
        station.style.position = "absolute";
        this.moveStation(station, coord);
        label.textContent = name;
        station.appendChild(label);
        this.canvas.appendChild(station);
        console.log("Created station", station, label);
        return station;
    }
    stationPosFromMouse(pos) {
        if (pos.x && pos.y) {
            const newX = pos.x - VAR_DOT_SIZE;
            const newY = pos.y - VAR_DOT_SIZE;
            return { x: newX, y: newY };
        }
        return pos;
    }
    /** Create new station when clicking empty space on canvas. Create with connection to currently selected station by ctrl+clicking. */
    handleContainerClick(e) {
        let newStation;
        console.log(`Clicked container at X: ${e.pageX} Y: ${e.pageY}`);
        const stationPos = this.stationPosFromMouse({ x: e.pageX, y: e.pageY });
        newStation = this.createStation(stationPos);
        if (e.ctrlKey && this.selectedStation) {
            this.createTrack({}, newStation, this.selectedStation);
        }
        this.unselectStation();
        this.unselectTrack();
        this.selectStation(newStation);
    }
    /**
     * Determines whether an element is interactive (a station dot or track line).
     * @param  e - Pointer event with a target element.
     * @returns True if element is either a station dot or track line, false otherwise.
     */
    isInteractiveElement(e) {
        if (e.target instanceof HTMLElement || e.target instanceof SVGElement) {
            return e.target.classList.contains(CSS_VARS.STATION_CLASSNAME) ||
                e.target.classList.contains(CSS_VARS.TRACK_CLASSNAME) ||
                e.target.classList.contains(CSS_VARS.SELECTION_LINE);
        }
        else {
            return false;
        }
    }
    handleInteractiveClick(e) {
        const target = e.target;
        if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
            if (e.detail == 2) {
                e.stopPropagation();
                const newName = prompt("New name for station:");
                if (newName)
                    this.renameStation(target, newName);
                return;
            }
            if (e.detail == 1 && e.ctrlKey && this.selectedStation) {
                this.createTrack({}, target, this.selectedStation);
            }
            this.unselectStation();
            this.unselectTrack();
            this.selectStation(target);
        }
        else if (target.classList.contains(CSS_VARS.TRACK_CLASSNAME)) {
            e.stopPropagation();
            console.log("Clicked track", target, target.nextSibling);
        }
        else if (target.classList.contains(CSS_VARS.SELECTION_LINE)) {
            this.selectTrack(target.nextSibling);
            console.log("Clicked selection line", target);
        }
        else {
            console.log("Clicked some other interactable target", target);
        }
    }
    setupEventListeners() {
        /** Create new station when clicking container */
        this.container.addEventListener('click', e => {
            /** Prevents creating new dot after just letting go of dragged dot */
            if (this.wasDragging == true) {
                this.wasDragging = false;
            }
            else {
                if (this.isInteractiveElement(e)) {
                    this.handleInteractiveClick(e);
                }
                else {
                    this.handleContainerClick(e);
                }
            }
        });
        this.container.addEventListener('mousedown', e => {
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME) && !e.ctrlKey) {
                this.lastMouseDownPos = { x: e.pageX, y: e.pageY };
                this.grabStation(target);
            }
        });
        this.container.addEventListener('mousemove', e => {
            let currMousePos = { x: e.pageX, y: e.pageY };
            const dist = Math.sqrt((currMousePos.x - this.lastMouseDownPos.x) ** 2 + (currMousePos.y - this.lastMouseDownPos.y) ** 2);
            if (dist > 3 && this.grabbedStation) {
                this.startDraggingGrabbedStation();
                this.moveStation(this.draggedStation, this.stationPosFromMouse(currMousePos));
            }
        });
        this.container.addEventListener('mouseup', e => {
            if (this.draggedStation)
                this.dropCurrentDraggedStation();
            this.grabbedStation = undefined;
        });
    }
    selectStation(st) {
        if (this.selectedStation != st) {
            this.unselectTrack();
            this.unselectStation();
            this.selectedStation = st;
            this.selectedStation.classList.add("selected");
            console.log("Selected station", this.selectedStation);
        }
    }
    unselectStation() {
        if (this.selectedStation) {
            this.selectedStation.classList.remove("selected");
            this.selectedStation = undefined;
        }
    }
    renameStation(st, newName) {
        const label = st.firstChild;
        const currName = label?.textContent;
        if (newName === currName) {
            return;
        }
        label.textContent = newName;
        console.log(`Renamed station from ${currName} to ${newName}`, st);
    }
    selectTrack(tr) {
        this.unselectStation();
        this.unselectTrack();
        this.selectedTrack = tr;
        this.selectedTrack.classList.add("selected");
        console.log("Selected track", this.selectedTrack);
    }
    unselectTrack() {
        if (this.selectedTrack) {
            this.selectedTrack.classList.remove("selected");
            this.selectedTrack = undefined;
        }
    }
    moveStation(st, coords) {
        st.style.left = `${coords.x}px`;
        st.style.top = `${coords.y}px`;
    }
    moveTrack(tr, coords) {
        tr.setAttribute("x1", `${coords.x1}`);
        tr.setAttribute("y1", `${coords.y1}`);
        tr.setAttribute("x2", `${coords.x2}`);
        tr.setAttribute("y2", `${coords.y2}`);
    }
    grabStation(st) {
        this.grabbedStation = st;
        this.dragStarted = false;
        this.selectStation(this.grabbedStation);
        console.log("Grabbed station", this.grabbedStation);
    }
    startDraggingGrabbedStation() {
        if (!this.dragStarted && this.grabbedStation) {
            this.draggedStation = this.grabbedStation;
            this.draggedStation.classList.add("dragging");
            this.dragStarted = true;
            this.wasDragging = true;
            console.log("Started dragging station", this.draggedStation);
        }
    }
    dropCurrentDraggedStation() {
        console.log("Dropped station", this.draggedStation);
        this.draggedStation.classList.remove("dragging");
        this.dragStarted = false;
        this.draggedStation = undefined;
        this.grabbedStation = undefined;
    }
}
/**
 * Sets up event delegation for station dots within a parent container.
 * Attaches a single listener to the target element that filters for dots (identified by CSS_VARS.DOT_CLASSNAME)
 * @param {string} type - Event type (e.g., 'click', 'mousedown')
 * @param {HTMLElement} target - Parent element to attach the delegated listener to
 * @param {StationViewInstanceEventCallback} callback - Called with (event, stationView) when a dot is targeted
 */
// addStationListener(type: string, target: HTMLElement, callback: (e: Event) => void) {
//     target.addEventListener(type, (e) => {
//         if (e.target instanceof HTMLElement && e.target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
//             callback(e);
//         }
//     });
// }
// grabStation(e) {
//     e.preventDefault();
//     this.mouseDownPos = {x: e.pageX, y: e.pageY};
//     this.grabbedStation = e.target;
//     this.grabbedStation?.classList.add("selected")
//     this.dragStarted = false;
//     // console.log("Grabbed station, ", this.grabbedStationPresenter)
// };
// moveStation(e: Event) {
// if (this.grabbedStationPresenter && !this.dragStarted) {
//     var x1 = e.pageX;
//     var y1 = e.pageY;
//     var x2 = this.mouseDownPos.x;
//     var y2 = this.mouseDownPos.y;
//     const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
//     if (dist >= 3) {
//         this.wasDragging = true;
//         this.dragStarted = true;
//         this.draggedStationPresenter = this.grabbedStationPresenter;
//         this.draggedStationPresenter.startDrag();
//     }
// }
// if (this.draggedStationPresenter && this.dragStarted) {
//         this.draggedStationPresenter.reposition(e.pageX, e.pageY);
// }
// }
// dropStation() {
// if (this.draggedStation && this.dragStarted) {
//     this.draggedStation.classList.remove("dragging")
//     this.dragStarted = false;
//     this.mouseDownPos = {};
// }
// this.draggedStation = null;
// this.grabbedStation = null;
//# sourceMappingURL=AppManager.js.map