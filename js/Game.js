let map;
let player = {};
let techData;

function preload() {

}

function setup() {
    createCanvas(WIN_WIDTH, WIN_HEIGHT);
    player = new Player(50, {
        'x': WIN_WIDTH,
        'y': WIN_HEIGHT});
    map = new Map({
        'x': 0,
        'y': 0
    });
    map.createMap();

    background(BGCOLOR);
}

function draw() {
    camera(player.pos.x - WIN_WIDTH_HALF, player.pos.y - WIN_HEIGHT_HALF);

    background(BGCOLOR);

    map.update();

    printTechData({
        'xPlayer': player.pos.x, 
        'yPlayer': player.pos.y 
    });
    player.update();
}