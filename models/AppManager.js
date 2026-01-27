import {StationPresenter} from "../viewModels/StationPresenter.js"
import { StationData } from "../models/StationData.js"
import { StationView } from "../components/StationView.js"
import { CSS_VARS } from "../constants.js"

export class AppManager {
    /** @type {HTMLElement} */
    container

    /** @type {HTMLElement} */
    svg

    /** @type {HTMLElement} */
    canvas

    /** @type {boolean} */
    showStationLabels;

    /** @type {boolean} Tracks if dragging just occured (prevents mouseup events) */
    wasDragging

    /** @type {StationPresenter} */
    draggedStationVM

    /** @type {StationPresenter}*/
    selectedStationVM

    /**
     * Creates an instance of AppManager.
     * @param {HTMLElement} container - Container element
     * @param {HTMLElement} svg - SVG element where Tracks are placed.
     * @param {HTMLElement} canvas - Div element where Stations are placed. Positioned below svg.
     */
    constructor(container, svg, canvas) {
        this.container = container;
        this.svg = svg;
        this.canvas = canvas;
        this.showStationLabels = true;
        this.wasDragging = false;
        this.draggedStationVM = null;
        this.selectedStationVM = null;

        this.setupEventListeners();
        this.svg.setAttribute('viewBox', `0 0 ${this.canvas.clientWidth} ${this.canvas.clientHeight}`)
    }

    /**
     * Sets up event delegation for station dots within a parent container.
     * Attaches a single listener to the target element that filters for dots
     * (identified by CSS_VARS.DOT_CLASSNAME) and retrieves their associated StationView instance.
     * @param {string} type - Event type (e.g., 'click', 'mousedown')
     * @param {HTMLElement} target - Parent element to attach the delegated listener to
     * @param {StationViewInstanceEventCallback} callback - Called with (event, stationView) when a dot is targeted
     */
    addDotListener(type, target, callback) {
        target.addEventListener(type, (e) => {
            if (e.target.classList.contains(CSS_VARS.DOT_CLASSNAME)) {
                const stationView = e.target.stationViewInstance;
                callback(e, stationView);
            }
        });
    }

    /**
     * Determines whether an element is interactive (a station dot or track line).
     * @param {PointerEvent} e - Pointer event with a target element.
     * @returns {boolean} True if element is either a station dot or track line, false otherwise.
     */
    isInteractiveElement(e) {
        return e.target.classList.contains(CSS_VARS.DOT_CLASSNAME) ||
               e.target.classList.contains(CSS_VARS.LINE_CLASSNAME) 
    }

    handleStationEvent(eventType, sourceVM) {
        switch (eventType) {
            case StationPresenter.NOTIFICATION_TYPES.SELECT: {
                this.selectedStationVM?.deselect();
                this.selectedStationVM = sourceVM;
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.DESELECT: {
                this.selectedStationVM?.deselect();
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.START_DRAG: {
                this.draggedStationVM = sourceVM;
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.END_DRAG: {
                this.draggedStationVM = null;
                break;
            }
        }
    }

    setupEventListeners() {

        // Create new station when clicking container
        this.container.addEventListener('click', e => {
            /** Prevents creating new dot after just letting go of dragged dot */
            if (this.wasDragging == true) {
                this.wasDragging = false;
                return;
            }
        
            if (!this.isInteractiveElement(e)) {
                this.handleContainerClick(e);
            }
            else {
                console.log("Clicked interactable element");
            }
        });

        // this.document.body.addEventListener('click', (e) => this.handleDocBodyClick(e));
        // this.addDotListener('click', this.container, (e, clickedStationView) => this.handleStationEvent(e, clickedStationView));
    }

    handleTrackEvent(eventType, sourceVM) {
        return;
    }

    handleContainerClick(e) {
        console.log(`Clicked container at X: ${e.pageX} Y: ${e.pageY}`);
        const data = new StationData({coordinateX: e.pageX, coordinateY:e.pageY});
        const station = new StationView(data)
        const presenter = new StationPresenter(data, station);
        station.stationPresenter = presenter;
        presenter.subscribe(station);

        presenter.reposition(e.pageX, e.pageY);
        presenter.toggleLabelVisibility(this.showStationLabels);

        this.canvas.appendChild(station.element);
        console.log(station)
    }

    handleDocBodyClick(e) {
        // Deselect current selected station when clicking outside of any dot
        if (!e.target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
            this.selectedStationVM.deselect();
        }
    }

    handleStationClick(e, clickedStationView) {
            const clickedStationVM = clickedStationView.stationViewModel;

            // Single left-click (without ctrl key) to see data and focus dot
            if (e.detail == 1 && !e.ctrlKey) {
                clickedStationVM.select();
                // }
            }
            
            // Double left-click to change station name
            if (e.detail == 2) {
                const newName = prompt("Enter new station name: ");
                clickedStationVM.rename(newName);
            }

            // Connect two dots by left-clicking and focusing one dot, then Ctrl+left-clicking another (unfocused) dot, draw line between them
            // FIXME: Dot should not be focussed when double-clicking
            if (this.selectedStationVM && clickedStationVM != this.selectedStationVM && e.ctrlKey) {
                // #TODO: TrackViewModel creates connection between stations
                    //     console.log("Focussed dot:", selectedStationDot);
                    //     console.log("Ctrl-clicked dot:", clickedStation)
                
                    //     const stationA = selectedStationDot; 
                    //     const stationB = clickedStation;
                    //     const trackData = new TrackData(stationA, stationB);
                
                    //     const trackView = new TrackView(
                    //         stationA.x, stationA.y, 
                    //         stationB.x, stationB.y, 
                    //         trackData.lineData.color, trackData);
                    //     svg.appendChild(trackView.element);
                
                    //     console.log(`Created track from ${stationA.stationData.name} to ${stationB.stationData.name} with line ${trackData.lineData.name}`);
                    //     console.log("Track:", trackData);
            }
    }

    stationsConnect(stationAVM, stationBVM) {
        return;
    }

    createStation() {
        return;
    }

    createTrack() {
        return;
    }
}
    
