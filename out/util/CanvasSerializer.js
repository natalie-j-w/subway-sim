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
                config_id: configID
            };
            stationObjs.push(obj);
        });
        this.canvasHandler.trackInstances.forEach(tr => {
            const obj = {
                id: tr.id,
                fromStationId: tr.stations.startpoint.id,
                toStationId: tr.stations.endpoint.id,
                config_id: configID
            };
            trackObjs.push(obj);
        });
        return JSON.stringify({ stations: stationObjs, tracks: trackObjs });
    }
    getStationById(id) {
        return this.canvasHandler.allStations.filter(st => st.id == id)[0];
    }
    getTrackById(id) {
        return this.canvasHandler.allTracks.filter(tr => tr.id == id)[0];
    }
}
//# sourceMappingURL=CanvasSerializer.js.map