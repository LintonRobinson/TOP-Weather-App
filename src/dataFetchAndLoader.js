import { format , parse} from "date-fns";

const dataFetchAndLoader = ((() => {
    // Get all weather data from API
    const getWeatherData = async (location) => {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=3WJ5V42K3KSMK6SPCEUK6MY38`);
        const weatherData = await response.json();
        return weatherData
    }

    // Get and process weather data specifically needed for this application.
    const getProccessReturnWeatherData = async (weatherDataCall, location) => {
        const weatherData = await weatherDataCall(location)
        const allWeatherData = {
            weatherData: weatherData,
            currentLocation: weatherData.resolvedAddress,
            currentDate: format(weatherData.days[0].datetime, "EEEE, MMMM do"),
            currentTemperature: weatherData.currentConditions.temp,
            currentCondition: weatherData.currentConditions.conditions,
            currentIconDescriptor: weatherData.currentConditions.icon,
            currentChanceOfPrecipitation: weatherData.currentConditions.precipprob,
            currentWindSpeed: weatherData.currentConditions.windspeed,
            currentWindSpeed: weatherData.currentConditions.windspeed,
            get getSevenDayForecasts() {
                const SevenDayForecasts = [];
                for (let i = 0; i <= 7; i++) {
                    SevenDayForecasts.push({
                        dayOfWeek: format(this.weatherData.days[i].datetime, "EEEE"),
                        date: format(this.weatherData.days[i].datetime, "MMMM do"),
                        dayIconDescriptor: this.weatherData.days[i].icon,
                        dayHighTemperature: this.weatherData.days[i].tempmax, // Wrap in funtion that has state of f or c
                        dayLowTemperature: this.weatherData.days[i].tempmin,

                    })
                }
                return SevenDayForecasts
            },
            get getHourlyForecasts() {
                const HourlyForyForecasts = [];
                for (let i = 0; i < 24; i++) {
                    HourlyForyForecasts.push({
                        hour: format(parse(this.weatherData.days[0].hours[i].datetime, 'HH:mm:ss', new Date()), 'ha'),
                        hourlyIconDescriptor: this.weatherData.days[0].hours[i].icon,
                        hourlyTemperature: this.weatherData.days[0].hours[i].temp, 
            

                    })
                }
                return HourlyForyForecasts
            },
        }
        return allWeatherData
    }
    // dataFetchAndLoader.getProccessReturnWeatherData(dataFetchAndLoader.getWeatherData,'upperville');


   
    
    
    return { getWeatherData , getProccessReturnWeatherData }
})());



export default dataFetchAndLoader;



// Error when name is ambiguous 

// const troyWeather = dataFetchAndLoader.getWeatherData('troymi')