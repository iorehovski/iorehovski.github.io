let map;
let player = {};
let techData;
let enemies;

let jsonMap;
let images;

function preload() {
    jsonMap = loadJSON('/js/mapJSON.json');
    images = loadImage('../img/terrainSet.png');

}

function setup() {
    enemies = [];
    frameRate(60);
    createCanvas(WIN_WIDTH, WIN_HEIGHT);
    player = new Player(ENTITY_DIAMETR / 2, {
        'x': WIN_WIDTH,
        'y': WIN_HEIGHT});
    map = new Map({
        'x': 0,
        'y': 0
    });
    map.imagesSet = images;
    map.createMap(jsonMap);

    background(BGCOLOR);
}

function draw() {
    camera(player.pos.x - WIN_WIDTH_HALF, player.pos.y - WIN_HEIGHT_HALF);

    background(BGCOLOR);

    map.update(player.pos);

    if(randInt(0, 300) == 0) {
        enemies.push(new Enemy(randInt(0, MAP_SIZE_X * TILE_W), randInt(0, MAP_SIZE_Y * TILE_H), ENTITY_DIAMETR / 2));
    }

    checkCollisionEnemies(enemies);

    let eLen = enemies.length;
    for(let i = 0; i < eLen; i++) {
        enemies[i].update(player.pos.x, player.pos.y);
    }

    printTechData({
        'xPlayer': player.pos.x, 
        'yPlayer': player.pos.y,
        'frameRate': frameRate().toFixed(2),
        'enemiesNum': enemies.length
    });

    player.update();
}

function mouseClicked(){
    
    //fire
    if(player.currentSbjInHand){
        player.currentSbjInHand.makeShot(player.pos);
    }
};