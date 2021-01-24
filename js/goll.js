/**
 * Game Logics
 * 
 */
let STARTING_PAIRS = 4;
let numberOfPairs = STARTING_PAIRS;
let MAX_NUM_CARDS = 36;
let SECONDS_PER_CARD = 3;
let CHEAT_MIN_SCORE = 100;
let cd = null;
let logics = null;
var timeRemaining = 0;
let currentLevel = 0;

class CardDefinition {
    constructor(numberOfCards) {
        let arr = [];
        for( let i = 1; i <= MAX_NUM_CARDS; i ++ ) {
            arr.push(i);
        }
        let shuffledArr = logics.shuffleArray(arr);
        for(let i = 0; i < numberOfCards; i ++ ) {
            this.createCard(shuffledArr[i]);
        }
    }

    /* Dynamically construct a pairs deck */
    createCard(count) {
        let cardDefinition =  "<div class=\"card\"><div class=\"card-back card-face\"><div class=\"goll-back\"></div></div><div class=\"card-front card-face\"><img class=\"goll-front card-value\" src=\"assets/card"
            + count + ".jpg\"></div></div>";
        document.getElementById('board').innerHTML += cardDefinition;
        document.getElementById('board').innerHTML += cardDefinition;
    }
}

class Logics {
    constructor() {
        this.scorePoints = 0;
    }

    playSound(name) {
        let soundEnabled = localStorage.getItem("sound");
        if(soundEnabled == 1) {
            let sound = document.getElementById(name);
            if(sound!=null) {
                sound.currentTime = 0;
                sound.loop= false;
                sound.play();
                console.log("Play sound " + name);
            }
        }
    }

    playMusic(name) {
        let musicEnabled = localStorage.getItem("music");
        if(musicEnabled == 1) {
            let music = document.getElementById(name);
            if(music!=null) {
                //music.currentTime = 0;
                music.loop= true;
                music.play();
            }
        }
    }

    stopSound(name) {
        let sound = document.getElementById(name);
        if(sound!=null) {
            sound.loop= false;
            sound.pause();
            sound.currentTime = 0;
        }
    }

    setTimer() {
        let totalTime = SECONDS_PER_CARD * ( (numberOfPairs * numberOfPairs) / 2 );
        this.totalTime = totalTime;
        timeRemaining = totalTime;
    }

    setCards(cards) {
        this.cards = cards;
    }

    formatTime(seconds) {
        let hours = Math.floor( seconds / 3600 );
        seconds %= 3600;
        let minutes = Math.floor( seconds / 60 );
        let secs = seconds % 60;

        return String(hours).padStart(2,"0") + ":" + String(minutes).padStart(2,"0") + ":"+ String(secs).padStart(2,"0");
    }

    setScore(points) {
        this.scorePoints = Number(this.scorePoints) + Number(points);
        if(this.scorePoints < 0)
            this.scorePoints = 0;
        this.score.innerText = String(this.scorePoints).padStart(8, " ");
        this.score.classList.add("blinking");
        setTimeout( () => {
            this.score.classList.remove("blinking");
        }, 1000);
        this.evalCheatButton();
        console.log("New score is " + this.scorePoints);
        this.setHighscore();
    }

    setHighscore() {
        let highScorePoints = localStorage.getItem("highscore");
        if(highScorePoints == null || highScorePoints === undefined) {
            localStorage.setItem("highscore", this.scorePoints);
            this.highscore.innerText = String(this.scorePoints).padStart(8, " ");
        }
        else {
            if( this.scorePoints > highScorePoints) {
                localStorage.setItem("highscore", this.scorePoints);
                highScorePoints = localStorage.getItem("highscore");
            }
            this.highscore.innerText = String(highScorePoints).padStart(8, " ");
        }
        console.log("Highscore is " + highScorePoints);        
    }

    startTimer() {
        return setInterval(() => {
            timeRemaining --;
            if(timeRemaining <= 0) {
                this.reset();
                document.getElementById('skip-action').classList.remove('hidden');
            }
            this.timer.innerText = this.formatTime(timeRemaining);
            
       }, 1000);
    }

    reset() {
        clearInterval(this.countDown);
        timeRemaining = 0;
    }

    start() {

        this.matchedCards = [];
        this.currentCard = null;
        this.totalMoves = 0;
        this.matchedCards = [];
        this.setTimer();
        this.busy = true;
        this.timer = document.getElementById('time-remaining');
        this.moves = document.getElementById('moves');
        this.score = document.getElementById('score');
        this.highscore = document.getElementById('highscore');

        let musicEnabled = localStorage.getItem("music");
        if(musicEnabled == 1) {
            this.playMusic("intro-music");
        }

        setTimeout(() => {
            this.busy = false;
            this.playSound("shuffle");
            this.shuffleDeck();
            this.evalCheatButton();
            document.getElementById('board').classList.add('visible');
            document.getElementById('level').classList.remove('hidden');
            document.getElementById('quit').classList.remove('hidden');
            this.startCountDown();
        }, 500);

        setTimeout(() => {
            document.getElementById('settings-bar').classList.remove('colorbar-fade-in-out');
        }, 1500);
        

        this.hideCards();
        this.setHighscore();
        this.timer.innerText = this.formatTime(timeRemaining);
        this.moves.innerText = this.totalMoves;
    }

    delayedStart() {
        setTimeout(() => {
            document.getElementById('wrapper').classList.remove('fadeout');
            document.getElementById('wrapper').classList.remove('black');
            document.getElementById('wrapper').classList.add('fadein');
            document.getElementById('skip-action').classList.add('hidden');
            this.start();
        }, 1000);
    }

    startCountDown() {
        clearInterval(this.countDown);
        this.countDown = this.startTimer();
        currentLevel ++;
        document.getElementById('current-level').innerText = "Round " + currentLevel;
    }

    evalCheatButton() {
        let cheatIsAllowed = (this.matchedCards.length < (this.cards.length-2));
        if( this.scorePoints >= CHEAT_MIN_SCORE && cheatIsAllowed ) {
            document.getElementById('cheat-action').classList.remove('hidden');
            console.log("You have enough points to cheat!");
        }
        else {
            document.getElementById('cheat-action').classList.add('hidden');
            console.log("Not enough points to cheat!")
        }
    }

    cheat() {
        if( this.matchedCards.length < (this.cards.length-2)) {
            while(true) {
                let randomCard = Math.floor( Math.random() * this.cards.length);
                if( this.matchedCards.includes(this.cards[randomCard])) {
                   continue;
                }
                this.cards[randomCard].classList.add('visible');
                this.cards[randomCard].classList.add('inactive');
                document.getElementById('cheat-action').classList.add('inactive');
                setTimeout(() => {
                    this.cards[randomCard].classList.remove('visible');
                    this.cards[randomCard].classList.remove('inactive');
                    document.getElementById('cheat-action').classList.remove('inactive');
                }, 1000);
                
                this.setScore(-100);
                stats("cheated", 1);
                break;
            }
        }
    }
    
    hideCards() {
        this.cards.forEach( c=> {
            c.classList.remove('visible');
            c.classList.remove('matched');
        })
    }

    isMatch(card) {
        if( this.getCard(card) === this.getCard(this.currentCard)) {
            this.matchCards(card, this.currentCard);
        }
        else {
            this.unmatchCards(card, this.currentCard);
        }
        this.currentCard = null;
    }

    cheatCard() {

        if( this.currentCard == null) {
            this.cheat();
            return;
        }

        this.cards.forEach( c=> {
             if( this.getCard(c) === this.getCard(this.currentCard)) {
                 this.turnCard(c);
             }
        });

        this.setScore(-200);
        stats("cheated", 1);
    }

    matchCards(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        card1.classList.add('pair');
        card2.classList.add('pair');
        console.log("The cards match");
        this.playSound("match-card");
        if(this.matchedCards.length == this.cards.length) {

            this.displayMetadata(card1, 0);

            console.log("You have won. Time remaining: " + timeRemaining);
            stats("gamesWon", 1);
            newLowStats("bestGame", this.totalMoves);

            if(timeRemaining > 0) {
                this.setScore(timeRemaining);
            }
            if( timeRemaining == 0 ) {
                this.setScore(100);
            }
            this.reset();
            setCongratulationMessage(numberOfPairs);
            let musicEnabled = localStorage.getItem("music");
            if(musicEnabled == 1) {
                this.stopSound("intro-music");
            }
            this.playSound("win-game");
            document.getElementById("win-game").onended = function() {
                document.getElementById("cht").classList.remove("hidden");
            };

            document.getElementById('status').classList.add('hidden');
        }
        else {
            this.setScore(100);

            this.displayMetadata(card1, 1000);
        }
        
    }

    unmatchCards(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            this.playSound("nomatch-card");
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
        console.log("The cards do not match");
        clearMetadata();
    }

    getCard(card) {
        if(card == null)
            return null;
        let elem = card.getElementsByClassName('card-value');
        if( elem == null || elem.length == 0)
            return null;
        return elem[0].src;
    }

    turnCard(card) {
        if(this.isTurnable(card)) {
            this.totalMoves ++;
            this.moves.innerText = this.totalMoves;
            stats("lifeTimeMoves", 1);
            newHighStats("worstGame", this.totalMoves);
            
            card.classList.add('visible');

            if(this.currentCard) {
                this.isMatch(card);
            }
            else {
                this.currentCard = card;
            }

            this.playSound("flip-card");
        }
    }
 
    shuffleDeck() {
        let container = document.getElementById("board");
        let elementsArray = Array.prototype.slice.call(container.getElementsByClassName('card'));
        elementsArray.forEach(function(element){
          container.removeChild(element);
        })
        let shuffledDeck = this.shuffleArray(elementsArray);
        shuffledDeck.forEach(function(element){
            container.appendChild(element);
        });
    }
      
    shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
              let j = Math.floor(Math.random() * i);
              let temp = array[i];
              array[i] = array[j];
              array[j] = temp;
          }
          return array;
    }

    isTurnable(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.currentCard)
    }

    displayMetadata(card, timeout) {
        clearMetadata();
        if(timeout > 0) {
            setTimeout(() => {
                if(this.matchedCards.includes(card)) {
                    if(this.matchedCards.includes(card)) {
                        createMetadataElement(card.getElementsByTagName("img")[0].getAttribute("src"));
                    }
                }
            }, timeout);
        }
        else {
            createMetadataElement(card.getElementsByTagName("img")[0].getAttribute("src"));
        }
    }

    resetScore() {
        this.scorePoints = 0;
    }
}

function setupActions()
{
    document.getElementById('skip-action').addEventListener( 'click', () => {
        document.getElementById('wrapper').classList.add('fadeout');
        console.log("You choose to skip this game");
        logics.playSound("skip-button");
        logics.delayedStart();
        stats("skippedGames", 1);
    });

    document.getElementById('cheat-action').addEventListener( 'click', () => {
        if( !document.getElementById('cheat-action').classList.contains("inactive")) {
            logics.cheatCard();
        } else {
            console.log("Cheat button is inactive");
        }
    });

    document.getElementById('cheat-action').classList.add('hidden');
    document.getElementById('skip-action').classList.add('hidden');
}

function layout()
{
    clearMetadata();

    console.log("Layout "+ numberOfPairs + " pairs");

    if( numberOfPairs < 9 ) {
        document.getElementById('board').classList.add('goll-container4');
        document.getElementById('board').classList.remove('goll-container8');
        document.getElementById('metadata-container').classList.remove('large-screen');
        document.getElementById('board').classList.remove('visible');
    }
    else {
        document.getElementById('board').classList.add('goll-container8');
        document.getElementById('metadata-container').classList.add('large-screen');
        document.getElementById('board').classList.remove('goll-container4');
        document.getElementById('board').classList.remove('visible');
    }
   
    Array.from( document.getElementsByClassName('card') ).forEach( element => element.remove() );
   
    cd = new CardDefinition(numberOfPairs);

    let newCards = Array.from(document.getElementsByClassName('card'));
    newCards.forEach( c=> {
        c.addEventListener('click', () => {
            
            if( !c.classList.contains("inactive")) {
                console.log("Clicked card "+ c.getElementsByTagName("img")[0].getAttribute("src"));
                logics.turnCard(c);
            }
            if( c.classList.contains("matched")) {
                logics.displayMetadata(c,200);
            }
            
        });
        
        c.addEventListener('dblclick',  () => {
            if( c.classList.contains("matched")) {
                localStorage.setItem("time-remaining", timeRemaining);
                displayIndexCards(c.getElementsByTagName("img")[0].getAttribute("src"));
            }
        });
    });

    setupActions();

    document.getElementById('status').classList.remove('hidden');

    console.log("The new deck counts "+ newCards.length + " cards");
}

function gameClear() {
    currentLevel = 0;
    numberOfPairs = STARTING_PAIRS;
    timeRemaining = 0;
    document.getElementById('level').classList.add('hidden');
    document.getElementById('quit').classList.add('hidden');
    if(logics != null)
        logics.resetScore();
}

function ready() {
 
    loadColor();
    gameClear();

    setState();

    let congratulations = Array.from(document.getElementsByClassName('congratulations'));
    logics = new Logics();

    layout();

    cards = Array.from(document.getElementsByClassName('card'));
    
    logics.setCards(cards);
    logics.delayedStart();

    congratulations.forEach(p => {
        p.addEventListener('click', (e) => {
            document.getElementById('level').classList.add('hidden');
            document.getElementById('quit').classList.add('hidden');
            clearMetadata();

            logics.stopSound("win-game");
            p.classList.remove('visible');
            p.classList.remove('poem');
            if(numberOfPairs < 16)
                numberOfPairs = numberOfPairs * 2;
            
            layout();
            
            cards = Array.from(document.getElementsByClassName('card'));
            logics.setCards(cards);
            logics.delayedStart();
            
            e.stopImmediatePropagation();

        })
    });

    console.log("Game ready");
}

function restoreGame() {
    document.getElementById('lightgallery').innerHTML = "";
    var startTimeAgain = false;
    if(timeRemaining == 0) {
        // timer expired while we were looking at cards in the gallery
        startTimerAgain = true;
    }
    timeRemaining = localStorage.getItem("time-remaining");
    if(timeRemaining == null || timeRemaining === undefined ) {
        timeRemaining = 0;
    }

    if(timeRemaining > 0 && startTimerAgain == true) {
        logics.startTimer();
    }
}
