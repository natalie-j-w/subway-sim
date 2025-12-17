import './components/Dot.js';

let outer = document.getElementById('outer');

outer.addEventListener('click', e => {
    const dot = document.createElement('station-dot');
    dot.setPosition(e.pageX, e.pageY);
    outer.appendChild(dot);
    console.log("H");
    
});
