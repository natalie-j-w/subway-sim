import {StationPresenter} from "../presenters/StationPresenter.js"
import { StationData } from "../models/StationData.js"
import { StationView } from "../components/StationView.js"
import { CSS_VARS } from "../constants.js"
import { Observer } from "../models/Observer.js"

export class AppManager extends Observer {
    /** @type {HTMLElement} */
    container

    /** @type {HTMLElement} */
    svg

    /** @type {HTMLElement} */
    canvas

    /** @type {boolean} */
    showStationLabels = true;

    /** @type {boolean} Tracks if dragging just occured (prevents mouseup events) */
    wasDragging = false;

    /** @type {StationPresenter} */
    draggedStationPresenter = null;

    /** @type {StationPresenter}*/
    selectedStationPresenter = null;

    /** @type {boolean} Tracks if a dragging operation has been started */
    dragStarted = false;

    /** @type Object{x, y} Mouse position of last mousedown over a station. Used to calculate distance to current mouse pos to initiate dragging. */
    mouseDownPos = {};

    /** @type StationPresenter Saves clicked station presenter before dragging operation is started */
    grabbedStationPresenter;


    /**
     * Creates an instance of AppManager.
     * @param {HTMLElement} container - Container element
     * @param {HTMLElement} svg - SVG element where Tracks are placed.
     * @param {HTMLElement} canvas - Div element where Stations are placed. Positioned below svg.
     */
    constructor(container, svg, canvas) {
        super();
        this.container = container;
        this.svg = svg;
        this.canvas = canvas;
        this.svg.setAttribute('viewBox', `0 0 ${this.canvas.clientWidth} ${this.canvas.clientHeight}`)

        this.setupEventListeners();
    }

    // TODO: Always validate presenter?
    validatePresenter(presenter) {
        if (!typeof(presenter) === StationPresenter) {throw TypeError("Presenter has to be of type 'StationPresenter'", presenter)}
        return presenter;
    }

    /**
     * Sets up event delegation for station dots within a parent container.
     * Attaches a single listener to the target element that filters for dots
     * (identified by CSS_VARS.DOT_CLASSNAME) and retrieves their associated StationView instance.
     * @param {string} type - Event type (e.g., 'click', 'mousedown')
     * @param {HTMLElement} target - Parent element to attach the delegated listener to
     * @param {StationViewInstanceEventCallback} callback - Called with (event, stationView) when a dot is targeted
     */
    addStationListener(type, target, callback) {
        target.addEventListener(type, (e) => {
            if (e.target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
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
        return e.target.classList.contains(CSS_VARS.STATION_CLASSNAME) ||
               e.target.classList.contains(CSS_VARS.TRACK_CLASSNAME) 
    }

    /** Updated by observed StationPresenters */
    update(eventType, payload) {
        switch (eventType) {
            case StationPresenter.NOTIFICATION_TYPES.SELECT: {
                if (this.selectedStationPresenter && this.selectedStationPresenter !== payload.source) {
                    this.selectedStationPresenter.deselect();
                }
                this.selectedStationPresenter = payload.source;
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.DESELECT: {
                this.selectedStationPresenter = null;
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.START_DRAG: {
                this.draggedStationPresenter = payload.source;
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.END_DRAG: {
                this.draggedStationPresenter = null;
                break;
            }
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
        
            if (!this.isInteractiveElement(e)) {
                this.handleContainerClick(e);
            }
            else {
                // console.log("Clicked interactable element");
            }
        });

        this.addStationListener('click', this.container, 
            (e, clickedStationView) => this.handleStationClick(e, clickedStationView.stationPresenter));

        this.addStationListener('mousedown', this.container, 
            (e, clickedStationView) => this.handleStationGrab(e, clickedStationView.stationPresenter));

        document.body.addEventListener('mousemove', e => this.handleStationMove(e));
        document.body.addEventListener('mouseup', e => this.handleStationDrop());
    }

    handleContainerClick(e) {
        /** Create new station when clicking empty space on canvas */
        // console.log(`Clicked container at X: ${e.pageX} Y: ${e.pageY}`);
        if (this.selectedStationPresenter) {
            this.selectedStationPresenter.deselect();
        }
        const data = new StationData({coordinateX: e.pageX, coordinateY:e.pageY});
        const station = new StationView(data)
        const presenter = new StationPresenter(data, station);
        station.stationPresenter = presenter;

        presenter.subscribe(station);
        presenter.subscribe(this);
        presenter.reposition();
        presenter.toggleLabelVisibility(this.showStationLabels);

        this.canvas.appendChild(station.element);
        presenter.select();
    }

    handleStationClick(e, clickedStationPresenter) {
            // console.log("Clicked station", clickedStationPresenter)

            /** Double left-click to change station name */
            if (e.detail == 2) {
                e.stopPropagation();
                this.handleStationDrop();
                clickedStationPresenter.select();
                const newName = prompt("Enter new station name: ");
                if (newName) {
                    clickedStationPresenter.rename(newName);
                }
                this.clickedStationPresenter = null;
                this.handleStationDrop();
                return;
            }

            /** Single left-click (without ctrl key) to select */
            if (e.detail == 1 && !e.ctrlKey) {
                clickedStationPresenter.select();
                // }
            }

            /** #TODO: Connect two dots by left-clicking and focusing one dot, then Ctrl+left-clicking another (unfocused) dot, draw line between them */
            // FIXME: Dot should not be focussed when double-clicking
            if (this.selectedStationPresenter && clickedStationPresenter != this.selectedStationPresenter && e.ctrlKey) {
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

    handleStationGrab(e, clickedStationPresenter) {
        e.preventDefault();
        this.mouseDownPos = {x: e.pageX, y: e.pageY};
        this.grabbedStationPresenter = clickedStationPresenter;
        clickedStationPresenter.select();
        this.dragStarted = false;
    };

    handleStationMove(e) {
        if (this.grabbedStationPresenter && !this.dragStarted) {
            var x1 = e.pageX;
            var y1 = e.pageY;
            var x2 = this.mouseDownPos.x;
            var y2 = this.mouseDownPos.y;
            const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);

            if (dist >= 3) {
                this.wasDragging = true;
                this.dragStarted = true;
                this.draggedStationPresenter = this.grabbedStationPresenter;
                this.draggedStationPresenter.startDrag();
            }
        }

        if (this.draggedStationPresenter && this.dragStarted) {
            this.draggedStationPresenter.reposition(e.pageX, e.pageY);
        }
    }

    handleStationDrop() {
        if (this.draggedStationPresenter && this.dragStarted) {
            this.draggedStationPresenter.endDrag();
            this.dragStarted = false;
            this.mouseDownPos = {};
        }

        this.draggedStationPresenter = null;
        this.grabbedStationPresenter = null;
    }

    handleTrackEvent(eventType, sourcePresenter) {
        return;
    }

    stationsConnect(stationAPresenter, stationBPresenter) {
        return;
    }
}
    
