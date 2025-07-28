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
            console.log('The current input parent',userLocationInput)
            const userLocationForm = userLocationInput.parentElement
            console.log('the form',userLocationForm);
            userLocationForm.classList.add('input-error');
            userLocationInput.classList.add('input-error-placeholder');
            userLocationInput.setAttribute('placeholder','Invalid: City + State/ZIP/Country Code');
        }

        renderCurrentWeather(weatherData) {
            
        }
    };
    return new uiManagerSubject()
})();

export default uiManager