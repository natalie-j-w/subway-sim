import { CSS_VARS } from "../constants.js";
import { Station } from "./Station.js";
import { Track } from "./Track.js";
export class CanvasHandler {
    container;
    svg;
    canvas;
    stationInstances = new Map();
    trackInstances = new Map();
    hoveredStation;
    hoveredTrack;
    selectedTrackElements;
    selectedStationElements;
    dragState = { isDragging: false };
    constructor(container, svg, canvas) {
        this.container = container;
        this.svg = svg;
        this.canvas = canvas;
        this.selectedStationElements = document.getElementsByClassName(CSS_VARS.STATION_CLASSNAME + " selected");
        this.selectedTrackElements = document.getElementsByClassName(CSS_VARS.TRACK_CLASSNAME + " selected");
        this.svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`);
        this.setupEventListeners();
        const s1 = this.createStation({ x: 30, y: 30 });
        const s2 = this.createStation({ x: 100, y: 200 });
        const tr = this.createTrack({ "startpoint": s1, "endpoint": s2 });
        console.log(s1, s2, tr);
        this.clearSelection();
        const resizeObserver = new ResizeObserver(() => {
            this.svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`);
        });
        resizeObserver.observe(container);
    }
    /** Get mouse coordinates relative to canvas container */
    getRelativeCoords(coords) {
        const bounds = this.container.getBoundingClientRect();
        return {
            x: coords.x - bounds.left,
            y: coords.y - bounds.top
        };
    }
    setupEventListeners() {
        this.container.addEventListener('click', e => {
            if (this.dragState.isDragging) {
                this.dragState.isDragging = false;
                return;
            }
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                this.handleStationClick(target, e);
            }
            else if (target.classList.contains(CSS_VARS.SELECTION_LINE_CLASSNAME)) {
                this.handleTrackClick(target.nextElementSibling, e);
            }
            else if (target.classList.contains(CSS_VARS.TRACK_CLASSNAME)) {
                this.handleTrackClick(target, e);
            }
            else {
                this.handleCanvasClick(e);
            }
        });
        this.container.addEventListener('dblclick', e => {
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                const newName = prompt("New name for station:");
                this.stationInstances.get(target).rename(newName);
            }
        });
        /** Grab station */
        this.container.addEventListener('mousedown', e => {
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME) && !e.ctrlKey) {
                const st = this.stationInstances.get(target);
                this.selectElement(st, true);
                this.dragState = {
                    station: st,
                    startPos: this.getRelativeCoords({ x: e.pageX, y: e.pageY }),
                    isDragging: false
                };
            }
        });
        /** Drag station */
        this.container.addEventListener('mousemove', e => {
            if (!this.dragState.station || !this.dragState.startPos)
                return;
            const currentPos = this.getRelativeCoords({ x: e.pageX, y: e.pageY });
            const dx = currentPos.x - this.dragState.startPos.x;
            const dy = currentPos.y - this.dragState.startPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 3) {
                if (!this.dragState.isDragging) {
                    this.dragState.isDragging = true;
                    this.dragState.station.startDrag();
                }
                this.dragState.station.move(currentPos);
            }
        });
        /** Drop dragged station */
        this.container.addEventListener('mouseup', () => {
            if (this.dragState.station) {
                this.dragState.station.endDrag();
                this.dragState = { isDragging: false };
            }
        });
        this.container.addEventListener('mouseover', e => {
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                this.hoveredStation = this.stationInstances.get(target);
            }
            else if (target.classList.contains(CSS_VARS.SELECTION_LINE_CLASSNAME)) {
                this.hoveredTrack = this.trackInstances.get(target.nextElementSibling);
            }
        });
        this.container.addEventListener('mouseout', e => {
            const target = e.target;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                this.hoveredStation = null;
            }
        });
        /** Delete station or track by hovering + del key */
        document.addEventListener('keydown', e => {
            if (e.key === "Delete" && this.hoveredStation) {
                this.hoveredStation.delete();
                this.hoveredStation = null;
            }
            if (e.key === "Delete" && this.hoveredTrack) {
                this.hoveredTrack.delete();
                this.hoveredTrack = null;
            }
        });
    }
    handleStationClick(station, e) {
        const stationInstance = this.stationInstances.get(station);
        if (e.ctrlKey && this.selectedStationElements.length === 1) {
            const [selected] = this.selectedStationElements;
            this.createTrack({ "startpoint": this.stationInstances.get(selected), "endpoint": stationInstance });
        }
        this.clearSelection();
        stationInstance.select();
    }
    /** Select track */
    handleTrackClick(track, e) {
        e.stopPropagation();
        this.clearSelection();
        this.selectElement(this.trackInstances.get(track));
    }
    /** Click canvas to create station */
    handleCanvasClick(e) {
        const coord = this.getRelativeCoords({ x: e.pageX, y: e.pageY });
        const [s1] = this.selectedStationElements;
        const s2 = this.createStation(coord, false);
        this.clearSelection();
        s2.select();
        if (e.ctrlKey && this.selectedStationElements.length == 1) {
            const tr = this.createTrack({ "startpoint": this.stationInstances.get(s1), "endpoint": s2 });
        }
    }
    /** Deselect all selected stations and tracks */
    clearSelection() {
        [...this.selectedStationElements].forEach(s => this.stationInstances.get(s).deselect());
        [...this.selectedTrackElements].forEach(tr => this.trackInstances.get(tr).deselect());
    }
    /**
     *
     * @param coords
     * @param select True to select station after creation. Default: false
     * @returns
     */
    createStation(coords, select = false) {
        const newSt = new Station(this.canvas, coords);
        this.stationInstances.set(newSt.element, newSt);
        if (select)
            this.selectElement(newSt, true);
        return newSt;
    }
    createTrack(stations) {
        const newTr = new Track(this.svg, stations);
        this.trackInstances.set(newTr.element, newTr);
        return newTr;
    }
    /**
     *
     * @param elem
     * @param clear True to clear entire selection before selecting element. Default: false.
     */
    selectElement(elem, clear = false) {
        if (clear)
            this.clearSelection();
        elem.select();
    }
}
//# sourceMappingURL=CanvasHandler.js.map