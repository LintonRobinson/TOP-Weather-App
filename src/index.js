import "./style.css"
import "./dataFetchAndLoader.js"
import dataFetchAndLoader from "./dataFetchAndLoader.js"
import weatherManager from "./weatherManager.js"
import uiManager from "./uiManager.js"






dataFetchAndLoader.attachSuccessObserver(weatherManager.saveWeatherData.bind(weatherManager))
dataFetchAndLoader.attachFailureObserver(uiManager.renderUserError.bind(uiManager))



window.exampleWeatherObject = async () => {
    const data = await dataFetchAndLoader.getProccessReturnWeatherData(dataFetchAndLoader.getWeatherData,'upperville');
    console.log('This is it', data)
    return data;
}



// current condition, 

// const yaMama = await exampleWeatherObject()

window.dataFetchAndLoader = dataFetchAndLoader
window.weatherManager = weatherManager
window.uiManager = uiManager