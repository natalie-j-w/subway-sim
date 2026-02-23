import { CanvasHandler } from "../canvas/CanvasHandler.js";
import { Station } from "../canvas/Station.js";
import { Track } from "../canvas/Track.js";

/** Defines JSON fields for station serialization.
 * x and y are rounded to full int.
 */
type StationObject = {
    id: number,
    x: number,
    y: number,
    name: string,
}

/** Defines JSON fields for track serialization */
type TrackObject = {
    id: number,
    from_station_id: number,
    to_station_id: number,
}

/** Defines JSON fields for serialization of entire current canvas object configuration */
type ObjectsConfiguration = {
    id: number,
    stations: Array<StationObject>,
    tracks: Array<TrackObject>
}

export class CanvasSerializer {
    canvasHandler: CanvasHandler;

    constructor(canvasHandler: CanvasHandler) {
        this.canvasHandler = canvasHandler;
    }

    /**
     * Converts all stations and tracks on the canvas to a JSON string representation.
     * 
     * @param configID The configuration ID to associate with the stations and tracks. Default: Active configuration of canvas handler.
     * @returns {string} JSON string representation of all stations and tracks.
     * @
     */
    canvasToJSON(configID: number = this.canvasHandler.activeConfigurationID): string {
        let stationObjs: Array<StationObject> = [];
        let trackObjs: Array<TrackObject> = [];

        this.canvasHandler.stationInstances.forEach(st => {
            const obj: StationObject = {
                id: st.id,
                x: Math.round(st.coords.x), 
                y: Math.round(st.coords.y), 
                name: st.name, 
            };

            stationObjs.push(obj);
        });

        this.canvasHandler.trackInstances.forEach(tr => {
            const obj: TrackObject = {
                id: tr.id,
                from_station_id: tr.stations.startpoint.id,
                to_station_id: tr.stations.endpoint.id,
            }

            trackObjs.push(obj);
        })

        const config: ObjectsConfiguration = {
            id: configID,
            stations: stationObjs,
            tracks: trackObjs
        }

        return JSON.stringify(config);
    }

    getStationById(id: number): Station {
        return this.canvasHandler.allStations.filter(st => st.id == id)[0];
    }

    getTrackById(id: number): Track {
        return this.canvasHandler.allTracks.filter(tr => tr.id == id)[0];
    }
}