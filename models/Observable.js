export class Observable {
    observers;

    constructor() {
        this.observers = []
    }

    subscribe(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
            return true;
        }
        return false;
    }

    unsubscribe(observer) {
        const index = this.observers.indexOf(observer);
        if (index === -1) {return false};

        this.observers.splice(index, 1);
        return true;
    }

    notify(eventType, payload) {
        this.observers.forEach(obs => {
            obs.update(eventType, payload);
        })
    }
}