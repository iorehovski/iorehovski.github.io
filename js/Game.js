let gameWindow = new GameWindow();
let map = new Map(); 
let player = {};
let techData;

let 

function preload() {

}

function setup() {
    createCanvas(gameWindow.WIDTH, gameWindow.HEIGHT);
    player = new Player(50, {'x': gameWindow.WIDTH, 'y': gameWindow.HEIGHT});

    background(BGCOLOR);
}

function draw() {
    background(BGCOLOR);

    
    /*
    printTechData({
        'xPlayer': player.pos.x, 
        'yPlayer': player.pos.y 
    });
    */
    player.update();
}