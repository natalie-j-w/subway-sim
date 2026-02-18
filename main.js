import { CanvasHandler} from "/out/CanvasHandler.js";

// DOM element references
const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg-layer');

const inputStationSize = document.getElementById('in-station-size');
const outputStationSize = document.querySelector('#size-slider output');
const inputShowLabels = document.getElementById('in-show-station-labels');

const canvasHandler = new CanvasHandler(container, svg, canvas);

// Application state

canvasHandler.showStationLabels = true;
console.log(inputStationSize)
inputStationSize.value = "20";
outputStationSize.value = inputStationSize.value;

inputStationSize.oninput = () => {
    outputStationSize.value = inputStationSize.value;
    document.documentElement.style.setProperty("--station-size", `${inputStationSize.value}px`);
    console.log("Changed size to", document.documentElement.style.getPropertyValue("--station-size"))
}
