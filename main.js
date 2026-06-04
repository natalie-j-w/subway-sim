import { CanvasHandler} from "./out/canvas/CanvasHandler.js";
import { CanvasSerializer } from "./out/util/CanvasSerializer.js"
import {CSS_VARS} from "./constants.js";

// DOM element references
const container = document.getElementById('container');
const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg-layer');

const inStationSize = document.getElementById('in-station-size');
const outStationSize = document.querySelector('#size-slider output');
const inShowLabels = document.getElementById('in-show-station-labels');
const inStationCol = document.getElementById('in-station-col');
const inTrackCol = document.getElementById('in-track-col');
const inCanvasCol = document.getElementById('in-canvas-col');
const btnDownload = document.getElementById('btn-download');
const btnClear = document.getElementById('btn-clear');

const canvasHandler = new CanvasHandler(container, svg, canvas);
const canvasSerializer = new CanvasSerializer(canvasHandler);

// Application state
outStationSize.value = inStationSize.value;
document.documentElement.style.setProperty(CSS_VARS.STATION_SIZE, `${inStationSize.value}px`);
inStationCol.value = (getComputedStyle(document.documentElement).getPropertyValue(CSS_VARS.STATION_BORDER_COLOR));
inTrackCol.value = (getComputedStyle(document.documentElement).getPropertyValue(CSS_VARS.TRACK_COLOR));
inCanvasCol.value = getComputedStyle(canvasHandler.canvas).getPropertyValue("background-color");

inShowLabels.oninput = () => {
    const labelDisplay = inShowLabels.checked ? "block" : "none";
    document.documentElement.style.setProperty("--station-label-display", labelDisplay);    
}

inStationSize.oninput = () => {
    outStationSize.value = inStationSize.value;
    document.documentElement.style.setProperty(CSS_VARS.STATION_SIZE, `${inStationSize.value}px`);
}

inStationCol.oninput = () => {
    document.documentElement.style.setProperty(CSS_VARS.STATION_BORDER_COLOR, String(inStationCol.value));}

inTrackCol.oninput = () => {
    document.documentElement.style.setProperty(CSS_VARS.TRACK_COLOR, String(inTrackCol.value));}

inCanvasCol.oninput = () => {
    canvasHandler.canvas.style.setProperty("background-color", String(inCanvasCol.value));
}

btnDownload.onclick = () => {
    const json = canvasSerializer.canvasToJSON()
    canvasSerializer.JSONtoCanvas(json);

    console.log(json)   
}

btnClear.onclick = () => {
    canvasHandler.clearCanvas();
}