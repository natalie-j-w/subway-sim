import {StationView} from './components/StationView.js';
import {LineView } from './components/LineView.js';
import {StationData} from './components/StationData.js';
import { TrackData } from './components/TrackData.js';
import {CSS_VARS} from './constants.js';

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

/** @type {StationView|null} Currently dragged station dot instance */
let draggedStationDot;

/** @type {StationView|null} Currently selected/focused station dot instance */
let selectedStationDot;

/**
 * @callback DotEventCallback
 * @param {MouseEvent} event
 * @param {StationView} dot
 */

/**
 * @param {string} type
 * @param {HTMLElement} target
 * @param {DotEventCallback} callback
 */
function addDotListener(type, target, callback) {
    target.addEventListener(type, /** @param {MouseEvent} e */ (e) => {
        if (e.target.classList.contains(CSS_VARS.DOT_CLASSNAME)) {
            /** @type {StationView} */
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

// TODO: documentation
function svg_draw_line(x1, y1, x2, y2, color) {
    const data = new TrackData();
    const line = new LineView({x1: x1, y1: y1, x2: x2, y2: y2, color: color, data: data});

    svg.appendChild(line.element);
    console.log("Drew line", line)    
}

// ============================================================================
// SETUP
// ============================================================================

svg.setAttribute('viewBox', `0 0 ${canvas.clientWidth} ${canvas.clientHeight}`)
svg_draw_line(20, 40, 100, 200, "red");
svg_draw_line(1, 1, 30, 30, "green");


// ============================================================================
// ============================================================================
// EVENT LISTENERS
// ============================================================================
// ============================================================================

// ============================================================================
// STATION CREATION
// ============================================================================

/**
 * Creates a new station dot when clicking on empty canvas area.
 */
container.addEventListener('click', e => {
    if (!isInteractiveElement(e)) {
        const stationData = new StationData();
        const stationDot = new StationView({x: e.pageX, y: e.pageY, stationData: stationData});
        stationDot.label.style.display = showDotLabels ? 'block': 'none';
        canvas.appendChild(stationDot.element);
        console.log("Placed station dot at coordinates", stationDot.x, stationDot.y);
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
addDotListener('click', container, (e, stationDot) => {
    // Connect two dots by left-clicking and focusing one dot, then Ctrl+left-clicking another (unfocused) dot
    // FIXME: Dot should not be focussed when clicking twice
    if (selectedStationDot && stationDot != selectedStationDot && e.ctrlKey) {
        console.log("Focussed dot:", selectedStationDot);
        console.log("Ctrl-clicked dot:", stationDot)
        
        const line = new LineView({x1: stationDot.x, y1:stationDot.y, x2:selectedStationDot.x, y2: selectedStationDot.y, color:"blue"})
        console.log(line.element)
        svg.appendChild(line.element);

        // TODO: Save connections in data
    }
    
    // Single left-click to see data and focus dot
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
        const curr_name = stationDot.stationData.getName();
        const new_name_prompt = prompt("Station name:");
        const new_name = (new_name_prompt) ? new_name_prompt : curr_name;
        stationDot.stationData.setName(new_name);
        console.log("Previous name:", curr_name ,"New name:", stationDot.stationData.getName())
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
})

/**
 * Updates dot position during drag operation.
 * Constrains dot movement within canvas boundaries.
 */
document.body.addEventListener('mousemove', e => {
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const dotSize = parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--dot-size')
    );
    
    if(draggedStationDot) {
        // FIXME: Fix dot drag limit to canvas (currently using page coordinates)
        let newX = e.pageX;
        let newY = e.pageY;
        
        // Constrain to canvas boundaries
        if(newX > canvasWidth) newX = canvasWidth - dotSize;
        if(newX < 0) newX = dotSize;
        if(newY > canvasHeight) newY = canvasHeight - dotSize;
        if(newY < 0) newY = dotSize;
        
        draggedStationDot.updatePosition(newX, newY);
    }
})

/** Ends dot dragging when mouse button is released.*/
document.body.addEventListener('mouseup', e => {
    if (draggedStationDot) {
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
    console.log("Changed dot label visibility to", btnToggleDotLabels.checked)
})

