const eventListenerManager = (() => {
    
    function addToggleButtonEventListeners() {
        const sidebar = document.querySelector('aside')
        const toggleModalButtons = document.querySelectorAll('.toggle-sidebar-button')
        console.log(toggleModalButtons)
        toggleModalButtons.forEach((button) => {
            button.addEventListener('click', () => {
                console.log(button)
                sidebar.classList.toggle('active')
            })
        })
    }
    addToggleButtonEventListeners()
    
    
    
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