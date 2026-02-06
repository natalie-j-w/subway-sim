import { TrackView } from "../components/TrackView.js";
import { Observable } from "../models/Observable.js";
import { Observer } from "../models/Observer.js";
import { TrackData } from "../models/TrackData.js";


/**
 * Presenter that mediates between TrackData (model) and TrackView (view).
 * 
 * Responsibilities:
 * - Manages track state (selection, label visibility)
 * - Updates TrackData in response to user actions
 * - Notifies observers (TrackView, AppManager) of state changes
 * - Handles track repositioning when connected stations move
 * 
 * Architecture:
 * - Extends Observable to notify observers when track state changes
 * - Owns references to both TrackData and TrackView
 * - Only this Presenter should modify TrackData; Views should only read
 * 
 * Notification Flow:
 * 1. User action or station movement triggers Presenter method
 * 2. Presenter updates internal state and/or TrackData
 * 3. Presenter notifies all observers via notify(eventType, payload)
 * 4. TrackView updates SVG line, AppManager updates app state
 * 
 * Track Positioning:
 * - Tracks connect two stations and must update when either station moves
 * - Connected stations should notify their tracks to reposition
 * - Track coordinates are derived from station positions
 * 
 * @example
 * const trackData = new TrackData(stationA, stationB, lineData);
 * const trackView = new TrackView(trackData, color);
 * const presenter = new TrackPresenter(trackData, trackView);
 * 
 * // Subscribe observers
 * presenter.subscribe(trackView);
 * presenter.subscribe(appManager);
 * 
 * // User actions
 * presenter.select();                    // Notifies observers with SELECT event
 * presenter.toggleLabelVisibility(true); // Shows/hides line name label
 * presenter.reposition(x1, y1, x2, y2);  // Updates track endpoints
 */
export class TrackPresenter extends Observable {
    static NOTIFICATION_TYPES = Object.freeze({
        SELECT: "track:select",
        DESELECT: "track:deselect",
        TOGGLE_LABEL_VISIBILITY: "track:toggleLabelVisibility",
        REPOSITION: "track:reposition",
        START_DRAG: "track:startDrag",
        END_DRAG: "track:endDrag"
    });

    trackData
    trackView
    isSelected
    isDragging
    labelIsVisible

    /**
     * Creates a new instance of TrackPresenter.
     * @param {TrackData} trackData 
     * @param {TrackView} trackView 
     */
    constructor(trackData, trackView) {
        super();
        this.trackData = trackData;
        this.trackView = trackView;
        this.isSelected = false;
        this.isDragging = false;
        this.labelIsVisible = true;

        this.trackData.stationAPresenter.subscribe(this);
        this.trackData.stationBPresenter.subscribe(this);
    }


    select() {
        if (this.isSelected) {return}
        this.isSelected = true;
        this.notify(
            TrackPresenter.NOTIFICATION_TYPES.SELECT, 
            {source: this});
        console.log(`Selected track' `, this);
    }

    deselect() {
        if (!this.isSelected) {return}
        this.isSelected = false;
        this.notify(
            StationPresenter.NOTIFICATION_TYPES.DESELECT, 
            {source: this});
        console.log(`Deselected track' `, this);
    }

    toggleLabelVisibility(val) {
        if (this.labelIsVisible === val) {return};
        this.labelIsVisible = val;
        this.notify(
            StationPresenter.NOTIFICATION_TYPES.TOGGLE_LABEL_VISIBILITY, 
            {value: val, source: this});
        console.log(`Toggled station label visibility of '${this.stationData.name}' to ${val}`, this);
    }

    reposition(coordinates = {} = {x1:this.trackData.x1, y1: this.trackData.y1, x2: this.trackData.x2, y2: this.trackData.y2}) {
        console.log("Repositioned line to", coordinates);
        this.trackData.x1 = coordinates.x1;
        this.trackData.y1 = coordinates.y1;
        this.trackData.x2 = coordinates.x2;
        this.trackData.y2 = coordinates.y2;

        this.notify(
            TrackPresenter.NOTIFICATION_TYPES.REPOSITION, 
            {source: this, x1: coordinates.x1, y1: coordinates.y1, x2: coordinates.x2, y2: coordinates.y2});
    }
}