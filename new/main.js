import { AppManager} from "../out/AppManager.js";

// TODO: Split up main.js into multiple handler files

// DOM element references
const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg-layer');
const btnToggleDotLabels = document.getElementById('toggle-labels');

const appManager = new AppManager(container, svg, canvas);

// Application state

btnToggleDotLabels.checked = true;
appManager.showStationLabels = btnToggleDotLabels.checked;

// console.log("Canvas height:", canvas.clientHeight, "Canvas width:", canvas.clientWidth);
// console.log("SVG height:", svg.clientHeight, "SVG width:", svg.clientWidth);


