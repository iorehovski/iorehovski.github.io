let map;
let player = {};
let techData;
let enemies;

let jsonMap;
let images;
let blood;
let spritesBlood; 
let playerSprites = [];
let gunSpriteSheet;

let itemsGenerator;
let itemsSpriteSheet;

let sounds = {};
let soundsQueue = [];

let things = [];    //things as medicine kit, ammo, weapons, etc. on the map

let gameIsPaused = true;
let keyIsPressed = false;

function preload() {
    jsonMap = loadJSON('/js/mapJSON.json');
    images = loadImage('../img/terrainSet.png');
    spritesBlood = loadImage('../img/blood_spot.png');
    gunSpriteSheet = loadImage('../img/gunSpriteSheet.png');
    itemsSpriteSheet = loadImage('../img/itemsSheet.png');

    sounds.glock17 = loadSound('../audio/gun/pistol_shot.wav');
    sounds.glock17Reload = loadSound('../audio/gun/pistol_reload.mp3');
    sounds.ak47 = loadSound('../audio/gun/ak47_shot.mp3');
    sounds.ak47Reload = loadSound('../audio/gun/ak47_reload.mp3');
    sounds.m4a1 = loadSound('../audio/gun/m4a1_shot.mp3');
    sounds.m4a1Reload = loadSound('../audio/gun/m4a1_reload.mp3');
    sounds.awp = loadSound('../audio/gun/awp_shot.mp3');
    sounds.awpReload = loadSound('../audio/gun/awp_reload.mp3');

    sounds.music = {};
    
    //sounds.music.track1 = loadSound('../audio/Resident_Evil_movie_soundtrack_2008.mp3');
    //sounds.music.track2 = loadSound('../audio/Resident_Evil_Corp_Umbrella.mp3');

    playerSprites[0] = loadImage('../img/player/survivor-glock.png');
    playerSprites[1] = loadImage('../img/player/survivor-ak47.png');
    playerSprites[2] = loadImage('../img/player/survivor-m4a1.png');
    playerSprites[3] = loadImage('../img/player/survivor-awp.png');
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

    itemsGenerator = new Generation(map.map);

    itemsGenerator.putAWPOnMap(100, 200);
    itemsGenerator.putAWPAmmoOnMap(100, 100);
    itemsGenerator.putAk47OnMap(200, 200);
    itemsGenerator.putAk47AmmoOnMap(200,100);
    itemsGenerator.putM4A1AmmoOnMap(300,100);
    itemsGenerator.putM4A1OnMap(300,200);
    itemsGenerator.putMedicineKitOnMap(400, 400);
    itemsGenerator.putMedicineKitOnMap(500, 400);
}

function draw() {
    if(gameIsPaused) {
        return;
    }

    camera(player.pos.x - WIN_WIDTH_HALF, player.pos.y - WIN_HEIGHT_HALF);

    background(BGCOLOR);

    map.update(player.pos);

    blood.update();

    if(randInt(0, 500) == 0) {
        enemies.push(new Enemy(randInt(TILE_W, MAP_SIZE_X * TILE_W - TILE_W), randInt(TILE_H, MAP_SIZE_Y * TILE_H - TILE_H), ENTITY_DIAMETR / 2));
    }

    checkCollisionEnemies(enemies);

    //update enemies
    enemies.forEach(function(itemEnemy, index, obj) {
        let damageValue = itemEnemy.update(player.pos.x, player.pos.y, map);
        player.healthBar.value -= damageValue;
        //check player hp value
        if(player.getHealthValue() <= 0) {
        } else {
            player.healthBar.w -= damageValue;
        }

        //check if bullet hit an enemy
        if(player.currentObjInHand instanceof Weapon) {
            let bullets = player.currentObjInHand.bullets.getBullets();
            bullets.forEach(function(itemBullet, indexBullet, objBullets) {
                if(distantionFromAtoB(itemBullet,itemEnemy.pos) < (itemEnemy.r - itemBullet.bulletsLength*2)){
                    objBullets.splice(indexBullet, 1);
                    itemEnemy.hp -= player.currentObjInHand.damage;
                    blood.createBloodSpot(itemEnemy.pos.x, itemEnemy.pos.y);
                }
            });
        }

        if(itemEnemy.hp <= 0){
            obj.splice(index, 1);
        }
    });

    updateSounds();
    itemsGenerator.update();

    printTechData( {
        'xPlayer': player.pos.x, 
        'yPlayer': player.pos.y,
        'frameRate': frameRate().toFixed(0),
        'enemiesNum': enemies.length
    });

    player.update(map);
}

function distantionFromAtoB(a,b) {
    return Math.sqrt(Math.pow(a.x - b.x,2) 
         + Math.pow(a.y - b.y,2)) ; 
}

function updateSounds() {
    soundsQueue.forEach(function(item,index,obj){
        console.log(item)
        if( item && !item.isPlaying()){
            item.play();
            obj.splice(index,1);
        }
    });
}

function setStandartPlayerKit() {
    //set standart inventory of player
    player.putThingInInventory(new Weapon({	//pistol
        name: 'glock17',
        kindBullets: 'glock17Ammo',
        damage: 20,
        countBullets: 72,
        countBulletsInHolder: 10,
        imagePos: {x: 0, y: 0},
        pos: {x: 0, y: 0},
        timeBetweenShots: 1200
    }));
    player.currentObjInHand = player.inventory.getItem(0);
}

function keyPressed() {
    keyIsPressed = true;
}

function keyReleased() {
    keyIsPressed = false;
}