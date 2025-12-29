import {DotView} from './components/DotView.js';
import {StationData} from './components/StationData.js';
import {CSS_VARS, JS_VARS} from './constants.js';

// DOM element references
const canvas = document.getElementById('canvas');
const button = document.getElementById('btn-save');
const dots = document.getElementsByClassName(CSS_VARS.DOT_CLASSNAME);

// Application state
/** @type {boolean} Global flag for label visibility */
let showDotLabels = true;

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
            const dot = e.target.dotInstance;
            callback(e, dot);
        }
    });
}

// ============================================================================
// DOT CREATION
// ============================================================================

/**
 * Creates a new station dot when clicking on empty canvas area.
 */
canvas.addEventListener('click', e => {
    if (e.target == canvas) {
        const data = new StationData({x: e.pageX, y: e.pageY});
        const dot = new DotView(data);
        canvas.appendChild(dot.element);
        console.log("Created dot with coordinates", dot.data.x, dot.data.y);
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
    // Connect two dots by clicking and focusing one dot, then Ctrl+clicking another (unfocused) dot
    if (selectedDot && dot != selectedDot && e.ctrlKey) {
        console.log(e.target.dotInstance);
        console.log(selectedDot);
        // TODO: Implement connection logic
    }
    
    // Single click to see data and focus dot
    if (e.detail == 1 && !e.ctrlKey) {
        document.querySelector('.selected')?.classList.remove('selected');
        selectedDot = e.target.dotInstance;
        if (selectedDot) {
            selectedDot.element.classList.add('selected');
            console.log("Selected dot", selectedDot.data.x, selectedDot.data.y, selectedDot.data.getName());
        }
    }
    
    // Double click to change station name
    // TODO: Make more station data editable
    if (e.detail == 2) {
        const curr_name = dot.data.getName();
        const new_name_prompt = prompt("Station name:");
        const new_name = (new_name_prompt) ? new_name_prompt : curr_name;
        dot.data.setName(new_name);
        console.log("Previous name:", curr_name ,"New name:", dot.data.getName())
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
    let canvasWidth = canvas.clientWidth;
    let canvasHeight = canvas.clientHeight;
    const dotSize = parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--dot-size')
    );
    
    if(draggedDot) {
        // FIXME: Fix dot drag limit to canvas (currently using page coordinates)
        let new_x = e.pageX;
        let new_y = e.pageY;
        
        // Constrain to canvas boundaries
        if(new_x > canvasWidth) new_x = canvasWidth - dotSize;
        if(new_x < 0) new_x = dotSize;
        if(new_y > canvasHeight) new_y = canvasHeight - dotSize;
        if(new_y < 0) new_y = dotSize;
        
        draggedDot.updatePosition(new_x, new_y);
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
let toggle = document.getElementById('toggle-labels');
toggle.addEventListener('change', e => {
    console.log(toggle.checked);
    showDotLabels = toggle.checked;
    Array.from(dots).forEach(el => {
        console.log(el);
        el.dotInstance.toggleLabelVisibility(showDotLabels);
    })
})

// ============================================================================
// CONNECTIONS
// ============================================================================

// TODO: Create connection between stations
