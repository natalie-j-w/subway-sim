// TODO: Implement TrackData

export class TrackData {
    id
    fromStation
    toStation
    length
    line 

    constructor({id, fromStation, toStation, length, line}) {
        this.id = id;
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.length = length;
        this.line = line;
    }
}