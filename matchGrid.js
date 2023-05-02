export class MatchGrid {
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
        this.allCards = [];

        // DOM elements
        this.container = args.container;
        this.startButton = args.startButton;
        this.container.style.backgroundColor = this.theme.backgroundColor;
    }

    generateCards() {
        const numberOfCards = this.columns * this.rows;
        const pairs = numberOfCards / 2;
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
        return this.cards.map((card, index) => {
                const cardContainer = document.createElement("div");
                cardContainer.classList.add("card");
                cardContainer.dataset.index = index.toString();
                cardContainer.style.backgroundColor = this.theme.cardColor;
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
                cardContainer.appendChild(divInner);
                this.allCards.push(divInner);
                return cardContainer;
            })
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

    startTimer(timerElem) {
        this.timerId = setInterval(() => {
            this.remainingTime--;
            timerElem.innerHTML = this.remainingTime;
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

    handleReplayClick(timerElem) {
        this.stopTimer();
        this.remainingTime = this.timeLimit;
        timerElem.innerHTML = this.remainingTime;
        this.selectedCards = [];
        this.matchedCards = [];
        this.renderCards();
    }

    endGame(value) {
        this.stopTimer();
        this.selectedCards = [];
        this.disableCardClick();
        startButton.disabled = true;
        if(value === 'win') alert("Winner!");
        else alert("Lose Game Over!");
    }
}