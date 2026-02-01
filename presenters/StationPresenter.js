import { StationView } from "../components/StationView.js";
import { Observable } from "../models/Observable.js";
import { StationData } from "../models/StationData.js";

/**
 * Presenter that mediates between StationData (model) and StationView (view).
 * 
 * Responsibilities:
 * - Manages station state (selection, dragging, label visibility)
 * - Updates StationData in response to user actions
 * - Notifies observers (StationView, AppManager) of state changes
 * 
 * Architecture:
 * - Extends Observable to notify observers when station state changes
 * - Owns references to both StationData and StationView
 * - Only this Presenter should modify StationData; Views should only read
 * 
 * Notification Flow:
 * 1. User action triggers Presenter method (e.g., select(), rename())
 * 2. Presenter updates internal state and/or StationData
 * 3. Presenter notifies all observers via notify(eventType, payload)
 * 4. StationView updates DOM, AppManager updates app state
 * 
 * @example
 * const data = new StationData({name: "Central Station"});
 * const view = new StationView(data);
 * const presenter = new StationPresenter(data, view);
 * 
 * // Subscribe observers
 * presenter.subscribe(view);
 * presenter.subscribe(appManager);
 * 
 * // User actions
 * presenter.select();           // Notifies observers with SELECT event
 * presenter.rename("Downtown");  // Updates data, notifies with RENAME event
 * presenter.reposition(100, 50); // Updates coordinates, notifies with REPOSITION
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