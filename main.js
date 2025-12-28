import {DotView} from './components/Dot.js';
import {StationData} from './components/StationData.js';
import {CSS_VARS, JS_VARS} from './constants.js';
import {} from db_driver

const canvas = document.getElementById('canvas');
const button = document.getElementById('btn-save')
const dots = document.getElementsByClassName(CSS_VARS.DOT_CLASSNAME);
let showDotLabels = true;
let draggedDot;

// Helper function to delegate station-dot event listeners to parent elements

function addDotListener(type, target, callback) {
    target.addEventListener(type, e => {
        if (e.target.classList.contains(CSS_VARS.DOT_CLASSNAME)) {
            const dot = e.target.dotInstance;
            callback(e, dot);
        }
    });
}

// Create dot on canvas

canvas.addEventListener('click', e => {
    if (e.target == canvas) {
        const data = new StationData({x: e.pageX, y: e.pageY});
        const dot = new DotView(data);
        canvas.appendChild(dot.element);
        console.log("Created dot with coordinates", dot.data.x, dot.data.y);
    }
});

// Single click and double click dots

addDotListener('click', canvas, (e, dot) => {
    // Single click to see data
    if (e.detail == 1) {
        console.log("Clicked dot", dot.data.x, dot.data.y, dot.data.getName());
    }

    // Double click to change data
    // TODO: Make more station data editable
    if (e.detail == 2) {
        const curr_name = dot.data.getName();
        const new_name_prompt = prompt("Station name:");
        const new_name = (new_name_prompt) ? new_name_prompt : curr_name;

        dot.data.setName(new_name);
        console.log("Previous name:", curr_name ,"New name:", dot.data.getName())
    }
})

// Start dot drag

addDotListener('mousedown', document.body, (e,dot) => {;
    dot.element.classList.add('dragging');
    draggedDot = dot;
})

// During dot drag

document.body.addEventListener('mousemove', e => {
    let canvasWidth = canvas.clientWidth;
    let canvasHeight = canvas.clientHeight;

    const dotSize = parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--dot-size')
    );

    if(draggedDot) {
        // FIXME: Fix dot drag limit to canvas
        let new_x = e.pageX;
        let new_y = e.pageY;
        
        if(new_x > canvasWidth) new_x = canvasWidth - dotSize;
        if(new_x < 0) new_x = dotSize;
        if(new_y > canvasHeight) new_y = canvasHeight - dotSize;
        if(new_y < 0) new_y = dotSize;
        draggedDot.updatePosition(new_x, new_y);
        //console.log(e.pageX, e.pageY, e.clientX, e.clientY)
    }
})

// End dot drag

document.body.addEventListener('mouseup', e => {
    if (draggedDot) {
        draggedDot.element.classList.remove('dragging');
        draggedDot = null;
    }
})

// Toggle station dot labels

let toggle = document.getElementById('toggle-labels');

toggle.addEventListener('change', e => {
    console.log(toggle.checked);
    showDotLabels = toggle.checked;

    Array.from(dots).forEach(el => {
        console.log(el);
        el.dotInstance.toggleLabel(showDotLabels);
    })
})

// Button

