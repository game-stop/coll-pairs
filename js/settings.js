let colorMaps = [
    "black",
    "white",
    "yellow",
    "orange",
    "rosa",
    "red",
    "purple",
    "blue",
    "green",
    "brown"
];

function createStylesheet(name) {
    var head = document.head;
    var link = document.createElement("link");
    link.type = "text/css";
    link.href = "styles/goll-"+ name + ".css";
    link.rel = "stylesheet";
    link.id = "colorcss";

    head.appendChild(link);
}

function changeColor(index) {
    var video = document.getElementById('introvideo');
    var source = document.getElementById('source');

    document.getElementById("colorcss").remove();
    createStylesheet(colorMaps[index]);

    var logo = document.getElementById('fallback');

    if(typeof video !== undefined) {
        if(source != null) {
            if( video.canPlayType("video/webm; codecs=vp9") === "probably" ){
                source.setAttribute("src", "assets/goll-"+ colorMaps[index] + ".webm");
                source.setAttribute("type", "video/webm");
                console.log("Probably can play webm/vp9");
            }
            else if( video.canPlayType("video/mp4; codecs=h264") === "probably") {
                source.setAttribute("src", "assets/goll-"+ colorMaps[index] + ".mp4");
                source.setAttribute("type", "video/mp4");
                console.log("Probably can play mp4/h264");
            }
            else {
                console.log("Browser does not play mp4 or webm video files");
                let fbimg = document.getElementById("fallback");
                fbimg.classList.remove("hidden");
                fbimg.classList.add("fallback");
                if( index == 1 || index == 2 || index == 8 ) {
                   fbimg.setAttribute("src", "assets/gollpairs-b.png");
                }
                else {
                    fbimg.setAttribute("src", "assets/gollpairs-w.png");
                }
            }
        }
        
       /* let vid = document.getElementById("introvideo");
        vid.load();
        vid.play(); */
    }

    if( index == 1 || index == 2 || index == 5 ) {
        logo.setAttribute( "src", "assets/logo-black.png");
    }
    else {
        logo.setAttribute( "src", "assets/logo-white.png");
    }
    console.log("Selected theme " + colorMaps[index]);

    localStorage.setItem("color-selection", index);
}

function loadColor() {
    var selectedcolor = localStorage.getItem("color-selection");
    if(selectedcolor == null ) {
        selectedcolor = 0;
    }
    
    if(selectedcolor !== undefined) {
        console.log("Save user selected theme " + selectedcolor);
        changeColor(selectedcolor);
    }
}

function initDefaults() {
    // always init game with sound on and music off
    localStorage.setItem("music", 0);
    localStorage.setItem("sound", 1);
    localStorage.setItem("time-remaining",0);
}

function setState() {
    let musicEnabled = localStorage.getItem("music");
    if(musicEnabled == 1) {
        setMusicStateOn(["music1", "music2"]);
    }
    else {
        setMusicStateOff(["music1", "music2"]);
    }

    let soundEnabled = localStorage.getItem("sound");
    if(soundEnabled == 1 ) {
        setSoundStateOn(["sound1", "sound2"]);
    }
    else {
        setSoundStateOff(["sound1", "sound2"]);
    }

    console.log("Music is " + (musicEnabled == 0 ? "disabled" : "enabled"));
    console.log("Sound is " + (soundEnabled == 0 ? "disabled" : "enabled"));
}

function setMusicStateOn(buttons)
{
    for( let i = 0; i < buttons.length; i ++ ) {
        let elem = document.getElementById(buttons[i]);
        elem.classList.remove("music-off");
        elem.classList.add("music-on");
    }
}

function setMusicStateOff(buttons)
{
    for( let i = 0; i < buttons.length; i ++ ) {
        let elem = document.getElementById(buttons[i]);
        elem.classList.remove("music-on");
        elem.classList.add("music-off");
    }
}

function setSoundStateOn(buttons) 
{
    for( let i = 0; i < buttons.length; i ++ ) {
        let elem = document.getElementById(buttons[i]);
        elem.classList.remove("sound-off");
        elem.classList.add("sound-on");
    }
}

function setSoundStateOff(buttons) 
{
    for( let i = 0; i < buttons.length; i ++ ) {
        let elem = document.getElementById(buttons[i]);
        elem.classList.remove("sound-on");
        elem.classList.add("sound-off");
    }
}

function toggleMusic() {
    let musicEnabled = localStorage.getItem("music");
    let music = document.getElementById("intro-music");
    
    if(musicEnabled == 0 ) {
        musicEnabled = 1;
        setMusicStateOn(["music1", "music2"]);
        if(music != null)
            music.play();
    }
    else {
        musicEnabled = 0;
        setMusicStateOff(["music1", "music2"]);
        if(music != null)
            music.pause();
    }
    localStorage.setItem("music", musicEnabled);
}

function toggleSound() {
    let soundEnabled = localStorage.getItem("sound");
    
    if(soundEnabled == 0 ) {
        soundEnabled = 1;
        setSoundStateOn(["sound1","sound2"]);
    }
    else {
        soundEnabled = 0;
        setSoundStateOff(["sound1", "sound2"]);
    }
    localStorage.setItem("sound", soundEnabled);
}

function displayHighscore() {
    let elem = document.getElementById("highscore");
    if(elem != null) {
        let highscore = localStorage.getItem("highscore");
        if( highscore != null ) {
            elem.innerText = "Highscore: " + highscore;
        }
    }
}

function hide(containers) {
    for( let i = 0; i < containers.length; i ++ ) {
        document.getElementById(containers[i]).classList.add("hidden");
        document.getElementById(containers[i]).classList.remove("visible");
    }
}

function show(containerName) {
    document.getElementById(containerName).classList.remove("hidden");
    document.getElementById(containerName).classList.add("visible");
}

function onAboutClicked() {
    hide( ["main", "gollstory", "game"]);
    show("about");
}

function onStoryClicked() {
    hide( ["main", "about", "game"]);
    show("gollstory");
}

function onGameClicked() {
    hide( ["main", "about", "gollstory"]);
    openFullscreen();
    ready();
    show("game");
}

function onMainClicked() {
    closeFullscreen();
    hide( ["game", "about", "gollstory"]);
    show("main");

  /*  let vid = document.getElementById("introvideo");
    vid.currentTime = 0;
    vid.play(); */

    getStats();
}

function stats(name, val) {
    let x = localStorage.getItem(name);
    if( x == null || x === undefined) {
        x = val;
    }
    else {
        x = Number(x) + Number(val);
    }
    localStorage.setItem(name, x);
}

function newHighStats(name,val)
{
    let x = localStorage.getItem(name);
    let value = Number(val);
    if( x == null || x === undefined) {
        x = value;
    }
    else {
        if( value > x ) {
            x = value;
        }
    }
    localStorage.setItem(name, x);
}

function newLowStats(name,val)
{
    let x = localStorage.getItem(name);
    let value = Number(val);
    if( x == null || x === undefined) {
        x = value;
    }
    else {
        if( value < x ) {
            x = value;
        }
    }
    localStorage.setItem(name, x);
}

function getStatLine(names, oneLiner, ending)
{
    let x = 0;
    for(let i = 0; i < names.length; i ++ ) {
        let x1 = localStorage.getItem(names[i]);
        if( x1 != null && x1 !== undefined) {
            x = Number(x) + Number(x1);
        }
    }

    if( x == 0 )
      return "";

    let text = oneLiner;
    if(ending != null) {
        text += " " + x + ending;
    }
    else {
        text += ": " + x;
    }
    text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    
    return text;
}

function getStats()
{
    let text = "";

    text += getStatLine( ["gamesWon", "skipped" ],  "Total games played ",null);
    text += getStatLine( ["gamesWon"], "Total games won ",null);
    text += getStatLine( ["skippedGames"], "Total times forfeited ",null);
    text += getStatLine( ["cheated"], "Total times cheated ",null);
    text += getStatLine( ["lifeTimeMoves"], "Total moves played ",null);
    text += getStatLine( ["worstGame"], "Your toughest game took ", " moves");
    text += getStatLine( ["bestGame"], "Your best game took only ", " moves");
    text += getStatLine( ["highscore"], "Your best score is ",null);

    text += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
       
    let elem = document.getElementById("stats");
    while(elem.firstChild) {
        elem.removeChild(elem.lastChild);
    }

    elem.innerHTML = text;

}

/* View in fullscreen */
function openFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {

    if((window.fullScreen) ||
        (window.innerWidth == screen.width && window.innerHeight == screen.height)) {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}