let gollCongratulationMessages = [
    "Congratulations! you won!",
    "Congratulations! you won!",
];

let gollCongratulationPoems = [
[   "Congratulations! you won!"
]];

function getCongratulationMessage() {
    let index = Math.floor(Math.random() * gollCongratulationMessages.length);
    return gollCongratulationMessages[index];
}

function getCongratulationPoemMessage() {
    let index = Math.floor(Math.random() * gollCongratulationPoems.length);
    return gollCongratulationPoems[index];
}

function getCongratulationPoem() {
    let str = "";
    let poem = getCongratulationPoemMessage();
    for( let i = 0; i < poem.length; i ++ ) {
        str = str.concat(poem[i]).concat("<br/>");
    }
    return str;
}

function getCongratulationHelpMessage() {
    return "<p id=\"cht\" class=\"congratulations-help hidden\">Click to continue</p>";
}

function setCongratulationMessage(numberOfPairs) {
    let youWon = document.getElementById("you-won");
    let index = Math.floor(Math.random() * 10);

    if( numberOfPairs <= 8 || index != 5) {
        youWon.innerHTML = getCongratulationMessage();
        youWon.innerHTML += getCongratulationHelpMessage();
        youWon.classList.add('visible');
    }
    else {
        youWon.innerHTML = getCongratulationPoem();
        youWon.innerHTML += getCongratulationHelpMessage();
        youWon.classList.add('poem');
    }
}
