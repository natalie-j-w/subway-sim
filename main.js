import {StationView} from './components/StationView.js';
import {TrackView } from './components/TrackView.js';
import {StationData} from './components/StationData.js';
import { TrackData } from './components/TrackData.js';
import {CSS_VARS} from './constants.js';

// TODO: Split up main.js into multiple handler files

// DOM element references
const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg-layer');
const stationDots = document.getElementsByClassName(CSS_VARS.DOT_CLASSNAME);
const btnToggleDotLabels = document.getElementById('toggle-labels');

// Application state
btnToggleDotLabels.checked = true;

/** @type {boolean} Global flag for label visibility */
let showDotLabels = btnToggleDotLabels.checked;

/** @type {StationView|null} Currently dragged station */
let draggedStationDot;

/** @type {StationView|null} Currently selected/focused station */
let selectedStationDot;

/** @type {boolean} Tracks if dragging just occured (prevents mouseup events) */
let wasDragging = false;

/**
 * @param {string} type
 * @param {HTMLElement} target
 * @param {DotInstanceEventCallback} callback
 */
function addDotListener(type, target, callback) {
    target.addEventListener(type, /** @param {MouseEvent} e */ (e) => {
        if (e.target.classList.contains(CSS_VARS.DOT_CLASSNAME)) {
            /** @type {StationView} dotInstance */
            const dotInstance = e.target.dotInstance;
            callback(e, dotInstance);
        }
    });
}

function isInteractiveElement(e) {
    return e.target.classList.contains(CSS_VARS.DOT_CLASSNAME) ||
           e.target.classList.contains(CSS_VARS.LINE_CLASSNAME) 
}

function log_dimensions() {
    console.log("Canvas height:", canvas.clientHeight, "Canvas width:", canvas.clientWidth);
    console.log("SVG height:", svg.clientHeight, "SVG width:", svg.clientWidth);
}

log_dimensions();

// ============================================================================
// SETUP
// ============================================================================

svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`)

// ============================================================================
// ============================================================================
// EVENT LISTENERS
// ============================================================================
// ============================================================================

// ============================================================================
// STATION CREATION
// ============================================================================

/** Creates a new station dot when clicking on empty canvas area. */
container.addEventListener('click', e => {
    /** Prevents creating new dot after just letting go of dragged dot */
    if (wasDragging == true) {
        wasDragging = false;
        return;
    }

    if (!isInteractiveElement(e)) {
        const x = e.pageX;
        const y = e.pageY;
        const data = new StationData();
        const stationDot = new StationView(x, y, data);
        stationDot.label.style.display = showDotLabels ? 'block': 'none';
        canvas.appendChild(stationDot.element);
        console.log("Placed station dot at coordinates", stationDot.x, stationDot.y);
    }
    else {
        console.log("Clicked interactable element");
    }
});



// ============================================================================
// STATION DOT INTERACTION (Click, Double-click, Ctrl+Click)
// ============================================================================

/**
 * Handles single click, double click, and Ctrl+click interactions on dots.
 * - Single click: Select/focus a dot
 * - Double click: Edit station name
 * - Ctrl+Click (with another dot selected): Create connection between dots
*/
addDotListener('click', container, (e, clickedStationDot) => {
    // Connect two dots by left-clicking and focusing one dot, then Ctrl+left-clicking another (unfocused) dot, draw line between them
    // FIXME: Dot should not be focussed when double-clicking
    if (selectedStationDot && clickedStationDot != selectedStationDot && e.ctrlKey) {
        console.log("Focussed dot:", selectedStationDot);
        console.log("Ctrl-clicked dot:", clickedStationDot)

        const stationA = selectedStationDot; 
        const stationB = clickedStationDot;
        const trackData = new TrackData(stationA, stationB);

        // TODO: Create functions for adding connections to StationData and TrackData.lineData
        // (First add connection to TrackData, then add TrackData to Stations)
        stationA.stationData.connections.push(trackData);
        stationB.stationData.connections.push(trackData);
        trackData.lineData.tracks.push(trackData);

        const trackView = new TrackView(
            stationA.x, stationA.y, 
            stationB.x, stationB.y, 
            trackData.lineData.color, trackData);
        svg.appendChild(trackView.element);

        console.log(`Created track from ${stationA.stationData.getName()} to ${stationB.stationData.getName()} with line ${trackData.lineData.name}`);
        console.log("Track:", trackData);
    }
    
    // Single left-click (without ctrl key) to see data and focus dot
    if (e.detail == 1 && !e.ctrlKey) {
        document.querySelector('.selected')?.classList.remove('selected');
        selectedStationDot = e.target.dotInstance;
        if (selectedStationDot) {
            selectedStationDot.element.classList.add('selected');
            console.log("Focussed dot", selectedStationDot.x, selectedStationDot.y, selectedStationDot.stationData.getName());
        }
    }
    
    // Double left-click to change station name
    // TODO: Make more station data editable
    if (e.detail == 2) {
        const curr_name = clickedStationDot.stationData.getName();
        const new_name_prompt = prompt("Station name:");
        const new_name = (new_name_prompt) ? new_name_prompt : curr_name;
        clickedStationDot.stationData.setName(new_name);
        clickedStationDot.updateLabel();
        console.log("Previous name:", curr_name ,"New name:", clickedStationDot.stationData.getName())
    }
})

/** Deselects the currently selected dot when clicking outside of any dot. */
document.body.addEventListener('click', e => {
    if (!e.target.classList.contains(CSS_VARS.DOT_CLASSNAME)) {
        document.querySelector('.selected')?.classList.remove('selected');
        selectedStationDot = null;
    }
})

// ============================================================================
// STATION DOT DRAGGING
// ============================================================================

/** Initiates dot dragging when mouse button is pressed on a dot. */
addDotListener('mousedown', document.body, (e, stationDot) => {
    stationDot.element.classList.add('dragging');
    draggedStationDot = stationDot;
    e.preventDefault();
    console.log("Started dragging dot", draggedStationDot)
})

// TODO: Update line position when dot is moved
/**
 * Updates dot position during drag operation.
 * Constrains dot movement within canvas boundaries.
 */
document.body.addEventListener('mousemove', e => {
    e.preventDefault();
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const dotSize = parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--dot-size')
    );
    
    if(draggedStationDot) {
       wasDragging = true;
        // FIXME: Fix dot drag limit to canvas (currently using page coordinates)
        let newX = e.pageX;
        let newY = e.pageY;
        
        // Constrain to canvas boundaries
        if(newX > canvasWidth) newX = canvasWidth - dotSize;
        if(newX < 0) newX = dotSize;
        if(newY > canvasHeight) newY = canvasHeight - dotSize;
        if(newY < 0) newY = dotSize;
        
        draggedStationDot.updatePosition({newX: newX, newY: newY});
    }
})

/** Ends dot dragging when mouse button is released.*/
document.body.addEventListener('mouseup', () => {
    if (draggedStationDot) {
        console.log("Stopped dragging dot", draggedStationDot)
        draggedStationDot.element.classList.remove('dragging');
        draggedStationDot = null;
    }
})

// ============================================================================
// UI CONTROLS
// ============================================================================

/** Toggles visibility of all station name labels based on checkbox state. */
btnToggleDotLabels.addEventListener('change', e => {
    showDotLabels = btnToggleDotLabels.checked;
    Array.from(stationDots).forEach(el => {
        el.dotInstance.toggleLabelVisibility(showDotLabels);
    })
    console.log("Changed station label visibility to", btnToggleDotLabels.checked)
})

