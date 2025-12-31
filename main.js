import {DotView} from './components/DotView.js';
import { LineView } from './components/LineView.js';
import {StationData} from './components/StationData.js';
import { TrackData } from './components/TrackData.js';
import {CSS_VARS} from './constants.js';

// DOM element references
const canvas = document.getElementById('canvas');
let btnToggleDotLabels = document.getElementById('toggle-labels');
const svg = document.getElementById('svg-layer');
const dots = document.getElementsByClassName(CSS_VARS.DOT_CLASSNAME);

// Application state
btnToggleDotLabels.checked = true;

/** @type {boolean} Global flag for label visibility */
let showDotLabels = btnToggleDotLabels.checked;

/** @type {DotView|null} Currently dragged dot instance */
let draggedDot;

/** @type {DotView|null} Currently selected/focused dot instance */
let selectedDot;

/**
 * Helper function to delegate station dot event listeners to parent elements.
 * Uses event delegation pattern to handle events on dynamically created dots.
 * @param {string} type - Event type (e.g., 'click', 'mousedown').
 * @param {HTMLElement} target - Parent element to attach the listener to.
 * @param {Function} callback - Callback function receiving (event, dotInstance).
 */
function addDotListener(type, target, callback) {
    target.addEventListener(type, e => {
        if (e.target.classList.contains(CSS_VARS.DOT_CLASSNAME)) {
            /** @type {DotView} */
            const dot = e.target.dotInstance;
            callback(e, dot);
        }
    });
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

svg.addEventListener('mouseenter', e => {
    console.log("Entered SVG");
});

svg.addEventListener('mouseleave', e => {
    console.log("Left SVG");
});


svg_draw_line(20, 40, 100, 200, "red");
svg_draw_line(1, 300, 510, 390, "green");

// ============================================================================
// DOT CREATION
// ============================================================================

/**
 * Creates a new station dot when clicking on empty canvas area.
 */
canvas.addEventListener('click', e => {
    if (e.target == canvas) {
        const stationData = new StationData();
        const dot = new DotView({x: e.pageX, y: e.pageY, stationData: stationData});
        dot.label.style.display = showDotLabels ? 'block': 'none';
        canvas.appendChild(dot.element);
        console.log("Created dot with coordinates", dot.x, dot.y);
    }
});

// ============================================================================
// DOT INTERACTION (Click, Double-click, Ctrl+Click)
// ============================================================================

/**
 * Handles single click, double click, and Ctrl+click interactions on dots.
 * - Single click: Select/focus a dot
 * - Double click: Edit station name
 * - Ctrl+Click (with another dot selected): Create connection between dots
 */
addDotListener('click', canvas, (e, dot) => {
    // Connect two dots by left-clicking and focusing one dot, then Ctrl+left-clicking another (unfocused) dot
    if (selectedDot && dot != selectedDot && e.ctrlKey) {
        console.log("Focussed dot:", selectedDot);
        console.log("Ctrl-clicked dot:", dot)
        
        // TODO: Line between connected dots
        // TODO: Save connection in StationData
    }
    
    // Single left-click to see data and focus dot
    if (e.detail == 1 && !e.ctrlKey) {
        document.querySelector('.selected')?.classList.remove('selected');
        selectedDot = e.target.dotInstance;
        if (selectedDot) {
            selectedDot.element.classList.add('selected');
            console.log("Focussed dot", selectedDot.x, selectedDot.y, selectedDot.stationData.getName());
        }
    }
    
    // Double left-click to change station name
    // TODO: Make more station data editable
    if (e.detail == 2) {
        const curr_name = dot.stationData.getName();
        const new_name_prompt = prompt("Station name:");
        const new_name = (new_name_prompt) ? new_name_prompt : curr_name;
        dot.stationData.setName(new_name);
        console.log("Previous name:", curr_name ,"New name:", dot.stationData.getName())
    }
})

/**
 * Deselects the currently selected dot when clicking outside of any dot.
 */
document.body.addEventListener('click', e => {
    if (!e.target.classList.contains(CSS_VARS.DOT_CLASSNAME)) {
        document.querySelector('.selected')?.classList.remove('selected');
        selectedDot = null;
    }
})

// ============================================================================
// DOT DRAGGING
// ============================================================================

/**
 * Initiates dot dragging when mouse button is pressed on a dot.
 */
addDotListener('mousedown', document.body, (e, dot) => {
    dot.element.classList.add('dragging');
    draggedDot = dot;
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
    
    if(draggedDot) {
        // FIXME: Fix dot drag limit to canvas (currently using page coordinates)
        let newX = e.pageX;
        let newY = e.pageY;
        
        // Constrain to canvas boundaries
        if(newX > canvasWidth) newX = canvasWidth - dotSize;
        if(newX < 0) newX = dotSize;
        if(newY > canvasHeight) newY = canvasHeight - dotSize;
        if(newY < 0) newY = dotSize;
        
        draggedDot.updatePosition(newX, newY);
    }
})

/**
 * Ends dot dragging when mouse button is released.
 */
document.body.addEventListener('mouseup', e => {
    if (draggedDot) {
        draggedDot.element.classList.remove('dragging');
        draggedDot = null;
    }
})

// ============================================================================
// UI CONTROLS
// ============================================================================

/**
 * Toggles visibility of all station name labels based on checkbox state.
 */
btnToggleDotLabels.addEventListener('change', e => {
    showDotLabels = btnToggleDotLabels.checked;
    Array.from(dots).forEach(el => {
        el.dotInstance.toggleLabelVisibility(showDotLabels);
    })
    console.log("Changed dot label visibility to", btnToggleDotLabels.checked)
})

