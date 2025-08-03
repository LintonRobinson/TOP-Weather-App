import weatherManager from "./weatherManager.js";
import { parse, isToday , isSameHour  } from 'date-fns';

const uiManager = (() => {

    class uiManagerSubject {
        constructor() {
            this.observers = {
                successObservers: [],
                failureObservers: []
            };
            this.activeInputId
            this.initialModalOpenState = true;
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
        

        setActiveInputId(inputId) {
            this.activeInputId = inputId;
        };

        get getActiveInputId() {
            return this.activeInputId
        };


        
        getInitialModalState() {
            return this.initialModalOpenState;
        };

        setFalseInitialModalState() {
            this.initialModalOpenState = false;
        };

        toggleLoadingModal() {
            const loadingModal = document.querySelector('#loading-modal');
            loadingModal.classList.toggle('active-modal');
        }

        resetFormStylings() {
            const userLocationForms = document.querySelectorAll('form');
            const userLocationInputs = document.querySelectorAll('input');

            userLocationForms.forEach((form) => {
                form.classList.remove('input-error');
            });

            userLocationInputs.forEach((input) => {
                input.classList.remove('input-error-placeholder');
                input.setAttribute('placeholder','City + State/ZIP/Country Code');
            })
        }

        

        renderUserError() {
            const userLocationInput = document.querySelector(`#${this.activeInputId}`);
            const userLocationForm = userLocationInput.parentElement
            userLocationForm.classList.add('input-error');
            userLocationInput.classList.add('input-error-placeholder');
            userLocationInput.setAttribute('placeholder','Invalid: City + State/ZIP/Country Code');
        }

        async renderCurrentWeather(weatherData) {
            // Render current temperature
            const currentTemperatureElement = document.querySelector('#current-temperature');
            if (weatherManager.getTemperatureMeasurementUnit() === 'Fahrenheit' ) {
                currentTemperatureElement.textContent = `${weatherData.currentTemperature}°F`;
            } else {
                currentTemperatureElement.textContent = `${weatherData.currentTemperature}°C`;
            };
            
            // Render current location
            const currentLocationElement = document.querySelector('#current-location');
            currentLocationElement.textContent = weatherData.currentLocation;

            // Render current date
            const currentDateElement = document.querySelector('#current-date');
            currentDateElement.textContent = weatherData.currentDate;

            // Render current condition
            const currentConditionElement = document.querySelector('#current-condition');
            currentConditionElement.textContent = weatherData.currentCondition;


        

            // Render current condition icon
            const currentConditionImage = document.querySelector('#current-condition-icon');
            const currentConditionImageSource = await import(`./${weatherData.currentIconDescriptor.toLowerCase()}.png`);
            currentConditionImage.src = currentConditionImageSource.default;

            // Render current condition background image
            const currentConditionBackgroundImageSource = await import(`./${weatherData.currentIconDescriptor}-background.jpeg`);
            const mainContainer = document.querySelector('main');
            mainContainer.style.backgroundImage = `url('${currentConditionBackgroundImageSource.default}')`;

        
            
        }

        async renderWeather(weatherData) {
            await this.renderCurrentWeather(weatherData);
            await this.renderSevenDayForecast(weatherData);  
            await this.renderHourlyForecast(weatherData);
            await this.renderCurrentConditions(weatherData);
        }

        async renderSevenDayForecast(weatherData) {
            const dayForecastWrapperElements = document.querySelectorAll('.day-forecast-wrapper');
            dayForecastWrapperElements.forEach(async (dayForecastWrapperElement,index) => {
                dayForecastWrapperElement.classList.remove('todays-forecast')
                
                const currentYear = new Date().getFullYear();
                const parsedDate = parse(`${weatherData.sevenDayForecasts[index].date}, ${currentYear}`, 'MMMM do, yyyy', new Date());
                if (isToday(parsedDate)) dayForecastWrapperElement.classList.add('todays-forecast')
                
                dayForecastWrapperElement.querySelector('.day-of-week').textContent = weatherData.sevenDayForecasts[index].dayOfWeek;
                
                const dayForecastConditionImage = dayForecastWrapperElement.querySelector('img');
                const dayForecastImageSource = await import(`./${weatherData.sevenDayForecasts[index].dayIconDescriptor}.png`);
                dayForecastConditionImage.src = dayForecastImageSource.default;
                
                dayForecastWrapperElement.querySelector('.day-forecast').textContent = weatherData.sevenDayForecasts[index].date;

                if (weatherManager.getTemperatureMeasurementUnit() === 'Fahrenheit' ) {
                    dayForecastWrapperElement.querySelector('.high-temperature').textContent = `H: ${weatherData.sevenDayForecasts[index].dayHighTemperature}°F`;
                    dayForecastWrapperElement.querySelector('.low-temperature').textContent = `L: ${weatherData.sevenDayForecasts[index].dayLowTemperature}°F`;
                } else {
                    dayForecastWrapperElement.querySelector('.high-temperature').textContent = `H: ${weatherData.sevenDayForecasts[index].dayHighTemperature}°C`;
                    dayForecastWrapperElement.querySelector('.low-temperature').textContent = `L: ${weatherData.sevenDayForecasts[index].dayLowTemperature}°C`;
                };
                
            })
            
        }

        async renderHourlyForecast(weatherData) {
            const hourlyCardWrapperElements = document.querySelectorAll('.hourly-card-wrapper');
            hourlyCardWrapperElements.forEach(async (hourlyForecastWrapperElement,index) => {
                hourlyForecastWrapperElement.classList.remove('current-hour');
                if (isSameHour(new Date(), weatherManager.convertTimestampToFormat(weatherData.hourlyForecasts[index].nonConvertedHour))) {
                    hourlyForecastWrapperElement.classList.add('current-hour');
                    hourlyForecastWrapperElement.scrollIntoView({ inline: 'start' })
                };
                
                if (weatherManager.getTemperatureMeasurementUnit() === 'Fahrenheit' ) {
                    hourlyForecastWrapperElement.querySelector('.hour-temperature').textContent = `${weatherData.hourlyForecasts[index].hourlyTemperature}°F`;
                    
                } else {
                    hourlyForecastWrapperElement.querySelector('.hour-temperature').textContent = `${weatherData.hourlyForecasts[index].hourlyTemperature}°C`;
                };
        
                const hourForecastConditionImage = hourlyForecastWrapperElement.querySelector('img');
                const hourForecastImageSource = await import(`./${weatherData.hourlyForecasts[index].hourlyIconDescriptor}.png`);
                hourForecastConditionImage.src = hourForecastImageSource.default; 
            });
        }

        async renderCurrentConditions(weatherData) { 
            // Render current humidity
            const currentHumidityElement = document.querySelector('#current-humidity');
            currentHumidityElement.textContent = `${weatherData.currentHumidity}%`;

            // Render current precipitation
            const currentPrecipitationElement = document.querySelector('#current-precipitation');
            currentPrecipitationElement.textContent = `${weatherData.currentChanceOfPrecipitation}%`;

            // Render current wind
            const currentWindElement = document.querySelector('#current-wind');
            currentWindElement.textContent = `${weatherData.currentWindSpeed}mph`;

            // Render current uv index
            const currentUVIndexElement = document.querySelector('#current-uv-index');
            currentUVIndexElement.textContent = weatherData.currentUVIndex;
        }

        
    };
    return new uiManagerSubject()
})();

export default uiManager