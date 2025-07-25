export default class BaseSubject {
    constructor() {
        this.observers = [];
    };

    attach(callbackFunction) {
        this.observers.push(callbackFunction);
    };

    detach(callbackFunction) {
        this.observers = this.observers.filter(observer => observer !== callbackFunction);
    };

    notify(data) {
        this.observers.forEach(observer => {
            observer(data);
        });
    };
};