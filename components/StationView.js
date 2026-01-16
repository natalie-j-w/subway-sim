import {CSS_VARS} from '../constants.js'
import {StationData } from './StationData.js';

const varDotSize = parseFloat(
    getComputedStyle(document.documentElement)
        .getPropertyValue('--dot-size')
);

/**
 * Visual representation of a station on the canvas.
 * Manages the DOM element, positioning, and label visibility for a station dot.
 */
export class StationView {
    #x
    #y

    /**
     * Creates a new StationView instance.
     * @param {number} x
     * @param {number} y
     * @param {StationData} stationData
     */
    constructor(x=0, y=0, stationData=new StationData()) {
        this.x = x;
        this.y = y;
        this.stationData = stationData;

        /** @type {HTMLDivElement} */
        this.label;

        /** @type {HTMLDivElement} */
        this.element = this.createDOMElement();

        /** @type {StationView} Creates a reference from DOM element back to its StationView instance */
        this.element.dotInstance = this;
    }

    get x() {return this.#x}
    set x(value) {
        if (typeof(value) !== 'number') {throw TypeError(`x value ${value} is not a number`)}
        if (!Number.isFinite(value)) {throw TypeError(`x value ${value} is not a finite number`)}
        else {this.#x = value}}

    get y() {return this.#y}
    set y(value) {
        if (typeof(value) !== 'number') {throw TypeError(`y value ${value} is not a number`)}
        if (!Number.isFinite(value)) {throw TypeError(`y value ${value} is not a finite number`)}
        else {this.#y = value}}
    
    /**
     * Creates and configures the DOM elements for the station and its label.
     * @returns {HTMLDivElement} The dot element with label attached.
     * @private
     */
    createDOMElement() {
        const stationDot = document.createElement('div');
        const label = document.createElement('div');
        
        stationDot.className = CSS_VARS.DOT_CLASSNAME;
        label.className = CSS_VARS.DOT_LABEL_CLASSNAME;
        
        this.label = label;
        label.textContent = this.stationData.getName();
        
        stationDot.style.position = 'absolute';
        stationDot.style.left = `${this.#x - varDotSize / 2}px`;
        stationDot.style.top  = `${this.#y - varDotSize / 2}px`;
        
        stationDot.appendChild(label);
        return stationDot;
    }

    /**
     * Updates the position of the station on the canvas
     * @param {number} newX - New X coordinate (center of station dot)
     * @param {number} newY - New Y coordinate (center of station dot)
     */
    updatePosition({newX = this.x, newY = this.y} = {}) {
        this.x = newX;
        this.y  = newY;

        this.element.style.left = `${this.x - varDotSize / 2}px`;
        this.element.style.top  = `${this.y - varDotSize / 2}px`;
    }
    
    /** Updates the station label text to current station name. */
    updateLabel() {
        this.label.textContent = this.stationData.getName();
        console.log("Changed label")
    }
    
    /**
     * Toggles the visibility of the station name label.
     * @param {boolean} value - True to show the label, false to hide it.
     */
    toggleLabelVisibility(value) {
        this.label.style.display = value ? 'block': 'none';
    }
}