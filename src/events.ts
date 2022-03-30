import EventEmitter from "events";

class EventBus extends EventEmitter {
    constructor() {
        super();
    }
};

const eventBus = new EventBus();

export default eventBus;