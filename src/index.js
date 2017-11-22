import PIXI from 'pixi.js'
var gameInterval;
var gameCanvas;
var eventCatcherDiv;

function initialize(){
  //Create the renderer and stage
  var renderer = PIXI.autoDetectRenderer(601, 401);
  var stage = new PIXI.Container();

  //Add the elements to the html
  document.getElementById('BackgroundBox').appendChild(renderer.view);
  renderer.render(stage);

  startLoading()
}

function startLoading(){
  eventCatcherDiv = document.getElementById("EventCatcher");

  // eventCatcherDiv events go here
  eventCatcherDiv.addEventListener("mousemove", canvasMove);

  //gameCanvas = document.getElementById("GraphicsBox");
  //gameInterval = setInterval(hasLoaded, 250);
}

function hasLoaded(){
  if(true){
    clearInterval(gameInterval);
    startGame();
  }
}

var heroX = 10;
var heroY = 10;
function drawTheHero(g){
  g.fillStyle = "#0000FF";
  g.fillRect(heroX, heroY, 20, 20);
}

function startGame(){
  drawTheHero(gameCanvas.getContext("2d"));
  gameInterval = setInterval(runGame, 25);
}

function canvasMove(E){
  E = E || window.event;
  heroX = E.pageX;
  heroY = E.pageY;
}

function runGame(){
  gameCanvas.getContext("2d").clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  drawTheHero(gameCanvas.getContext("2d"));
}
