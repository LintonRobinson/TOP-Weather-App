import {format , parse} from "date-fns";

const dataFetchAndLoader = (() => {
    class dataFetchAndLoaderSubject {
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

    async getWeatherData(location) {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=3WJ5V42K3KSMK6SPCEUK6MY38`);
        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData
    };

    async getProccessReturnWeatherData(weatherDataCall, location) {
        const weatherData = await weatherDataCall(location)
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
                return SevenDayForecasts
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
                return HourlyForecasts
            },
        }
        console.log(allWeatherData)
        return allWeatherData

    }
};
    return new dataFetchAndLoaderSubject();
})();


export default dataFetchAndLoader;



// Error when name is ambiguous 


