import { Observable } from "../models/Observable";

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

    constructor(trackData, trackView) {
        this.trackData = trackData;
        this.trackView = trackView;
        this.isSelected = false;
        this.isDragging = false;
        this.labelIsVisible = true;
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

    reposition(coordX = this.stationData.coordinateX, coordY = this.stationData.coordinateY) {
        console.log(`Notif: Reposition station to X:${this.stationData.coordinateX} Y:${this.stationData.coordinateY}`, this)
        this.stationData.coordinateX = coordX;
        this.stationData.coordinateY = coordY;
        this.notify(StationPresenter.
            NOTIFICATION_TYPES.REPOSITION, 
            {source: this});
    }
}