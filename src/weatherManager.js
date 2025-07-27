const weatherManager = (() => {
    class weatherManagerSubject {
        constructor() {
            this.observers = [];
            this.currentWeatherData = {}; 
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

        saveWeatherData(fetchedWeatherData) {
            console.log('this is current', this.currentWeatherData )
            this.currentWeatherData = fetchedWeatherData;
            console.log('Data in weather manager',this.currentWeatherData)
        };
    };
    return new weatherManagerSubject()
})();

export default weatherManager