let map;
let player = {};
let techData;
let enemies;

let jsonMap;
let jsonItems;
let jsonWeapon;

let images;
let blood;
let spritesBlood; 
let playerSprites = [];
let gunSpriteSheet;
let zimbieSprites = [];

let itemsGenerator;
let itemsSpriteSheet;

let sounds = {};
let soundsQueue = [];

let things = [];    //things as medicine kit, ammo, weapons, etc. on the map

let gameOver = false;
let gameIsPaused = false;
let keyIsPressed = false;

let scoreFont;
let ammoFont;


let fpsValue;

function preload() {
    jsonMap = loadJSON(MAP_JSON_PATH);
    jsonItems = loadJSON(ITEMS_JSON_PATH);
    jsonWeapon = loadJSON(WEAPON_JSON_PATH);

    scoreFont = loadFont(' ../game/fonts/SquadaOne-Regular.ttf');
    ammoFont = loadFont('../game/fonts/SquadaOne-Regular.ttf');

    images = loadImage('../game/img/terrainSet.png');
    spritesBlood = loadImage('../game/img/blood_spot.png');
    gunSpriteSheet = loadImage('../game/img/gunSpriteSheet.png');
    itemsSpriteSheet = loadImage('../game/img/itemsSheet.png');

    sounds.glock17 = loadSound('../game/audio/gun/pistol_shot.wav');
    sounds.glock17Reload = loadSound('../game/audio/gun/pistol_reload.mp3');
    sounds.ak47 = loadSound('../game/audio/gun/ak47_shot.mp3');
    sounds.ak47Reload = loadSound('../game/audio/gun/ak47_reload.mp3');
    sounds.m4a1 = loadSound('../game/audio/gun/m4a1_shot.mp3');
    sounds.m4a1Reload = loadSound('../game/audio/gun/m4a1_reload.mp3');
    sounds.awp = loadSound('../game/audio/gun/awp_shot.mp3');
    sounds.awpReload = loadSound('../game/audio/gun/awp_reload.mp3');

    sounds.music = {};
    
    //sounds.music.track1 = loadSound('../game/audio/Resident_Evil_movie_soundtrack_2008.mp3');
    //sounds.music.track2 = loadSound('../game/audio/Resident_Evil_Corp_Umbrella.mp3');

    zimbieSprites[0] = [];
    for(let i = 0; i < 16; i++) {
        zimbieSprites[0][i] = loadImage('../game/img/enemy/zombieNormal/skeleton-move_' + i + '.png');
    }

    playerSprites[0] = loadImage('../game/img/player/survivor-glock.png');
    playerSprites[1] = loadImage('../game/img/player/survivor-ak47.png');
    playerSprites[2] = loadImage('../game/img/player/survivor-m4a1.png');
    playerSprites[3] = loadImage('../game/img/player/survivor-awp.png');

}

function setup() {
    enemies = [];
    frameRate(60);
    createCanvas(WIN_WIDTH, WIN_HEIGHT);

    player = new Player(ENTITY_DIAMETR / 2, {'x': 2500, 'y': 1700}, playerSprites);
    map = new Map({
        'x': 0,
        'y': 0
    });

    map.imagesSet = images;
    map.createMap(jsonMap);

    itemsGenerator = new Generation(map.map, jsonItems, jsonWeapon, player, enemies, zimbieSprites[0]);
    setInterval(function() {
        itemsGenerator.findEnemiesOnScreen(enemies, player.pos);
    }.bind(this), 2000);

    blood = new Blood();

    background(BGCOLOR);

    sounds.glock17.setVolume(0.3);
    sounds.glock17Reload.setVolume(0.3);
    sounds.ak47.setVolume(0.3);
    sounds.ak47Reload.setVolume(0.3);
    sounds.m4a1.setVolume(0.3);
    sounds.m4a1Reload.setVolume(0.3);
    sounds.awp.setVolume(0.3);
    sounds.awpReload.setVolume(0.3);

    setStandartPlayerKit();

    //set fps update time
    setInterval(function() {
        fpsValue = frameRate().toFixed(0);
    }.bind(this), 500);

    itemsGenerator.addWeapon(200, 200, 1);
    itemsGenerator.addWeapon(300, 200, 2);
    itemsGenerator.addWeapon(400, 200, 3);
    itemsGenerator.addThing(500, 200, 0);
    itemsGenerator.addThing(600, 200, 1);
    
}

function draw() {
    if(gameOver) {
        gameIsPaused = true;
        $('.gameOverMenu').show();
        // $('.gameScore').text('score:' + player.score.value);
    }
    if(gameIsPaused) {
        return;
    }

    

    camera(player.pos.x - WIN_WIDTH_HALF, player.pos.y - WIN_HEIGHT_HALF);

    background(BGCOLOR);

    map.update(player.pos);

    blood.update();

    itemsGenerator.generateItem();
    itemsGenerator.updateItems();

    itemsGenerator.generateEnemy();
    itemsGenerator.updateEnemies(map.map, player);

    printTechData( {
        'xPlayer': player.pos.x, 
        'yPlayer': player.pos.y,
        'frameRate': fpsValue,
        'enemiesNum': enemies.length
    });

    player.update(map);
}

function setStandartPlayerKit() {
    //set standart inventory of player
    //glock17
    const item = JSON.parse(JSON.stringify(jsonWeapon.contents[0]));
    item.pos.x = 0;
    item.pos.y = 0;
    player.putThingInInventory(new Weapon(item));
    player.currentWeaponInHand = player.inventory.getItem(0);

    itemsGenerator.generatedWeaponNames.push(item.name);
}

function keyPressed() {
    keyIsPressed = true;
}

function keyReleased() {
    keyIsPressed = false;
}