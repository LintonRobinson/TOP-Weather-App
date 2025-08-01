const weatherManager = (() => {
    class weatherManagerSubject {
        constructor() {
            this.observers = [];
            this.currentWeatherData = {}; 
            this.temperatureMeasurementUnit = 'Fahrenheit';
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
            this.currentWeatherData = fetchedWeatherData;
            this.notify(this.currentWeatherData);
            console.log('Data in weather manager',this.currentWeatherData)
        };

        getWeatherData() {
            return this.currentWeatherData;
        };

        getTemperatureMeasurementUnit() {
            return this.temperatureMeasurementUnit;
        };

        setTemperatureMeasurementUnit(unit) {
            return this.temperatureMeasurementUnit = unit;
        };

        convertTemperaturesToCelsius() {
            this.setTemperatureMeasurementUnit('Celsius');
            // If the current temperature measurement is Fahrenheit, set the current tempature without conversion. If not, convert to Celsius
            this.currentWeatherData.currentTemperature = `${Math.round((this.currentWeatherData.currentTemperature - 32) * (5/9))}`;

        };

        
        revertTemperaturesToFahrenheit() {
            weatherManager.setTemperatureMeasurementUnit('Fahrenheit');
            weatherManager.currentWeatherData.currentTemperature = weatherManager.currentWeatherData.nonConvertedTemperature;
        };


    };
    return new weatherManagerSubject();
})();

export default weatherManager