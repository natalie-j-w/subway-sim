import { CSS_VARS } from "../new/constants.js"

const SVG_NAMESPACE = "http://www.w3.org/2000/svg"

interface Coordinate {
    x?: number,
    y?: number,
    x1?: number,
    y1?: number,
    x2?: number,
    y2?: number
}

const VAR_DOT_SIZE = parseFloat(
    getComputedStyle(document.documentElement)
        .getPropertyValue(CSS_VARS.STATION_SIZE)
);


export class AppManager {
    container: HTMLElement
    svg: HTMLElement
    canvas: HTMLElement
    showStationLabels: boolean = true;

    /** Tracks if dragging just occured (prevents mouseup events) */
    wasDragging: boolean = false;

    selectedTracks: Set<SVGLineElement> = new Set();
    selectedStations: Set<HTMLElement> = new Set();
    draggedStation: HTMLElement |undefined = undefined;
    grabbedStation: HTMLElement | undefined = undefined;

    /** Tracks if a dragging operation has been started */
    dragStarted: boolean = false;

    /** Mouse position of last mousedown over a station. Used to calculate distance to current mouse pos to initiate dragging. */
    lastMouseDownPos: Coordinate = {};

    /** <StationElement, [TrackElements]> */
    stationsTracks = new WeakMap<HTMLElement, Set<SVGLineElement>>;
    
    containerBounds: DOMRect;


    /**
     * Creates an instance of AppManager.
     * @param container - Container element
     * @param svg - SVG element where Tracks are placed.
     * @param canvas - Div element where Stations are placed. Positioned below svg.
     */
    constructor(container: HTMLElement, svg: HTMLElement, canvas: HTMLElement) {
        this.container = container;
        this.svg = svg;
        this.canvas = canvas;
        this.containerBounds = this.container.getBoundingClientRect();
        this.container.style.left = "100px";
        this.container.style.top = "50px";
        this.svg.setAttribute('viewBox', `0 0 ${this.canvas.clientWidth} ${this.canvas.clientHeight}`)

        this.setupEventListeners();

        const s1 = this.createStation({x: 30, y: 30});
        const s2 = this.createStation({x:400, y: 300});
        this.createTrack({}, s1, s2);
    }

    createTrack(coord: Coordinate, station1?: HTMLElement, station2?: HTMLElement) {
        const group = document.createElementNS(SVG_NAMESPACE, "g");

        const newTrack = document.createElementNS(SVG_NAMESPACE, "line") as SVGLineElement;
        newTrack.classList.add(CSS_VARS.TRACK_CLASSNAME);
        
        const selectionLine = document.createElementNS(SVG_NAMESPACE, "line");
        selectionLine.classList.add(CSS_VARS.SELECTION_LINE_CLASSNAME);

        let actualCoords = coord;
        if (station1 && station2) {
            actualCoords = { 
                x1: parseFloat(station1.style.left) + VAR_DOT_SIZE / 2, 
                y1: parseFloat(station1.style.top) + VAR_DOT_SIZE / 2,
                x2: parseFloat(station2.style.left) + VAR_DOT_SIZE / 2, 
                y2: parseFloat(station2.style.top) + VAR_DOT_SIZE / 2};

            [station1, station2].forEach(st => {
                const tracks = this.stationsTracks.get(st);
                tracks.add(newTrack);
            })
        }

        [newTrack, selectionLine].forEach(line => {
            this.moveTrack(line, actualCoords);
        });

        group.appendChild(selectionLine); 
        group.appendChild(newTrack); 
        
        this.svg.appendChild(group);
        console.log("List of stations, tracks:", this.stationsTracks)
        return newTrack; 
    }

    createStation(coord: Coordinate, name: string = "Unnamed"): HTMLElement {
        const newStation: HTMLElement = document.createElement("div");
        const label: HTMLElement = document.createElement("div");

        newStation.classList.add(CSS_VARS.STATION_CLASSNAME);
        label.classList.add(CSS_VARS.STATION_LABEL_CLASSNAME)
        newStation.style.position = "absolute";
        label.textContent = name;
        this.moveStation(newStation, coord);

        newStation.appendChild(label);
        this.canvas.appendChild(newStation);

        this.stationsTracks.set(newStation, new Set());

        console.log("Created station", newStation, label);

        return newStation;
    }

    realCoordsFromMouse(e?: PointerEvent | MouseEvent, coords?: Coordinate): Coordinate {
        let newCoords: Coordinate = {};
        const bounds = this.container.getBoundingClientRect();

        if (coords) {
            newCoords.x -= bounds.left;
            newCoords.y -= bounds.top;
        }
        else if (e) {
            newCoords.x = e.clientX - bounds.left;
            newCoords.y = e.clientY - bounds.top;
        }
        else {
            return;
        }

        

        return newCoords;
    }

    /** Create new station when clicking empty space on canvas. Create with connection to currently selected station by ctrl+clicking. */
    handleContainerClick(e: PointerEvent): void {
        let newStation;
        const clickCoords = this.realCoordsFromMouse(e);
        console.log(`Clicked container at X: ${clickCoords.x} Y: ${clickCoords.y}`);
        newStation = this.createStation(clickCoords);
    

        if (e.ctrlKey && this.selectedStations.size == 1) {
            this.createTrack({}, newStation, this.selectedStations[0]);
        }

        this.unselectStation();
        this.unselectTrack();
        this.selectStation(newStation)
    }

    /**
     * Determines whether an element is interactive (a station dot or track line).
     * @param  e - Pointer event with a target element.
     * @returns True if element is either a station dot or track line, false otherwise.
     */
    isInteractiveElement(e: PointerEvent): boolean {
        if (e.target instanceof HTMLElement || e.target instanceof SVGElement) {
            return e.target.classList.contains(CSS_VARS.STATION_CLASSNAME) ||
                e.target.classList.contains(CSS_VARS.TRACK_CLASSNAME) ||
                e.target.classList.contains(CSS_VARS.SELECTION_LINE) 
        }
        else {
            return false;
        }
    }

    handleInteractiveClick(e: PointerEvent): void {
        const target: HTMLElement = e.target as HTMLElement

        if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
            if (e.detail == 2) {
                e.stopPropagation();
                const newName = prompt("New name for station:");
                if (newName) this.renameStation(target, newName);
                return;
            }

            if (e.detail == 1 && e.ctrlKey && this.selectedStations.size == 1) {
                this.createTrack({}, target, this.selectedStations[0]);
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
            this.selectTrack(target.nextSibling as SVGLineElement)
            console.log("Clicked selection line", target)
        }

        else {
            console.log("Clicked some other interactable target", target);
        }
    }

    trackGetSelectionLine(tr: SVGLineElement) {
        return tr.nextSibling;
    }

    setupEventListeners(): void {
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
            const target: HTMLElement = e.target as HTMLElement;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME) && !e.ctrlKey) {
                this.lastMouseDownPos = this.realCoordsFromMouse(e);
                this.grabStation(target);
            }
        });

        this.container.addEventListener('mousemove', e => {
            let currMousePos = this.realCoordsFromMouse(e);
            const dist = Math.sqrt((currMousePos.x - this.lastMouseDownPos.x)**2 + (currMousePos.y - this.lastMouseDownPos.y)**2);

            if (dist > 3 && this.grabbedStation) {
                this.startDraggingGrabbedStation();
                this.moveStation(this.draggedStation, this.realCoordsFromMouse(e));
            }
        });

        this.container.addEventListener('mouseup', e => {
            this.dropCurrentDraggedStation();
        })
    }

    selectStation(st: HTMLElement) {
        if (!this.selectedStations.has(st)) {
            this.unselectTrack();
            this.unselectStation();
            st.classList.add("selected");
            this.selectedStations.add(st);
            console.log("Selected station", st);
        }
    }

    /**
     * Unselects specified station, or all selected stations if no station is specified.
     * @param st 
     */
    unselectStation(st?: HTMLElement) {
        if (!st) {
            this.selectedStations.forEach(station => {station.classList.remove("selected")});
            this.selectedStations.clear();            
        }
        else if (this.selectedStations.has(st)) {
            st.classList.remove("selected");
            this.selectedStations.delete(st);
        } 
        else {
            return;
        }
    }

    renameStation(st: HTMLElement, newName:string) {
        const label = st.firstChild as HTMLElement;
        const currName = label?.textContent;
        if (newName === currName) {
            return;
        }
        label.textContent = newName;
        console.log(`Renamed station from ${currName} to ${newName}`, st);
    }

    /**
     * Selects specified track.
     * @param tr 
     */
    selectTrack(tr: SVGLineElement) {
        if (!this.selectedTracks.has(tr)) {
            this.unselectStation();
            this.unselectTrack(tr);
            tr.classList.add("selected")
            this.selectedTracks.add(tr);
            console.log("Selected track", tr)            
        }
        console.log(this.selectedTracks)
    }

    /**
     * Unselects specified track, or all selected tracks of no track is specified.
     * @param tr (optional) - Track to be deleted.
     */
    unselectTrack(tr?: SVGLineElement) {
        if (!tr) {
            this.selectedTracks.forEach(track => {track.classList.remove("selected")});
            this.selectedTracks.clear();
        }
        else if (this.selectedTracks.has(tr)) {
            tr.classList.remove("selected");
            this.selectedTracks.delete(tr);
        }
        else {
            return;
        }
    }

moveStation(st: HTMLElement, coords: Coordinate) {
    const connectedTracks = this.stationsTracks.get(st);
    
    // Get current station center position (before moving)
    const oldCenterX = parseFloat(st.style.left) + VAR_DOT_SIZE / 2;
    const oldCenterY = parseFloat(st.style.top) + VAR_DOT_SIZE / 2;
    
    // Calculate new center position
    const newCenterX = coords.x;
    const newCenterY = coords.y;
    
    // Move the station
    st.style.left = `${coords.x - VAR_DOT_SIZE / 2}px`;
    st.style.top = `${coords.y - VAR_DOT_SIZE / 2}px`;
    
    // Update connected tracks
    if (connectedTracks) {
        connectedTracks.forEach(tr => {
            const x1 = parseFloat(tr.getAttribute("x1"));
            const y1 = parseFloat(tr.getAttribute("y1"));
            const x2 = parseFloat(tr.getAttribute("x2"));
            const y2 = parseFloat(tr.getAttribute("y2"));
            
            // Check which end matches the old station position
            const tolerance = 1; // Account for floating point precision
            
            if (Math.abs(x1 - oldCenterX) < tolerance && 
                Math.abs(y1 - oldCenterY) < tolerance) {
                // Update start point (x1, y1)
                this.moveTrack(tr, { x1: newCenterX, y1: newCenterY, x2, y2 });
            }
            else if (Math.abs(x2 - oldCenterX) < tolerance && 
                     Math.abs(y2 - oldCenterY) < tolerance) {
                // Update end point (x2, y2)
                this.moveTrack(tr, { x1, y1, x2: newCenterX, y2: newCenterY });
            }
        });
    }
}

    /**
     * Moves specified track and its selection line to specified coordinates.
     */
    moveTrack(tr: SVGLineElement, coords: Coordinate) {
        const selectionLine = this.trackGetSelectionLine(tr) as SVGLineElement;
        console.log(tr.nextSibling)
        if (selectionLine && selectionLine.classList.contains(CSS_VARS.SELECTION_LINE_CLASSNAME)) {
            selectionLine.setAttribute("x1", `${coords.x1}`);
            selectionLine.setAttribute("y1", `${coords.y1}`);
            selectionLine.setAttribute("x2", `${coords.x2}`);
            selectionLine.setAttribute("y2", `${coords.y2}`);
        }

        tr.setAttribute("x1", `${coords.x1}`);
        tr.setAttribute("y1", `${coords.y1}`);
        tr.setAttribute("x2", `${coords.x2}`);
        tr.setAttribute("y2", `${coords.y2}`);
    }

    /**
     * Grabs station for dragging (if not already grabbed).
     * @param st 
     */
    grabStation(st: HTMLElement) {
        if (st !== this.grabbedStation) {
            this.grabbedStation = st;
            this.dragStarted = false;
            this.selectStation(this.grabbedStation);
            console.log("Grabbed station", this.grabbedStation)            
        }

    }

    /**
     * Initiates drag of currently grabbed station
     */
    startDraggingGrabbedStation() {
        if (!this.dragStarted && this.grabbedStation) {
            this.draggedStation = this.grabbedStation;
            this.draggedStation.classList.add("dragging");
            this.dragStarted = true;
            this.wasDragging = true;
            console.log("Started dragging station", this.draggedStation)
        }
    }

    /**
     * Drops currently dragged station.
     */
    dropCurrentDraggedStation() {
        console.log("Dropped station", this.draggedStation);
        this.draggedStation?.classList.remove("dragging");
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