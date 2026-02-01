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

    /**
     * Creates a new TrackData instance.
     * @param {StationPresenter} stationA 
     * @param {StationPresenter} stationB 
     * @param {LineData} lineData 
     * @param {integer} id 
     * @param {number} length 
     */
    constructor(stationA, stationB, lineData=null, id=null, length=null) {
        this.id = id
        this.stationAPresenter = stationA || null;
        this.stationBPresenter = stationB || null;
        this.length = length || null;
        this.lineData = lineData || new LineData();
    }
}