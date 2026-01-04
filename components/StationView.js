import {CSS_VARS} from '../constants.js'
import {StationData } from './StationData.js';

const varDotSize = parseFloat(
    getComputedStyle(document.documentElement)
        .getPropertyValue('--dot-size')
);

/**
 * Represents the visual representation of a station on the canvas.
 * Manages the DOM element, positioning, and label visibility for a station dot.
 */
export class StationView {
    /**
     * Creates a new StationView instance.
     * @param {number} x
     * @param {number} y
     * @param {StationData} stationData
     */
    constructor(x, y, stationData) {
        this.x = x;
        this.y = y;
        this.stationData = stationData || new StationData();

        /** @type {HTMLDivElement} */
        this.label;

        /** @type {HTMLDivElement} */
        this.element = this.createDOMElement();

        /** @type {StationView} Creates a reference from DOM element back to its StationView instance */
        this.element.dotInstance = this;
    }
    
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
        stationDot.style.left = `${this.x - varDotSize / 2}px`;
        stationDot.style.top  = `${this.y - varDotSize / 2}px`;
        
        stationDot.appendChild(label);
        return stationDot;
    }

    /**
     * Updates the position of the station on the canvas
     * @param {number} newX - New X coordinate (center of station dot)
     * @param {number} newY - New Y coordinate (center of station dot)
     */
    updatePosition(newX, newY) {
        this.x = newX;
        this.y  = newY;
        this.element.style.left = `${this.x - varDotSize / 2}px`;
        this.element.style.top  = `${this.y - varDotSize / 2}px`;
    }
    
    /**
     * Updates the station label.
     * @param {string} newName - The new name for the station.
     */
    setLabel(newName) {
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