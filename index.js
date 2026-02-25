let countdownTimer; 
let isRunning = false;

function getInputValue(id) {
    const val = parseInt(document.getElementById(id).value);
    return isNaN(val) ? 0 : val;
}

function updateDisplay(remainingTime) {
    if (remainingTime < 0) remainingTime = 0;

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    updateTimeSection('hours', hours);
    updateTimeSection('minutes', minutes);
    updateTimeSection('seconds', seconds);
}

function startCountdown() {
    if (isRunning) return;

    const hours = getInputValue('inputHours');
    const minutes = getInputValue('inputMinutes');
    const seconds = getInputValue('inputSeconds');

    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (totalSeconds <= 0) return;

    isRunning = true;
    updateDisplay(totalSeconds);

    countdownTimer = setInterval(() => {
        totalSeconds--;

        if (totalSeconds < 0) {
            clearInterval(countdownTimer); 
            isRunning = false;
            return;
        }

        updateDisplay(totalSeconds);
    }, 1000);
}

function resetCountdown() {
    clearInterval(countdownTimer);
    isRunning = false;
    updateDisplay(0);
    document.getElementById('inputHours').value = '';
    document.getElementById('inputMinutes').value = '';
    document.getElementById('inputSeconds').value = '';
}

function getTimeSegmentElements(segmentElement) {
    const segmentDisplay = segmentElement.querySelector('.segment-display');
    const segmentDisplayTop = segmentDisplay.querySelector('.segment-display__top');
    const segmentDisplayBottom = segmentDisplay.querySelector('.segment-display__bottom');
    const segmentOverlay = segmentDisplay.querySelector('.segment-overlay');
    const segmentOverlayTop = segmentOverlay.querySelector('.segment-overlay__top');
    const segmentOverlayBottom = segmentOverlay.querySelector('.segment-overlay__bottom');

    return {
        segmentDisplayTop,
        segmentDisplayBottom,
        segmentOverlay,
        segmentOverlayTop,
        segmentOverlayBottom,
    };
}

function updateSegmentValues(displayElement, overlayElement, value) {
    displayElement.textContent = value;
    overlayElement.textContent = value;
}

function updateTimeSegment(segmentElement, timeValue) {
    const segmentElements = getTimeSegmentElements(segmentElement);
    const currentValue = parseInt(segmentElements.segmentDisplayTop.textContent, 10);

    if (currentValue === timeValue) {
        return;
    }

    segmentElements.segmentOverlay.classList.add('flip');

    updateSegmentValues(
        segmentElements.segmentDisplayTop,
        segmentElements.segmentOverlayBottom,
        timeValue
    );

    function finishAnimation() {
        segmentElements.segmentOverlay.classList.remove('flip');
        updateSegmentValues(
            segmentElements.segmentDisplayBottom,
            segmentElements.segmentOverlayTop,
            timeValue
        );
        this.removeEventListener('animationend', finishAnimation);
    }

    segmentElements.segmentOverlay.addEventListener('animationend', finishAnimation);
}

function updateTimeSection(sectionID, timeValue) {
    const firstNumber = Math.floor(timeValue / 10) || 0;
    const secondNumber = timeValue % 10 || 0;
    const sectionElement = document.getElementById(sectionID);
    const timeSegments = sectionElement.querySelectorAll('.time-segment');

    updateTimeSegment(timeSegments[0], firstNumber);
    updateTimeSegment(timeSegments[1], secondNumber);
}


document.getElementById('startButton').addEventListener('click', startCountdown);
document.getElementById('resetButton').addEventListener('click', resetCountdown);

// Initial display reset
updateDisplay(0);
