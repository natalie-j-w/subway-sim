export class CanvasSerializer {
    canvasHandler;
    constructor(canvasHandler) {
        this.canvasHandler = canvasHandler;
    }
    /**
     * Converts all stations and tracks on the canvas to a JSON string representation.
     *
     * @param configID The configuration ID to associate with the stations and tracks. Default: Active configuration of canvas handler.
     * @returns {string} JSON string representation of all stations and tracks.
     * @
     */
    canvasToJSON(configID = this.canvasHandler.activeConfigurationID) {
        let stationObjs = [];
        let trackObjs = [];
        this.canvasHandler.stationInstances.forEach(st => {
            const obj = {
                id: st.id,
                x: Math.round(st.coords.x),
                y: Math.round(st.coords.y),
                name: st.name,
            };
            stationObjs.push(obj);
        });
        this.canvasHandler.trackInstances.forEach(tr => {
            const obj = {
                id: tr.id,
                from_station_id: tr.stations.startpoint.id,
                to_station_id: tr.stations.endpoint.id,
            };
            trackObjs.push(obj);
        });
        const config = {
            id: configID,
            stations: stationObjs,
            tracks: trackObjs
        };
        return JSON.stringify(config);
    }
    getStationById(id) {
        return this.canvasHandler.allStations.filter(st => st.id == id)[0];
    }
    getTrackById(id) {
        return this.canvasHandler.allTracks.filter(tr => tr.id == id)[0];
    }
    async JSONtoCanvas(json) {
        const config = JSON.parse(json);
        this.canvasHandler.clearCanvas();
        await new Promise(r => setTimeout(r, 400));
        config.stations.forEach(stObj => {
            const newSt = this.canvasHandler.createStation({ x: stObj.x, y: stObj.y }, stObj.id, stObj.name);
        });
        config.tracks.forEach(trObj => {
            const tr = this.canvasHandler.createTrack({ "startpoint": this.getStationById(trObj.from_station_id),
                "endpoint": this.getStationById(trObj.to_station_id) }, trObj.id);
        });
        return config;
    }
    ;
}
//# sourceMappingURL=CanvasSerializer.js.map