import {Dot} from './components/Dot.js'

let canvas = document.getElementById('outer');
let draggedDot;

function addDotListener(type, target, callback) {
    target.addEventListener(type, e => {
        if (e.target.classList.contains('stationDot')) {
            const dot = e.target.dotInstance;
            callback(e, dot);
        }
    });
}

canvas.addEventListener('click', e => {
    if (e.target == canvas) {
        const dot = new Dot(e.pageX, e.pageY);
        canvas.appendChild(dot.element);
        console.log("Created dot with coordinates", e.pageX, e.pageY);
    }
});

// Single click and double click dots

addDotListener('click', canvas, (e, dot) => {
    // Single click to see data
    if (e.detail == 1) {
        console.log("Clicked dot", dot.x, dot.y, dot.name);
    }

    // Double click to change data
    if (e.detail == 2) {
        const curr_name = dot.name;
        const new_name = prompt("Station name:");
        dot.name = (new_name) ? new_name : curr_name;
        console.log("New name:", dot.name)
    }
})

// Start drag

addDotListener('mousedown', canvas, (e,dot) => {;
    dot.element.classList.add('dragging');
    draggedDot = dot;
})

// During drag

canvas.addEventListener('mousemove', e => {
    const size = parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--dot-size')
    );

    if(draggedDot) {
        let new_x = e.pageX;
        let new_y = e.pageY;
        
        draggedDot.updatePosition(new_x, new_y);
    }
})

// End drag

addDotListener('mouseup', canvas, e => {
    draggedDot.element.classList.remove('dragging');
    draggedDot = null;
})