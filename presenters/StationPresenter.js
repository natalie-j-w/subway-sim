import { StationView } from "../components/StationView.js";
import { Observable } from "../models/Observable.js";
import { StationData } from "../models/StationData.js";

/**
 * #TODO: Proper documentation
 * ViewModel that couples StationView to StationData.
 * Only sends payload when data outside of StationData is needed.
 */
export class StationPresenter extends Observable {
    static NOTIFICATION_TYPES = Object.freeze({
        SELECT: "station:select",
        DESELECT: "station:deselect",
        TOGGLE_LABEL_VISIBILITY: "station:toggleLabelVisibility",
        RENAME: "station:rename",
        REPOSITION: "station:reposition",
        START_DRAG: "station:startDrag",
        END_DRAG: "station:endDrag"
    });

    stationData
    stationView
    isSelected
    isDragging
    labelIsVisible

    /**
     * Creates a new instance of StationPresenter.
     * @param {StationData} stationData 
     * @param {StationView} stationView 
     */
    constructor(stationData, stationView) {
        super();
        this.stationData = stationData;
        this.stationView = stationView;
        this.isSelected = false;
        this.isDragging = false;
        this.labelIsVisible = true;
    }

    /**
     * Select station
     * @returns {void}
     */
    select() {
        if (this.isSelected) {return}
        this.isSelected = true;
        this.notify(
            StationPresenter.NOTIFICATION_TYPES.SELECT, 
            {source: this});
        console.log(`Selected station '${this.stationData.name}' `, this);
    }

    /**
     * Deselect station
     * @returns {void}
     */
    deselect() {
        if (!this.isSelected) {return}
        this.isSelected = false;
        this.notify(
            StationPresenter.NOTIFICATION_TYPES.DESELECT, 
            {source: this});
        console.log(`Deselected station '${this.stationData.name}' `, this);
    }

    toggleLabelVisibility(val) {
        if (this.labelIsVisible === val) {return};
        this.labelIsVisible = val;
        this.notify(
            StationPresenter.NOTIFICATION_TYPES.TOGGLE_LABEL_VISIBILITY, 
            {value: val, source: this});
        console.log(`Toggled station label visibility of '${this.stationData.name}' to ${val}`, this);
    }

    rename(newName) {
        if (this.stationData.name === newName) {return}
        const oldName = this.stationData.name;
        this.stationData.name = newName;
        this.notify(
            StationPresenter.NOTIFICATION_TYPES.RENAME, 
            {source: this})
        console.log(`Changed station name from ${oldName} to ${this.stationData.name}`, this)
    }

    /** Dragging */

    startDrag() {
        this.isDragging = true;
        this.notify(
            StationPresenter.NOTIFICATION_TYPES.START_DRAG, 
            {source: this});
        console.log(`Started dragging station ${this.stationData.name}: `, this);
    }

    reposition(coordX = this.stationData.coordinateX, coordY = this.stationData.coordinateY) {
        // console.log(`Notif: Reposition station to X:${this.stationData.coordinateX} Y:${this.stationData.coordinateY}`, this)
        this.stationData.coordinateX = coordX;
        this.stationData.coordinateY = coordY;
        this.notify(
            StationPresenter.NOTIFICATION_TYPES.REPOSITION, 
            {source: this});
    }

    endDrag() {
        this.isDragging = false;
        this.notify(
            StationPresenter.NOTIFICATION_TYPES.END_DRAG, 
            {source: this})
        console.log(`Stopped dragging station ${this.stationData.name}: `, this);
    }
}