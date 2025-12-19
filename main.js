import {Dot} from './components/Dot.js'

let canvas = document.getElementById('canvas');
let draggedDot;

// Helper function to delegate stationDot event listeners to parent elements

function addDotListener(type, target, callback) {
    target.addEventListener(type, e => {
        if (e.target.classList.contains('stationDot')) {
            const dot = e.target.dotInstance;
            callback(e, dot);
        }
    });
}

// Create dot on canvas

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
        console.log("Previous name:", curr_name ,"New name:", dot.name)
    }
})

// Start drag

addDotListener('mousedown', document.body, (e,dot) => {;
    dot.element.classList.add('dragging');
    draggedDot = dot;
})

// During drag

document.body.addEventListener('mousemove', e => {
    let canvasWidth = canvas.clientWidth;
    let canvasHeight = canvas.clientHeight;

    const dotSize = parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--dot-size')
    );

    if(draggedDot) {
        let new_x = e.pageX;
        let new_y = e.pageY;
        
        if(new_x > canvasWidth) new_x = canvasWidth - dotSize;
        if(new_x < 0) new_x = dotSize;
        if(new_y > canvasHeight) new_y = canvasHeight - dotSize;
        if(new_y < 0) new_y = dotSize;
        draggedDot.updatePosition(new_x, new_y);
        console.log(e.pageX, e.pageY, e.clientX, e.clientY)
    }
})

// End drag

document.body.addEventListener('mouseup', e => {
    if (draggedDot) {
        draggedDot.element.classList.remove('dragging');
        draggedDot = null;
    }
})