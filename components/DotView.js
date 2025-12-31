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
export class DotView {
    /**
     * Creates a new DotView instance.
     * @param {number} x -  X coordinate of the dot on the canvas
     * @param {number} y -  Y coordinate of the dot on the canvas
     * @param {StationData} stationData - The station metadata associated with this dot.
     */
    constructor( {x, y, stationData} = {} ) {
        /** @type {number} X coordinate of the dot on the canvas */
        this.x = x;

        /** @type {number} Y coordinate of the dot on the canvas */
        this.y = y;      

        /** @type {StationData} Station metadata (name, etc.) */
        this.stationData = stationData;
        
        /** @type {HTMLDivElement} The DOM element representing the dot */
        this.element = this.createDOMElement();

        /** @type {HTMLDivElement} The label element displaying the station name */
        this.label;
        
        /** Creates a circular reference from DOM element back to this DotView instance */
        this.element.dotInstance = this;
    }
    
    /**
     * Creates and configures the DOM elements for the dot and its label.
     * @returns {HTMLDivElement} The dot element with label attached.
     * @private
     */
    createDOMElement() {
        const dot = document.createElement('div');
        const label = document.createElement('div');
        
        dot.className = CSS_VARS.DOT_CLASSNAME;
        label.className = CSS_VARS.DOT_LABEL_CLASSNAME;
        
        this.label = label;
        label.textContent = this.stationData.getName();
        
        dot.style.position = 'absolute';
        dot.style.left = `${this.x - varDotSize / 2}px`;
        dot.style.top  = `${this.y - varDotSize / 2}px`;
        
        dot.appendChild(label);
        return dot;
    }

    /**
     * Updates the position of the dot on the canvas
     * @param {number} newX - New X coordinate (center of dot)
     * @param {number} newY - New Y coordinate (center of dot)
     */
    updatePosition(newX, newY) {
        this.x = newX;
        this.y  = newY;
        this.element.style.left = `${this.x - varDotSize / 2}px`;
        this.element.style.top  = `${this.y - varDotSize / 2}px`;
    }
    
    /**
     * Updates the station name in both the data model and the visible label.
     * @param {string} newName - The new name for the station.
     */
    setLabel(newName) {
        this.stationData.setName(newName);
        this.label.textContent = this.stationData.getName();
    }
    
    /**
     * Toggles the visibility of the station name label.
     * @param {boolean} value - True to show the label, false to hide it.
     */
    toggleLabelVisibility(value) {
        this.label.style.display = value ? 'block': 'none';
    }
}