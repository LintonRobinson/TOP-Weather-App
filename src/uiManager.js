import weatherManager from "./weatherManager.js";
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
            const currentTemperatureElement = document.querySelector('#current-temperature');
            console.log('This is the temp unit', weatherManager.getTemperatureMeasurementUnit())
            if (weatherManager.getTemperatureMeasurementUnit() === 'Fahrenheit' ) {
                console.log('rendering f')
                currentTemperatureElement.textContent = `${weatherData.currentTemperature}°F`;
                
                
            } else {
                console.log('rendering c')
                currentTemperatureElement.textContent = `${weatherData.currentTemperature}°C`;
            };
            



            const currentLocationElement = document.querySelector('#current-location');
            currentLocationElement.textContent = weatherData.currentLocation;

            const currentDateElement = document.querySelector('#current-date');
            currentDateElement.textContent = weatherData.currentDate;

            const currentConditionElement = document.querySelector('#current-condition');
            currentConditionElement.textContent = weatherData.currentCondition;


            const currentConditionIconElement = document.querySelector('#current-condition-icon');
            currentConditionIconElement.src = weatherData.currentCondition;

            const imageSource = await import(`./${weatherData.currentIconDescriptor}.png`);
        
            const currentConditionImage = document.querySelector('#current-condition-icon');
            currentConditionImage.src = imageSource.default;

        
            
        }

        async renderSevenDayForecast(weatherData) {
            const dayForecastWrapperElements = document.querySelectorAll('.day-forecast-wrapper');
            dayForecastWrapperElements.forEach((dayForecastWrapperElement,index) => {
                dayForecastWrapperElement.querySelector('.day-forecast').textContent = weatherData.SevenDayForecasts[index].date;
                //
                import(`./dataFetchAndLoader.js`).then(imageSource => {

                })
                
            })
            
        }
    };
    return new uiManagerSubject()
})();

export default uiManager