import { daysInWeek } from "date-fns/constants";
import dataFetchAndLoader from "./dataFetchAndLoader.js";
import uiManager from "./uiManager.js";
import weatherManager from "./weatherManager.js";

const eventListenerManager = (() => {

    function addToggleButtonEventListeners() {
        const sidebar = document.querySelector('aside');
        const toggleModalButtons = document.querySelectorAll('.toggle-sidebar-button');
        toggleModalButtons.forEach((button) => {
            button.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        });
    };
    addToggleButtonEventListeners()

    function addInputEventListeners() {
        const userInputs = document.querySelectorAll('input');
        userInputs.forEach((input) => {
            input.addEventListener('click', () => {
                input.parentElement.style.border = 'solid 1px grey';
            });
            input.addEventListener('focusout', (event) => {
                if (!event.target.parentElement.classList.contains('input-error')) input.parentElement.style.border = '1px solid rgba(255, 255, 255, 0.39)';
            });
        });
    }

    addInputEventListeners();

    
    
    function addFormSubmitListeners() {
        const forms = document.querySelectorAll('form')
        // For each form, when it is submitted reset the input value and 
        forms.forEach((form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const userInput = event.target.querySelector('input');
                uiManager.setActiveInputId(userInput.id);
                dataFetchAndLoader.getProccessReturnWeatherData(dataFetchAndLoader.getWeatherData,userInput.value);
                userInput.value = "";
                if (dataFetchAndLoader.getTimerId() !== null) clearTimeout(dataFetchAndLoader.getTimerId());
                dataFetchAndLoader.fetchDataEveryFiveMinutes();
            });
        });

    

        
    }
    addFormSubmitListeners();

    function addTemperatureUnitToggleListeners() {
        const temperatureButtonWrapper = document.querySelector('#temperature-unit-button-wrapper');
        const fahrenheitButton = document.querySelector('#Fahrenheit');
        const celsiusButton =  document.querySelector('#Celsius');
        temperatureButtonWrapper.addEventListener('click', (event) => {
            // If 
            if (event.target.matches('#Fahrenheit') && weatherManager.getTemperatureMeasurementUnit() !== 'Fahrenheit') {
                weatherManager.revertTemperaturesToFahrenheit()
                uiManager.renderWeather(weatherManager.getWeatherData());
                celsiusButton.classList.remove('active-temp-unit');
                fahrenheitButton.classList.add('active-temp-unit');
            }

            if (event.target.matches('#Celsius') && weatherManager.getTemperatureMeasurementUnit() !== 'Celsius') {
                weatherManager.convertTemperaturesToCelsius();
                uiManager.renderWeather(weatherManager.getWeatherData());
                fahrenheitButton.classList.remove('active-temp-unit');
                celsiusButton.classList.add('active-temp-unit');
            }

        });

    

        
    }
    addTemperatureUnitToggleListeners();


    
    
    
    class eventListenerManagerSubject {
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
    return new eventListenerManagerSubject()
})();

export default eventListenerManager