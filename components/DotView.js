import {CSS_VARS} from '../constants.js'
import { StationData } from './StationData.js';

const dotSize = parseFloat(
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
     * @param {StationData} stationData - The station metadata associated with this dot.
     */
    constructor(stationData) {
        /** @type {StationData} Station metadata (coordinates, name, etc.) */
        this.data = stationData;
        
        /** @type {HTMLDivElement} The DOM element representing the dot */
        this.element = this.createDOMElement();
        
        /** @type {HTMLDivElement} The label element displaying the station name */
        this.label;
        
        /** Creates a circular reference from DOM element back to this DotView instance */
        this.element.dotInstance = this;
    }
    
    /**
     * Updates the position of the dot on the canvas and syncs with data model.
     * @param {number} newX - New X coordinate (center of dot).
     * @param {number} newY - New Y coordinate (center of dot).
     */
    updatePosition(newX, newY) {
        this.data.x = newX;
        this.data.y  = newY;
        this.element.style.left = `${newX - dotSize / 2}px`;
        this.element.style.top  = `${newY - dotSize / 2}px`;
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
        label.textContent = this.data.getName();
        
        dot.style.position = 'absolute';
        dot.style.left = `${this.data.x - dotSize / 2}px`;
        dot.style.top  = `${this.data.y - dotSize / 2}px`;
        
        dot.appendChild(label);
        return dot;
    }
    
    /**
     * Updates the station name in both the data model and the visible label.
     * @param {string} newName - The new name for the station.
     */
    setLabel(newName) {
        this.data.setName(newName);
        this.label.textContent = this.data.getName();
    }
    
    /**
     * Toggles the visibility of the station name label.
     * @param {boolean} value - True to show the label, false to hide it.
     */
    toggleLabelVisibility(value) {
        this.label.style.display = value ? 'block': 'none';
    }
}