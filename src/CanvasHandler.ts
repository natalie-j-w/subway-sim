import {CSS_VARS} from "../constants.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

interface Coordinate {
    x: number,
    y: number
}

interface LineCoordinate {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

const VAR_DOT_SIZE = parseFloat(
    getComputedStyle(document.documentElement)
        .getPropertyValue(CSS_VARS.STATION_SIZE)
);

interface TrackConnection {
    track: SVGLineElement;
    /** 'start' if station is at x1,y1; 'end' if at x2,y2 */
    endpoint: 'start' | 'end';
}

export class CanvasHandler {
    container: HTMLElement
    svg: SVGElement
    canvas: HTMLElement

    selectedTracks = new Set<SVGLineElement>();
    selectedStations = new Set<HTMLElement>();
    
    dragState: {
        station?: HTMLElement;
        startPos?: Coordinate;
        isDragging: boolean;
    } = { isDragging: false };

    /** Map: Station → Array of {track, endpoint} */
    stationConnections = new WeakMap<HTMLElement, TrackConnection[]>();

    constructor(container: HTMLElement, svg: SVGElement, canvas: HTMLElement) {
        this.container = container;
        this.svg = svg;
        this.canvas = canvas;
        
        this.svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`);
        this.setupEventListeners();

        const s1 = this.createStation({x: 30, y: 30});
        const s2 = this.createStation({x: 400, y: 300});
        this.createTrack(s1, s2);

        const resizeObserver = new ResizeObserver(() => {
            this.svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`);
        });

        resizeObserver.observe(container);
    }

    /** Get mouse coordinates relative to container */
    private getRelativeCoords(e: MouseEvent): Coordinate {
        const bounds = this.container.getBoundingClientRect();
        return {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top
        };
    }

    /** Get station center coordinates */
    private getStationCenter(station: HTMLElement): Coordinate {
        return {
            x: parseFloat(station.style.left) + VAR_DOT_SIZE / 2,
            y: parseFloat(station.style.top) + VAR_DOT_SIZE / 2
        };
    }

    createStation(coord: Coordinate, name: string = "Unnamed"): HTMLElement {
        const station = document.createElement("div");
        const label = document.createElement("div");

        station.classList.add(CSS_VARS.STATION_CLASSNAME);
        label.classList.add(CSS_VARS.STATION_LABEL_CLASSNAME);
        label.textContent = name;

        station.style.position = "absolute";
        station.style.left = `${coord.x - VAR_DOT_SIZE / 2}px`;
        station.style.top = `${coord.y - VAR_DOT_SIZE / 2}px`;

        station.appendChild(label);
        this.canvas.appendChild(station);

        this.stationConnections.set(station, []);
        
        return station;
    }

    createTrack(station1: HTMLElement, station2: HTMLElement): SVGLineElement {
        const group = document.createElementNS(SVG_NAMESPACE, "g");
        
        // Selection line (invisible + thicker, for easier clicking)
        const selectionLine = document.createElementNS(SVG_NAMESPACE, "line");
        selectionLine.classList.add(CSS_VARS.SELECTION_LINE_CLASSNAME);
        
        // Actual track line
        const track = document.createElementNS(SVG_NAMESPACE, "line");
        track.classList.add(CSS_VARS.TRACK_CLASSNAME);

        const s1Center = this.getStationCenter(station1);
        const s2Center = this.getStationCenter(station2);
        const coords: LineCoordinate = { x1:s1Center.x, y1: s1Center.y, x2: s2Center.x, y2: s2Center.y };

        [selectionLine, track].forEach(line => {
            line.setAttribute("x1", String(coords.x1));
            line.setAttribute("y1", String(coords.y1));
            line.setAttribute("x2", String(coords.x2));
            line.setAttribute("y2", String(coords.y2));
        });

        group.appendChild(selectionLine);
        group.appendChild(track);
        this.svg.appendChild(group);

        this.stationConnections.get(station1)!.push({ track, endpoint: 'start' });
        this.stationConnections.get(station2)!.push({ track, endpoint: 'end' });

        return track;
    }

    private updateStationPosition(station: HTMLElement, coord: Coordinate): void {
        station.style.left = `${coord.x - VAR_DOT_SIZE / 2}px`;
        station.style.top = `${coord.y - VAR_DOT_SIZE / 2}px`;

        // Update connected tracks
        const connections = this.stationConnections.get(station);
        if (!connections) return;

        connections.forEach(({ track, endpoint }) => {
            const selectionLine = track.previousElementSibling as SVGLineElement;
            
            if (endpoint === 'start') {
                track.setAttribute("x1", String(coord.x));
                track.setAttribute("y1", String(coord.y));
                selectionLine?.setAttribute("x1", String(coord.x));
                selectionLine?.setAttribute("y1", String(coord.y));
            } else {
                track.setAttribute("x2", String(coord.x));
                track.setAttribute("y2", String(coord.y));
                selectionLine?.setAttribute("x2", String(coord.x));
                selectionLine?.setAttribute("y2", String(coord.y));
            }
        });
    }

    setupEventListeners(): void {
        this.container.addEventListener('click', e => {
            if (this.dragState.isDragging) {
                this.dragState.isDragging = false;
                return;
            }

            const target = e.target as Element;

            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                this.handleStationClick(target as HTMLElement, e);
            } else if (target.classList.contains(CSS_VARS.SELECTION_LINE_CLASSNAME)) {
                this.handleTrackClick(target.nextElementSibling as SVGLineElement, e);
            } else if (target.classList.contains(CSS_VARS.TRACK_CLASSNAME)) {
                this.handleTrackClick(target as SVGLineElement, e);
            } else {
                this.handleCanvasClick(e);
            }
        });

        this.container.addEventListener('dblclick', e => {
            const target = e.target as HTMLElement;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME)) {
                const newName = prompt("New name for station:");
                if (newName) {
                    const label = target.firstChild as HTMLElement;
                    label.textContent = newName;
                }
            }
        });

        this.container.addEventListener('mousedown', e => {
            const target = e.target as HTMLElement;
            if (target.classList.contains(CSS_VARS.STATION_CLASSNAME) && !e.ctrlKey) {
                this.clearSelection();
                this.selectStation(target);
                this.dragState = {
                    station: target,
                    startPos: this.getRelativeCoords(e),
                    isDragging: false
                };
            }
        });

        this.container.addEventListener('mousemove', e => {
            if (!this.dragState.station || !this.dragState.startPos) return;

            const currentPos = this.getRelativeCoords(e);
            const dx = currentPos.x - this.dragState.startPos.x;
            const dy = currentPos.y - this.dragState.startPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 3) {
                if (!this.dragState.isDragging) {
                    this.dragState.isDragging = true;
                    this.dragState.station.classList.add("dragging");
                }
                this.updateStationPosition(this.dragState.station, currentPos);
            }
        });

        this.container.addEventListener('mouseup', () => {
            if (this.dragState.station) {
                this.dragState.station.classList.remove("dragging");
                this.dragState = { isDragging: false };
            }
        });
    }

    private handleStationClick(station: HTMLElement, e: MouseEvent): void {
        console.log("Handle station click")
        if (e.ctrlKey && this.selectedStations.size === 1) {
            const [selected] = this.selectedStations;
            this.createTrack(selected, station);
        }
        
        this.clearSelection();
        this.selectStation(station);
    }

    private handleTrackClick(track: SVGLineElement, e: MouseEvent): void {
        e.stopPropagation();
        this.clearSelection();
        this.selectTrack(track);
    }

    private handleCanvasClick(e: MouseEvent): void {
        const coord = this.getRelativeCoords(e);
        const newStation = this.createStation(coord);
        
        if (e.ctrlKey && this.selectedStations.size === 1) {
            const [selected] = this.selectedStations;
            this.createTrack(selected, newStation);
        }
        
        this.clearSelection();
        this.selectStation(newStation);
    }

    selectStation(station: HTMLElement): void {
        station.classList.add("selected");
        this.selectedStations.add(station);
    }

    selectTrack(track: SVGLineElement): void {
        track.classList.add("selected");
        this.selectedTracks.add(track);
    }

    clearSelection(): void {
        this.selectedStations.forEach(s => s.classList.remove("selected"));
        this.selectedStations.clear();
        this.selectedTracks.forEach(t => t.classList.remove("selected"));
        this.selectedTracks.clear();
    }
}