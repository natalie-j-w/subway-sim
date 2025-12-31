import { CSS_VARS } from "../constants.js"
import { TrackData } from "./TrackData.js" 

/**
 * Represents the visual representation of a connection between dots on the canvas.
 * Manages the DOM element, positioning, and label visibility for a connection line.
 * TODO: Documentation
 */
export class LineView {
    x1
    y1
    x2
    y2
    color

    /** Creates a new LineView instance */
    constructor({x1, y1, x2, y2, color, data} = {}) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.svgNamespace = "http://www.w3.org/2000/svg";

        this.trackData = data;
        this.element = this.createDOMElement()
        this.label;
        this.element.lineInstance = this;
    }

    createDOMElement() {
        const line = document.createElementNS(this.svgNamespace, "line");
        const label = document.createElement('div');

        line.setAttribute("class", String(CSS_VARS.LINE_CLASSNAME));
        label.className = CSS_VARS.LINE_LABEL_CLASSNAME;

        line.setAttribute("x1", String(this.x1));
        line.setAttribute("y1", String(this.y1));
        line.setAttribute("x2", String(this.x2));
        line.setAttribute("y2", String(this.y2));
        line.setAttribute("stroke", String(this.color));
        line.setAttribute("stroke-width", "2");
        label.textContent = "Empty"; // TODO: Rail label is name of line

        line.appendChild(label);

        return line;
    }
}