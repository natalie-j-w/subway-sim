import { CanvasHandler} from "/out/CanvasHandler.js";

// DOM element references
const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg-layer');
const btnToggleDotLabels = document.getElementById('toggle-labels');

const canvasHandler = new CanvasHandler(container, svg, canvas);

// Application state

canvasHandler.showStationLabels = true;



