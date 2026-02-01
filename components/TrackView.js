import { CSS_VARS } from "../constants.js"
import { TrackData } from "../models/TrackData.js" 
import { TrackPresenter } from "../presenters/TrackPresenter.js"
import { Observer } from "../models/Observer.js"

// TODO: TrackView Documentation

/**
 * Visual representation of a connection between Stations on the canvas.
 * Manages the DOM element, positioning, and label visibility for a Track line.
 * Observes and references its TrackPresenter.
 * @property {string} color - Line color.
 * @property {TrackData} trackData - Referenced connection metadata.
 * @property {TrackPresenter} trackPresenter
 * @property {TrackPresenter} Referenced presenter.
 * @property {HTMLDivElement} label - Label of track.
 * @property {HTMLDivElement} element - DOM element of connection line.
 * @property {TrackView} element.trackInstance - Reference to line element's instance of TrackView.
 */
export class TrackView extends Observer {
    color
    element
    label
    trackData
    trackPresenter

    static SVG_NAMESPACE = "http://www.w3.org/2000/svg";

    /** Creates a new TrackView instance.
    * @param {TrackData} trackData - Connection metadata.
    * @param {string} color - Track color. Default: Default color of assigned line.
    */
    constructor(trackData, color = this.trackData.lineData.color) {
        this.trackData = trackData;
        this.color = color;
        this.element = this.#createDOMElement()
        this.element.trackInstance = this;
    }

    /**
     * Creates and configures the DOM elements for the line and its label.
     * @returns {HTMLDivElement} The line element with label attached.
     * @private
     */
    #createDOMElement() {
        const line = document.createElementNS(this.SVG_NAMESPACE, "line");
        const label = document.createElement('div');

        line.setAttribute("class", String(CSS_VARS.TRACK_CLASSNAME));
        label.className = CSS_VARS.TRACK_LABEL_CLASSNAME;

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

    update(eventType, payload) {
        switch (eventType) {
            case (TrackPresenter.NOTIFICATION_TYPES.SELECT): {
                break;
            }
            case (TrackPresenter.NOTIFICATION_TYPES.DESELECT): {
                break;
            }
            case (TrackPresenter.NOTIFICATION_TYPES.REPOSITION): {
                break;
            }
            case (TrackPresenter.NOTIFICATION_TYPES.TOGGLE_LABEL_VISIBILITY): {
                break;
            }
            default: {
                break;
            }
        }
    }
}