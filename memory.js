/*
    GOOD:
    - custom game config;
    - using Guard Clauses;
    - using event delegation;
    - using CSS Grid Container
    BAD:
     - requirements not met:
        "Game must "Pause" whenever the mouse is outside of the activity." - timer is not resuming when mouse comes back inside activity, so game is stopping, not pausing.
     - errors in console;
     - useless parts of code;
     - code structure is not clear: using class MatchGrid is mixed with using globals, sometimes with duplicates (e.g. for buttons and handling card click logic)
     MIGHT BE BETTER:
      - prevent user interaction if it's impossible (e.g. lock Start button if cards are not generated etc.)
*/

import { MatchGrid } from "./matchGrid.js";

const timerElem = document.getElementById("timer-elem");
const container = document.getElementById("match-grid");
const startButton = document.getElementById("start-button");
const replayButton = document.getElementById("replay-button");
const pauseButton = document.getElementById("pause-button");
const generateButton = document.getElementById("generate-button");

container.addEventListener("click",containerClickHandker);
pauseButton.addEventListener("click", pauseButtonHandler);
replayButton.addEventListener("click", replayButtonHandler);
startButton.addEventListener("click", startButtonHandler);
generateButton.addEventListener("click",generateMathGrid);

let matchGrid;

document.addEventListener("mouseleave",()=>{
    if(matchGrid) matchGrid.stopTimer();
});
document.addEventListener("mouseenter",()=>{
    if(matchGrid && (matchGrid.remainingTime !== matchGrid.timeLimit)) matchGrid.startTimer(timerElem);
});

function containerClickHandker(){
    const card = event.target.closest(".card");
    if (!card.classList.contains("card")) return;

    if (card.classList.contains("selected")) return;

    if (matchGrid.selectedCards.length === 2) return;

    card.classList.add("selected");
    matchGrid.selectedCards.push(card);

    if (matchGrid.selectedCards.length === 2) matchGrid.checkSelectedCards();
}

function pauseButtonHandler(){
    if(matchGrid) matchGrid.stopTimer();
}

function replayButtonHandler(){
    startButton.disabled = false;
    matchGrid.handleReplayClick(timerElem);
    createCards();
}

function startButtonHandler(){
    matchGrid.allCards.forEach((value)=>{
        value.classList.remove("preview");
    });
    matchGrid.stopTimer();
    matchGrid.startTimer(timerElem);
    replayButton.disabled = false;
    container.classList.remove('disabled');
    matchGrid.enableCardClick();
}

function generateMathGrid(){
    matchGrid?.stopTimer();
    matchGrid = null;
    matchGrid = new MatchGrid({
        width: Number(document.getElementById("width-input").value),
        height: Number(document.getElementById("width-input").value),
        columns: Number(document.getElementById("columns-input").value),
        rows: Number(document.getElementById("rows-input").value),
        timeLimit: Number(document.getElementById("time-limit").value),
        theme: {
            backgroundColor: document.getElementById("back-select").value,
            cardColor: document.getElementById("color-select").value,
        },
        container: container,
        startButton: startButton
    });
    generationPresets();
}

function createCards() {
    container.innerHTML = "";
    const grid = matchGrid.renderCards();
    grid.forEach((elem) => {
        container.appendChild(elem);
    });
}

function generationPresets() {
    timerElem.innerHTML = document.getElementById("time-limit").value;
    matchGrid.handleStartClick();
    container.innerHTML = "";
    const grid = matchGrid.renderCards();
    grid.forEach((elem) => {
        container.appendChild(elem);
    });
    container.style.gridTemplateColumns = `repeat(${matchGrid.columns}, 1fr)`;
    container.style.width = `${matchGrid.width}px`;
    container.style.height = `${matchGrid.height}px`;
    startButton.disabled = false;
    matchGrid.disableCardClick();
}

