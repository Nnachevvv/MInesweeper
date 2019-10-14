class StopWatch {
    constructor() {

        this.timerStarted = false;

    }

    startTime() {
        this.timerStarted = true;
        let seconds = 0;
        let el = document.getElementById("timer");

        function startInterval() {
            seconds += 1;
            el.innerHTML = seconds + " ";
        }

        this.cancel = setInterval(startInterval, 1000);

    }

    stopInterval() {
        this.timerStarted = false;
        clearInterval(this.cancel);
    }

}
