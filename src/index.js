import "./style.css"
import "./dataFetchAndLoader.js"
import dataFetchAndLoader from "./dataFetchAndLoader.js"



window.dataFetchAndLoader = dataFetchAndLoader


window.exampleWeatherObject = async () => {
    const data = await dataFetchAndLoader.getProccessReturnWeatherData(dataFetchAndLoader.getWeatherData,'upperville');
    console.log('This is it', data)
    return data;
}



// current condition, 

// const yaMama = await exampleWeatherObject()