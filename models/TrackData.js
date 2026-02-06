// TODO: Implement TrackData
// TODO: Documentation

import { StationPresenter } from "../presenters/StationPresenter.js";
import { LineData } from "./LineData.js";

export class TrackData {
    id
    stationAPresenter
    stationBPresenter
    length
    lineData
    x1
    y1
    x2
    y2

    /**
     * Creates a new TrackData instance.
     * @param {StationPresenter} stationAPresenter 
     * @param {StationPresenter} stationBPresenter 
     * @param {LineData} lineData 
     * @param {integer} id 
     * @param {number} length 
     */
    constructor(stationAPresenter, stationBPresenter, lineData= new LineData(), id=null, length=null) {
        this.id = id
        this.lineData = lineData;
        this.stationAPresenter = stationAPresenter;
        this.stationBPresenter = stationBPresenter;
        this.length = length;
    }
}