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
    selectedStation = undefined;
    draggedStation = undefined;
    grabbedStation = undefined;
    /** Tracks if a dragging operation has been started */
    dragStarted = false;
    /** Mouse position of last mousedown over a station. Used to calculate distance to current mouse pos to initiate dragging. */
    mouseDownPos = {};
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
        this.createTrack({ x1: 20, y1: 20, x2: 60, y2: 60 });
        this.createStation({ x: 30, y: 30 });
    }
    createTrack(coord, station1, station2) {
        const track = document.createElementNS(SVG_NAMESPACE, "line");
        let actualCoords = coord;
        if (station1 && station2) {
            actualCoords = { x1: parseFloat(station1.style.left) + VAR_DOT_SIZE / 2, y1: parseFloat(station1.style.top) + VAR_DOT_SIZE / 2,
                x2: parseFloat(station2.style.left) + VAR_DOT_SIZE / 2, y2: parseFloat(station2.style.top) + VAR_DOT_SIZE / 2 };
        }
        track.classList.add(CSS_VARS.TRACK_CLASSNAME);
        track.setAttribute("x1", String(actualCoords.x1));
        track.setAttribute("y1", String(actualCoords.y1));
        track.setAttribute("x2", String(actualCoords.x2));
        track.setAttribute("y2", String(actualCoords.y2));
        track.setAttribute("stroke", "green");
        track.setAttribute("stroke-width", "2");
        this.svg.appendChild(track);
        console.log("Created track", track);
        return track;
    }
    createStation(coord, name = "Unnamed") {
        const station = document.createElement("div");
        const label = document.createElement("div");
        station.classList.add(CSS_VARS.STATION_CLASSNAME);
        station.style.position = "absolute";
        station.style.left = `${coord.x}px`;
        station.style.top = `${coord.y}px`;
        label.textContent = name;
        label.classList.add(CSS_VARS.STATION_LABEL_CLASSNAME);
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
    handleContainerClick(e) {
        console.log(`Clicked container at X: ${e.pageX} Y: ${e.pageY}`);
        const stationPos = this.stationPosFromMouse({ x: e.pageX, y: e.pageY });
        /** Create new station when clicking empty space on canvas */
        const station = this.createStation(stationPos);
        if (e.ctrlKey && this.selectedStation) {
            this.createTrack({}, station, this.selectedStation);
        }
        this.unselectStation();
        this.selectStation(station);
    }
    /**
     * Determines whether an element is interactive (a station dot or track line).
     * @param  e - Pointer event with a target element.
     * @returns True if element is either a station dot or track line, false otherwise.
     */
    isInteractiveElement(e) {
        if (e.target instanceof HTMLElement) {
            return e.target.classList.contains(CSS_VARS.STATION_CLASSNAME) ||
                e.target.classList.contains(CSS_VARS.TRACK_CLASSNAME);
        }
        else {
            return false;
        }
    }
    handleInteractiveClick(e) {
        const target = e.target;
        if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
            console.log("Clicked station", target);
            if (e.detail == 1 && e.ctrlKey && this.selectedStation) {
                console.log("Ctrl click");
                this.createTrack({}, target, this.selectedStation);
            }
            else {
                console.log("Nah");
            }
            this.unselectStation();
            this.selectStation(target);
        }
        else if (target.classList.contains(CSS_VARS.TRACK_CLASSNAME)) {
            console.log("Clicked track", target);
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
                return;
            }
            if (this.isInteractiveElement(e)) {
                this.handleInteractiveClick(e);
            }
            else {
                this.handleContainerClick(e);
            }
        });
        this.container.addEventListener('mousedown', e => {
        });
    }
    selectStation(st) {
        this.selectedStation = st;
        this.selectedStation.classList.add("selected");
    }
    unselectStation() {
        if (this.selectedStation) {
            this.selectedStation.classList.remove("selected");
            this.selectedStation = undefined;
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
    // update(eventType, payload) {
    //     switch (eventType) {
    //         case StationPresenter.NOTIFICATION_TYPES.SELECT: {
    //             if (this.selectedStationPresenter && this.selectedStationPresenter !== payload.source) {
    //                 this.selectedStationPresenter.deselect();
    //             }
    //             this.selectedStationPresenter = payload.source;
    //             break;
    //         }
    //         case StationPresenter.NOTIFICATION_TYPES.DESELECT: {
    //             this.selectedStationPresenter = null;
    //             break;
    //         }
    //         case StationPresenter.NOTIFICATION_TYPES.START_DRAG: {
    //             this.draggedStationPresenter = payload.source;
    //             break;
    //         }
    //         case StationPresenter.NOTIFICATION_TYPES.END_DRAG: {
    //             this.draggedStationPresenter = null;
    //             break;
    //         }
    //         // TODO: AppManager track event notifs
    //         case TrackPresenter.NOTIFICATION_TYPES.SELECT: {
    //             break;
    //         }
    //         case TrackPresenter.NOTIFICATION_TYPES.DESELECT: {
    //             break;
    //         }
    //     }
    // }
    // handleStationClick(e) {
    //         // console.log("Clicked station", clickedStationPresenter)
    //         /** Double left-click to change station name */
    //         if (e.detail == 2) {
    //             e.stopPropagation();
    //             this.dropStation();
    //             const newName = prompt("Enter new station name: ");
    //             if (newName) {
    //                 // TODO: Label
    //                 return;
    //             }
    //             this.dropStation();
    //             return;
    //         }
    //         /** Single left-click (without ctrl key) to select */
    //         if (e.detail == 1 && !e.ctrlKey) {
    //             this.selectedStation = e.target;
    //             // }
    //         }
    // }
    // grabStation(e) {
    //     e.preventDefault();
    //     this.mouseDownPos = {x: e.pageX, y: e.pageY};
    //     this.grabbedStation = e.target;
    //     this.grabbedStation?.classList.add("selected")
    //     this.dragStarted = false;
    //     // console.log("Grabbed station, ", this.grabbedStationPresenter)
    // };
    moveStation(e) {
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
    }
    dropStation() {
        // if (this.draggedStation && this.dragStarted) {
        //     this.draggedStation.classList.remove("dragging")
        //     this.dragStarted = false;
        //     this.mouseDownPos = {};
        // }
        // this.draggedStation = null;
        // this.grabbedStation = null;
    }
}
//# sourceMappingURL=AppManager.js.map