import { StationData } from "./StationData.js";

// TODO: Implement LineData
// TODO: Documentation

export class LineData {
    
    constructor(name="Unnamed Line", color="blue") {
        this.name = name;
        this.color = color;
        this.tracks = [];
    }

}