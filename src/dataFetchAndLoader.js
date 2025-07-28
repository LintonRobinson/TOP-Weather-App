import {format , parse} from "date-fns";
import weatherManager from "./weatherManager";
import uiManager from "./uiManager";


const dataFetchAndLoader = (() => {
    class dataFetchAndLoaderSubject {
    constructor() {
        
        this.observers = {
            successObservers: [],
            failureObservers: [],
        };
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
        console.log('This is the observers',this.observers)
        this.observers.successObservers.forEach(observer => {
            observer(data);
        });
    };

    notifyFailureObservers(data) {
        console.log('This is the observers',this.observers.failureObservers)
        this.observers.failureObservers.forEach(observer => {
            observer(data);
        });
    };

    async getWeatherData(location) {
        try {
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
        try {
            uiManager.toggleLoadingModal()
            weatherData = await weatherDataCall(location);
        } catch (err) {
            // Style active input to display error and stop application
            this.notifyFailureObservers();
            
            return

        }
        

        const allWeatherData = {
            currentLocation: weatherData.resolvedAddress,
            currentDate: format(weatherData.days[0].datetime, "EEEE, MMMM do"),
            currentTemperature: weatherData.currentConditions.temp,
            currentCondition: weatherData.currentConditions.conditions,
            currentIconDescriptor: weatherData.currentConditions.icon,
            currentChanceOfPrecipitation: weatherData.currentConditions.precipprob,
            currentWindSpeed: weatherData.currentConditions.windspeed,
            get getSevenDayForecasts() {
                const SevenDayForecasts = [];
                for (let i = 0; i <= 7; i++) {
                    SevenDayForecasts.push({
                        dayOfWeek: format(weatherData.days[i].datetime, "EEEE"),
                        date: format(weatherData.days[i].datetime, "MMMM do"),
                        dayIconDescriptor: weatherData.days[i].icon,
                        dayHighTemperature: weatherData.days[i].tempmax, 
                        dayLowTemperature: weatherData.days[i].tempmin,

                    });
                }
                return SevenDayForecasts;
            },
            get getHourlyForecasts() {
                const HourlyForecasts = [];
                for (let i = 0; i < 24; i++) {
                    HourlyForecasts.push({
                        hour: format(parse(weatherData.days[0].hours[i].datetime, 'HH:mm:ss', new Date()), 'ha'),
                        hourlyIconDescriptor: weatherData.days[0].hours[i].icon,
                        hourlyTemperature: weatherData.days[0].hours[i].temp, 
                    })
                }
                return HourlyForecasts;
            },
        }
        // Send and save weather data to weatherManager
        this.notifySuccessObservers(allWeatherData);
        // Close modal after initial successful location search
        if (uiManager.getInitialModalState()) {
            const startDialog = document.querySelector('#initial-modal')
            startDialog.close();
            // Set Modal state to false so this block runs only once
            uiManager.setFalseInitialModalState();
        }
        return allWeatherData;

    }
};
    return new dataFetchAndLoaderSubject();
})();


export default dataFetchAndLoader;



// Error when name is ambiguous 


// dataFetchAndLoader.getProccessReturnWeatherData(dataFetchAndLoader.getWeatherData,'upperville');