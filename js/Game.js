const gameWindow = new GameWindow();
const map = new Map(); 
let player = {};

function preload() {

}

function setup() {
    createCanvas(gameWindow.WIDTH, gameWindow.HEIGHT);
    player = new Player(50, {'x': gameWindow.WIDTH / 2, 'y': gameWindow.HEIGHT / 2});

    background('#686868');
}

function draw() {
    background('#686868');
    fill('#db5151');
    player.update();
}