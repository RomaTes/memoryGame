

class MatchGrid {
    constructor(args) {
        // Initialization data
        this.width = args.width;
        this.height = args.height;
        this.columns = args.columns;
        this.rows = args.rows;
        this.timeLimit = args.timeLimit;
        this.theme = args.theme;

        // Game state
        this.cards = [];
        this.selectedCards = [];
        this.matchedCards = [];
        this.timerId = null;
        this.remainingTime = this.timeLimit;

        // DOM elements
        this.timerElem = document.getElementById("timer-elem");
        this.container = document.getElementById("match-grid");
        this.startButton = document.getElementById("start-button");
        this.replayButton = document.getElementById("replay-button");
        this.pauseButton = document.getElementById("pause-button");
        this.generateButton = document.getElementById("generate-button");
        this.container.style.backgroundColor = this.theme.backgroundColor;
        this.allCards = [];
    }

    generateCards() {
        const numberOfCards = this.columns * this.rows;
        const pairs = numberOfCards / 2;
        let numbers = [];
        for (var i = 1; i <= numberOfCards; i++) {
            numbers.push(i); 
        }
        for (let i = 0; i < pairs; i++) {
            const card1 = {
                value: i,
            };
            const card2 = {
                value: i,
            };
            this.cards.push(card1, card2);
        }
        this.shuffleCards();
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderCards() {
        const cardsArr = [];
        this.cards.forEach((card, index) => {
            const div = document.createElement("div");
            div.classList.add("card");
            div.dataset.index = index;
            div.style.backgroundColor = this.theme.cardColor;
            div.style.backgroundColor = this.theme.cardColor;
            const divInner = document.createElement("div");
            divInner.classList.add('card-inner');
            divInner.classList.add('preview');
            const front = document.createElement("div");
            front.classList.add('card-front');
            const back = document.createElement("div");
            back.classList.add('card-back');
            back.innerHTML = card.value;
            divInner.appendChild(front);
            divInner.appendChild(back);
            div.appendChild(divInner);
            // this.container.appendChild(div);
            this.allCards.push(divInner);
            cardsArr.push(div);
        });

        return cardsArr;
    }

    handleCardClick(event) {
        const card = event.target.closest(".card");
        if (!card.classList.contains("card")) {
            return;
        }
        if (card.classList.contains("selected")) {
            return;
        }
        if (this.selectedCards.length === 2) {
            return;
        }

        card.classList.add("selected");
        this.selectedCards.push(card);
        if (this.selectedCards.length === 2) {
            this.checkSelectedCards();
        }
    }

    checkSelectedCards() {
        const index1 = parseInt(this.selectedCards[0].dataset.index);
        const index2 = parseInt(this.selectedCards[1].dataset.index);
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];
        if (card1.value === card2.value) {
            this.matchedCards.push(card1, card2);
            this.selectedCards.forEach((card) => {
                card.classList.remove("selected");
                card.classList.add("matched");
            });
            this.selectedCards = [];
            if (this.matchedCards.length === this.cards.length) {
                this.endGame("win");
            }
        } else {
            this.disableCardClick();
            setTimeout(() => {
                this.selectedCards.forEach((card) => {
                    card.classList.remove("selected");
                });
                this.enableCardClick();
                this.selectedCards = [];
            }, 300);
        }
    }

    disableCardClick() {
        this.container.classList.add("disabled");
    }

    enableCardClick() {
        this.container.classList.remove("disabled");
    }

    startTimer() {
        this.timerId = setInterval(() => {
            this.remainingTime--;
            this.timerElem.innerHTML = this.remainingTime;
            if (this.remainingTime === 0) {
                this.endGame();
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerId);
    }

    handleStartClick() {
        this.generateCards();
    }

    handleReplayClick() {
        this.stopTimer();
        this.remainingTime = this.timeLimit;
        this.timerElem.innerHTML = this.remainingTime;
        this.selectedCards = [];
        this.matchedCards = [];
        this.renderCards();
    }

    endGame(value) {
        this.stopTimer();
        this.selectedCards = [];
        this.disableCardClick();
        this.startButton.disabled = true;
        if(value === 'win') alert("Winner!");
        else alert("Lose Game Over!");
    }
}






const timerElem = document.getElementById("timer-elem");
const container = document.getElementById("match-grid");
const startButton = document.getElementById("start-button");
const replayButton = document.getElementById("replay-button");
const pauseButton = document.getElementById("pause-button");
const generateButton = document.getElementById("generate-button");

let matchGrid;

container.addEventListener("click",containerClickHandker);

function containerClickHandker(){
    const card = event.target.closest(".card");
    if (!card.classList.contains("card")) return;

    if (card.classList.contains("selected")) return;

    if (matchGrid.selectedCards.length === 2) return;

    card.classList.add("selected");
    matchGrid.selectedCards.push(card);

    if (matchGrid.selectedCards.length === 2) matchGrid.checkSelectedCards();
}

pauseButton.addEventListener("click", pauseButtonHandler);

function pauseButtonHandler(){
    if(matchGrid) matchGrid.stopTimer();
}

replayButton.addEventListener("click", replayButtonHandler);

function replayButtonHandler(){
    startButton.disabled = false;
    matchGrid.handleReplayClick();
    createCards();
}

startButton.addEventListener("click", startButtonHandler);

function startButtonHandler(){
    matchGrid.allCards.forEach((value)=>{
        value.classList.remove("preview");
    });
    matchGrid.stopTimer();
    matchGrid.startTimer();
    container.classList.remove('disabled');
    matchGrid.enableCardClick();
}

generateButton.addEventListener("click", ()=>{
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
        }
    });
    generationPresets();
});

document.addEventListener("mouseleave",()=>{
    if(matchGrid) matchGrid.stopTimer();
});

function createCards() {
    container.innerHTML = "";
    const grid = matchGrid.renderCards();
    grid.forEach((elem) => {
        container.appendChild(elem);
    });
}

function generationPresets() {
    document.getElementById("timer-elem").innerHTML = document.getElementById("time-limit").value;
    matchGrid.handleStartClick();
    container.innerHTML = "";
    const grid = matchGrid.renderCards();
    grid.forEach((elem) => {
        container.appendChild(elem);
    });
    container.style.gridTemplateColumns = `repeat(${matchGrid.columns}, 1fr)`;
    // container.style.gridTemplateRows = `repeat(${matchGrid.rows}, 1fr)`;
    container.style.width = `${matchGrid.width}px`;
    container.style.height = `${matchGrid.height}px`;
    startButton.disabled = false;
    matchGrid.disableCardClick();
}

