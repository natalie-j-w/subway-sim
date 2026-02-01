import {CSS_VARS} from '../constants.js'
import { StationData } from '../models/StationData.js';
import { Observer } from '../models/Observer.js';
import {StationPresenter} from "../presenters/StationPresenter.js"

const varDotSize = parseFloat(
    getComputedStyle(document.documentElement)
        .getPropertyValue(CSS_VARS.STATION_SIZE);
);

/**
 * Visual representation of a station on the canvas.
 * Manages the DOM element, positioning, and label visibility for a station dot.
 * Observes and references its StationPresenter.
 * @property {StationData} stationData
 * @property {StationPresenter} stationPresenter
 * @property {HTMLDivElement} label
 * @property {HTMLDivElement} element
 */
export class StationView extends Observer {
    stationData
    label
    element
    stationPresenter

    /**
     * Creates a new StationView instance.
     * @param {StationData} stationData
     */
    constructor(stationData=new StationData()) {
        super();
        this.stationData = stationData;

        /** @type {HTMLDivElement} */
        this.element = this.createDOMElement();

        /** @type {StationView} Creates a reference from DOM element back to its StationView instance */
        this.element.stationViewInstance = this;
    }
    
    /**
     * Creates and configures the DOM elements for the station and its label.
     * @returns {HTMLDivElement} The dot element with label attached.
     * @private
     */
    createDOMElement() {
        const stationElement = document.createElement('div');
        const label = document.createElement('div');
        
        stationElement.className = CSS_VARS.STATION_CLASSNAME;
        label.className = CSS_VARS.STATION_LABEL_CLASSNAME;
        
        this.label = label;
        label.textContent = this.stationData.name;
        
        stationElement.style.position = 'absolute';
        
        stationElement.appendChild(label);
        return stationElement;
    }

    update(eventType, payload) {
        switch(eventType) {
            case StationPresenter.NOTIFICATION_TYPES.RENAME: {
                this.label.textContent = this.stationData.name;
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.REPOSITION: {
                const x = this.stationData.coordinateX - varDotSize / 2;
                const y = this.stationData.coordinateY - varDotSize / 2
                this.element.style.left = `${x}px`;
                this.element.style.top  = `${y}px`;
                this.element.style.transform = `translate(-50%, -50%)`;
                // console.log(`Repositioned station ${this.stationData.name} to X:${x} Y:${y}`)
                break;
            }
            
            case StationPresenter.NOTIFICATION_TYPES.TOGGLE_LABEL_VISIBILITY: {
                this.label.style.display = payload.value ? 'block': 'none';
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.SELECT: {
                this.element.classList.add('selected');
                break;
            }
            
            case StationPresenter.NOTIFICATION_TYPES.DESELECT: {
                this.element.classList.remove('selected');
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.START_DRAG: {
                this.element.classList.add('dragging');
                break;
            }

            case StationPresenter.NOTIFICATION_TYPES.END_DRAG: {
                this.element.classList.remove('dragging');
                break;
            }

            default: {
                console.log(`${this.stationData.name} was updated by event ${eventType} with payload: `, payload);
                break;
            }
        }
    }
}