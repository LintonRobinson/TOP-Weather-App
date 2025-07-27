const uiManager = (() => {
    class uiManagerSubject {
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
        
        renderUserError() {
            const userLocationInput = document.querySelector('#location-input-sidebar');
            const userLocationForm = document.querySelector('#sidebar-form');
            userLocationForm.classList.add('input-error');
            userLocationInput.setAttribute('placeholder','Invalid.')
            
        }

        renderCurrentWeather(weatherData) {
            c
        }
    };
    return new uiManagerSubject()
})();

export default uiManager