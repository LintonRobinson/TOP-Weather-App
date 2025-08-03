import {format , parse} from "date-fns";
import uiManager from "./uiManager";
import weatherManager from "./weatherManager";


const dataFetchAndLoader = (() => {
    class dataFetchAndLoaderSubject {
        constructor() {
            this.observers = {
                successObservers: [],
                failureObservers: [],
            };
            this.userSearchedLocation
            this.timerId = null;
            this.fetchDataEveryFiveMinutes = () => {
                this.getProccessReturnWeatherData(this.getWeatherData, this.userSearchedLocation);
                this.timerId = setTimeout(this.fetchDataEveryFiveMinutes, 20 * 60 * 1000);
            }
        };

        attachSuccessObserver(callbackFunction) {
            this.observers.successObservers.push(callbackFunction);
        };

        attachFailureObserver(callbackFunction) {
            this.observers.failureObservers.push(callbackFunction);
        };

        detach(callbackFunction) {
            this.observers = this.observers.filter(observer => observer !== callbackFunction);
        };

        notifySuccessObservers(data) {
            this.observers.successObservers.forEach(observer => {
                observer(data);
            });
        };

        notifyFailureObservers(data) {
            this.observers.failureObservers.forEach(observer => {
                observer(data);
            });
        };

        async getWeatherData(location) {
            try {
                console.log('The searched location is',location)
                const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=3WJ5V42K3KSMK6SPCEUK6MY38`);
                if (!response.ok) throw new Error()
                const weatherData = await response.json();
                return weatherData;
            } catch(err) {
                // Throw error to getProccessReturnWeatherData
                throw new Error();
            }
            
        };

        async getProccessReturnWeatherData(weatherDataCall, location) {
            let weatherData;
            this.userSearchedLocation = location
            try {
                uiManager.toggleLoadingModal()
                weatherData = await weatherDataCall(location);
            } catch (err) {
                // Style active input to display error and stop application
                this.notifyFailureObservers();
        
                return

            };
            
            const sevenDayForecasts = [];
            for (let i = 0; i < 7; i++) {
                sevenDayForecasts.push({
                    dayOfWeek: format(weatherData.days[i].datetime, "EEEE"),
                    date: format(weatherData.days[i].datetime, "MMMM do"),
                    dayIconDescriptor: weatherData.days[i].icon,
                    dayHighTemperature: Math.round(weatherData.days[i].tempmax), 
                    dayLowTemperature: Math.round(weatherData.days[i].tempmin),
                });
            };
            // Copy object
            const nonConvertedSevenDayForecasts = sevenDayForecasts.map(forecasts => ({...forecasts}) );
        
            const hourlyForecasts = [];
            for (let i = 0; i < 24; i++) {
                hourlyForecasts.push({
                    nonConvertedHour: weatherData.days[0].hours[i].datetime,
                    hour: format(parse(weatherData.days[0].hours[i].datetime, 'HH:mm:ss', new Date()), 'ha'),
                    hourlyIconDescriptor: weatherData.days[0].hours[i].icon,
                    hourlyTemperature: Math.round(weatherData.days[0].hours[i].temp), 
                })
            };

            const nonConvertedHourlyForecasts = hourlyForecasts.map(forecasts => ({...forecasts}) );

            // Save weather data
            const allWeatherData = {
                currentLocation: weatherData.resolvedAddress,
                currentDate: format(new Date(), "EEEE, MMMM do"),
                currentTemperature: Math.round(weatherData.currentConditions.temp),
                currentCondition: weatherData.currentConditions.conditions,
                currentIconDescriptor: weatherData.currentConditions.icon,
                currentChanceOfPrecipitation: weatherData.currentConditions.precipprob,
                currentHumidity: weatherData.currentConditions.humidity,
                currentWindSpeed: weatherData.currentConditions.windspeed,
                currentUVIndex: weatherData.currentConditions.uvindex,
                sevenDayForecasts: sevenDayForecasts,
                hourlyForecasts: hourlyForecasts,
                nonConvertedSevenDayForecasts: nonConvertedSevenDayForecasts,
                nonConvertedHourlyForecasts: nonConvertedHourlyForecasts,
                previousUserLocationSearch: location,
                nonConvertedTemperature: Math.round(weatherData.currentConditions.temp),
            };
        
            // Send and save weather data to weatherManager
            this.notifySuccessObservers(allWeatherData);
            // Close modal after initial successful location search
            
            if (uiManager.getInitialModalState()) {
                const startDialog = document.querySelector('#initial-modal');
                startDialog.close();
                // Set Modal state to false so this block runs only once
                uiManager.setFalseInitialModalState();
            };



            return allWeatherData;


        };

        getTimerId() {
            return this.timerId;
        }
};
    return new dataFetchAndLoaderSubject();
})();


export default dataFetchAndLoader;
