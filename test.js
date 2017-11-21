var gameInterval;
var gameCanvas;
var eventCatcherDiv;

function startLoading(){
    eventCatcherDiv = document.getElementById("EventCatcher");
    // eventCatcherDiv events go here

    gameCanvas = document.getElementById("GraphicsBox");

    gameInterval = setInterval(hasLoaded, 250);
}

function hasLoaded(){}
    if (true) // Check to see if all info is loaded{
        clearInterval(gameInterval);
        startGame();
    }
}

function startGame(){
    gameInterval = setInterval(runGame, 25);
}

function runGame(){

}