import {JS_VARS} from '../constants.js'

export class StationData {
    id
    x
    y
    #name
    connections


    constructor( {id, x, y, name="Unnamed", connections=[]} ) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.#name = name;
        this.connections = connections;
    }

    toDTO () {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            name: this.getName()
        }
    }

    getName() {
        return this.#name;
    }

    setName(newName) {
        if (newName.length > JS_VARS.STATION_NAME_MAXLENGTH) {
            throw RangeError(`Station name length cannot excede ${JS_VARS.STATION_NAME_MAXLENGTH} characters,
                Current length: ${newName.length}`)
        }
        this.#name = newName;
    }
}