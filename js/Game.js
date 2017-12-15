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

let sounds = {};
let soundsQueue = [];

let things = [];    //things as medicine kit, ammo, weapons, etc. on the map

let gameIsPaused = true;

function preload() {
    jsonMap = loadJSON('/js/mapJSON.json');
    images = loadImage('../img/terrainSet.png');
    spritesBlood = loadImage('../img/blood_spot.png');
    gunSpriteSheet = loadImage('../img/gunSpriteSheet.png');

    sounds.pistol = loadSound('../audio/gun_40_smith_wesson.wav');
    sounds.pistolReload = loadSound('../audio/gun_reload.mp3');
    sounds.music = {};
    
    //sounds.music.track1 = loadSound('../audio/Resident_Evil_movie_soundtrack_2008.mp3');
    //sounds.music.track2 = loadSound('../audio/Resident_Evil_Corp_Umbrella.mp3');

    playerSprites[0] = loadImage('../img/player/survivor-glock.png');
    playerSprites[1] = loadImage('../img/player/survivor-ak47.png');
    playerSprites[2] = loadImage('../img/player/survivor-m16.png');
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

    sounds.pistol.setVolume(0.3);
    sounds.pistolReload.setVolume(0.3);

    setStandartPlayerKit();

    putAWPOnMap(100, 200);
    putAWPAmmoOnMap(100, 100);
    putAk47OnMap(200, 200);
    putAk47AmmoOnMap(200,100);
    putM16AmmoOnMap(300,100);
    putM16OnMap(300,200);

    itemsGenerator = new Generation(map);
    itemsGenerator = new Generation(map.map);

    console.log(things);
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
    updateThings();

    printTechData( {
        'xPlayer': player.pos.x, 
        'yPlayer': player.pos.y,
        'frameRate': frameRate().toFixed(0),
        'enemiesNum': enemies.length
    });

    player.update(map);
}

function mouseClicked() {
    
    //fire
    if(player.currentObjInHand instanceof Weapon) {
        player.currentObjInHand.makeShot(player);
    }
};

function updateSounds() {
    soundsQueue.forEach(function(item,index,obj){
        console.log(item)
        if( item && !item.isPlaying()){
            item.play();
            obj.splice(index,1);
        }
    });
}

function updateThings() {
    things.forEach(function(item,index,obj){
        item.update();
        if(distantionFromAtoB({x: player.pos.x + INVENTORY_THING_SIZE / 2, y:player.pos.y + INVENTORY_THING_SIZE / 2},item.pos) < INVENTORY_THING_SIZE * 2){
            //put thing in inventory and remove it from map
            if(player.putThingInInventory(item)){
                obj.splice(index,1);
            }
        }
    });
}

function distantionFromAtoB(a,b) {
    return Math.sqrt(Math.pow(a.x - b.x,2) 
         + Math.pow(a.y - b.y,2)) ; 
}

function putMedicineKitOnMap(xStart,yStart) {
    things.push(new Thing({
        name: 'medicineKit',
        value: 50,
        pos: {x:xStart, y:yStart},
        imagePos: {x: 500, y: 0},
        size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
}

function putPistolAmmoOnMap(xStart,yStart) {
    things.push(new Thing({
        name: 'glock17Ammo',
        value: 20,
        pos: {x:xStart, y:yStart},
        imagePos: {x: 400, y: 0},
        size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
}

function putPistolOnMap(xStart,yStart) {
    things.push(new Weapon({	//pistol
        name: 'glock17',
        kindBullets: 'glock17Ammo',
        damage: 20,
        countBullets: 72,
        countBulletsInHolder: 10,
        imagePos: {x: 0, y: 0},
        pos: {x: xStart, y: yStart},
        timeBetweenShots: 1200
    }));
}

function putAk47AmmoOnMap(xStart,yStart) {
    things.push(new Thing({
        name: 'ak47Ammo',
        value: 20,
        pos: {x:xStart, y:yStart},
        imagePos: {x: 400, y: 0},
        size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
}

function putAk47OnMap(xStart,yStart) {
    things.push(new Weapon({	//pistol
        name: 'ak47',
        kindBullets: 'ak47Ammo',
        damage: 20,
        countBullets: 72,
        countBulletsInHolder: 10,
        imagePos: {x: 100, y: 0},
        pos: {x: xStart, y: yStart},
        timeBetweenShots: 1200
    }));
}

function putM16AmmoOnMap(xStart,yStart) {
    things.push(new Thing({
        name: 'm16Ammo',
        value: 20,
        pos: {x:xStart, y:yStart},
        imagePos: {x: 400, y: 0},
        size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
}

function putM16OnMap(xStart,yStart) {
    things.push(new Weapon({	//pistol
        name: 'm16',
        kindBullets: 'm16Ammo',
        damage: 30,
        countBullets: 90,
        countBulletsInHolder: 30,
        imagePos: {x: 200, y: 0},
        pos: {x: xStart, y: yStart},
        timeBetweenShots: 1200
    }));
}

function putAWPAmmoOnMap(xStart,yStart) {
    things.push(new Thing({
        name: 'AWPAmmo',
        value: 20,
        pos: {x:xStart, y:yStart},
        imagePos: {x: 400, y: 0},
        size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
}

function putAWPOnMap(xStart,yStart) {
    things.push(new Weapon({	//pistol
        name: 'AWP',
        kindBullets: 'AWPAmmo',
        damage: 150,
        countBullets: 30,
        countBulletsInHolder: 10,
        imagePos: {x: 300, y: 0},
        pos: {x: xStart, y: yStart},
        timeBetweenShots: 1200
    }));
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

    player.putThingInInventory(new Weapon({	//pistol
        name: 'ak47',
        kindBullets: 'ak47Ammo',
        damage: 100,
        countBullets: 130,
        countBulletsInHolder: 30,
        imagePos: {x: 100, y: 0},
        pos: {x: 0, y: 0},
        timeBetweenShots: 100
    }));

    player.currentObjInHand = player.inventory.getItems()[0];
    //add medicine kit to inventory
    player.putThingInInventory(new Thing({
        name: 'medicineKit',
        value: 50,
        pos: {x:0, y:0},
        imagePos: {x: 500, y: 0},
        size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
}