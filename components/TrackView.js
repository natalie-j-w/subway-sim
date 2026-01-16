import { CSS_VARS } from "../constants.js"
import { TrackData } from "./TrackData.js" 

// TODO: TrackView Documentation

/**
 * Visual representation of a connection between dots on the canvas.
 * Manages the DOM element, positioning, and label visibility for a track line.
 * @property {number} x1 - X Position of the beginning of the line on the canvas.
 * @property {number} y1 - Y Position of the beginning of the line on the canvas.
 * @property {number} x2 - X Position of the end of the line on the canvas.
*  @property {number} y2 - Y Position of the end of the line on the canvas.
 * @property {string} color - Line color.
 * @property {TrackData} trackData - Connection metadata.
 * @property {HTMLDivElement} label - Label of line.
 * @property {HTMLDivElement} element - DOM element of connection line.
 * @property {TrackView} element.trackInstance - Reference to line's instance of TrackView.
 */
export class TrackView {
    x1
    y1
    x2
    y2
    color
    trackData
    #svgNamespace
    element
    label

    /** Creates a new LineView instance
    * @param {number} x1 - X Position of the beginning of the line on the canvas.
    * @param {number} y1 - Y Position of the beginning of the line on the canvas.
    * @param {number} x2 - X Position of the end of the line on the canvas.
    * @param {number} y2 - Y Position of the end of the line on the canvas.
    * @param {string} color - Line color.
    * @param {TrackData} trackData - Connection metadata.
    */
    constructor(x1, y1, x2, y2, color, trackData) {
        if ([x1,y1,x2,y2].some(item => {typeof(item) !== Number})) {
            throw TypeError("Coordinates have to be numbers")
        }

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color || this.trackData.lineData.color;
        this.trackData = trackData || new TrackData();

        this.#svgNamespace = "http://www.w3.org/2000/svg";
        this.element = this.#createDOMElement()
        this.label;
        this.element.trackInstance = this;
    }

    /**
     * Creates and configures the DOM elements for the line and its label.
     * @returns {HTMLDivElement} The line element with label attached.
     * @private
     */
    #createDOMElement() {
        const line = document.createElementNS(this.#svgNamespace, "line");
        const label = document.createElement('div');

        line.setAttribute("class", String(CSS_VARS.LINE_CLASSNAME));
        label.className = CSS_VARS.LINE_LABEL_CLASSNAME;

        line.setAttribute("x1", String(this.x1));
        line.setAttribute("y1", String(this.y1));
        line.setAttribute("x2", String(this.x2));
        line.setAttribute("y2", String(this.y2));
        line.setAttribute("stroke", String(this.color));
        line.setAttribute("stroke-width", "2");
        label.textContent = this.trackData.lineData.name;

        line.appendChild(label);

        return line;
    }

    // TODO: Type checking
    /**
     * @param {Object} options
     * @param {number} [options.x1] - Start X coordinate
     * @param {number} [options.y1] - Start Y coordinate
     * @param {number} [options.x2] - End X coordinate
     * @param {number} [options.y2] - End Y coordinate
     */
    updateLine({newX1=this.x1, newY1=this.y1, newX2=this.x2, newY2=this.y2} = {}) {
        this.x1 = newX1;
        this.y1 = newY1;
        this.x2 = newX2;
        this.y2 = newY2;

        this.element.setAttribute("x1", String(this.x1));
        this.element.setAttribute("y1", String(this.y1));
        this.element.setAttribute("x2", String(this.x2));
        this.element.setAttribute("y2", String(this.y2));
    }
}