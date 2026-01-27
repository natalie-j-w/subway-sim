export class Observer {
    constructor(name){
        this.name = name;
    }

    update(eventType, payload) {
        console.log(`${this.name} was updated by event ${eventType} with payload: `, payload);
    }
}