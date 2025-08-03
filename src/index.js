import "./style.css"
import "./dataFetchAndLoader.js"
import dataFetchAndLoader from "./dataFetchAndLoader.js"
import weatherManager from "./weatherManager.js"
import uiManager from "./uiManager.js"
import eventListenerManager from "./eventListenerSubject.js"






dataFetchAndLoader.attachSuccessObserver(weatherManager.saveWeatherData.bind(weatherManager));
dataFetchAndLoader.attachSuccessObserver(uiManager.resetFormStylings);
dataFetchAndLoader.attachSuccessObserver(uiManager.toggleLoadingModal);
dataFetchAndLoader.attachFailureObserver(uiManager.renderUserError.bind(uiManager));
dataFetchAndLoader.attachFailureObserver(uiManager.toggleLoadingModal);
weatherManager.attach(uiManager.renderWeather.bind(uiManager));







window.dataFetchAndLoader = dataFetchAndLoader
window.weatherManager = weatherManager
window.uiManager = uiManager
window.eventListenerManager = eventListenerManager