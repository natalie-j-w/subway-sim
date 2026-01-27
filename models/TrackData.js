// TODO: Implement TrackData
// TODO: Documentation

import { LineData } from "./LineData.js";

export class TrackData {
    id
    stationA
    stationB
    length
    lineData

    constructor(stationA, stationB, lineData=null, id=null, length=null) {
        this.id = id
        this.stationA = stationA || null;
        this.stationB = stationB || null;
        this.length = length || null;
        this.lineData = lineData || new LineData();
    }
}