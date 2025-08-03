import { set } from 'date-fns';
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
            console.log('Data in weather manager',this.currentWeatherData);
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
            this.currentWeatherData.currentTemperature = Math.round((this.currentWeatherData.currentTemperature - 32) * (5/9));
            // 
            this.currentWeatherData.sevenDayForecasts.forEach(forecast => {
                forecast.dayHighTemperature = Math.round((forecast.dayHighTemperature - 32) * (5/9));
                forecast.dayLowTemperature = Math.round((forecast.dayLowTemperature - 32) * (5/9));
            });
            //
            this.currentWeatherData.hourlyForecasts.forEach(forecast => {
                forecast.hourlyTemperature = Math.round((forecast.hourlyTemperature - 32) * (5/9));
            });

        };

        

        
        revertTemperaturesToFahrenheit() {
            this.setTemperatureMeasurementUnit('Fahrenheit');
            this.currentWeatherData.currentTemperature = this.currentWeatherData.nonConvertedTemperature;
            this.currentWeatherData.sevenDayForecasts = this.currentWeatherData.nonConvertedSevenDayForecasts.map(forecasts => ({...forecasts}));
            
            this.currentWeatherData.hourlyForecasts = this.currentWeatherData.nonConvertedHourlyForecasts.map(forecasts => ({...forecasts}));
            console.log('non',this.currentWeatherData.nonConvertedSevenDayForecasts)
        };

        convertTimestampToFormat(timestamp) {
            // Reformat timestamp to be accepted by date-fns set
            let reformattedTimestamp = timestamp.split(':')[0];
            reformattedTimestamp.charAt(0) === '0' ? reformattedTimestamp = Number(reformattedTimestamp.split("").pop().toString()): reformattedTimestamp = Number(reformattedTimestamp);
            return set(new Date(), {hours: reformattedTimestamp})   
        }

    };
    return new weatherManagerSubject();
})();

export default weatherManager