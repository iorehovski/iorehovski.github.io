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

let isGame = false;

function preload() {
    jsonMap = loadJSON('/js/mapJSON.json');
    images = loadImage('../img/terrainSet.png');
    spritesBlood = loadImage('../img/blood_spot.png');
    gunSpriteSheet = loadImage('../img/gunSpriteSheet.png');

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

    putAWPOnMap(100, 200);
    putAWPAmmoOnMap(100, 100);
    putAk47OnMap(200, 200);
    putAk47AmmoOnMap(200,100);
    putM4A1AmmoOnMap(300,100);
    putM4A1OnMap(300,200);

    itemsGenerator = new Generation(map);
    itemsGenerator = new Generation(map.map);

}

function draw() {
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
        damage: 40,
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
        damage: 100,
        countBullets: 60,
        countBulletsInHolder: 30,
        imagePos: {x: 100, y: 0},
        pos: {x: xStart, y: yStart},
        timeBetweenShots: 1200
    }));
}

function putM4A1AmmoOnMap(xStart,yStart) {
    things.push(new Thing({
        name: 'm16Ammo',
        value: 20,
        pos: {x:xStart, y:yStart},
        imagePos: {x: 400, y: 0},
        size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
}

function putM4A1OnMap(xStart,yStart) {
    things.push(new Weapon({	//pistol
        name: 'm4a1',
        kindBullets: 'm4a1Ammo',
        damage: 80,
        countBullets: 60,
        countBulletsInHolder: 30,
        imagePos: {x: 200, y: 0},
        pos: {x: xStart, y: yStart},
        timeBetweenShots: 160
    }));
}

function putAWPAmmoOnMap(xStart,yStart) {
    things.push(new Thing({
        name: 'awpAmmo',
        value: 20,
        pos: {x:xStart, y:yStart},
        imagePos: {x: 400, y: 0},
        size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
}

function putAWPOnMap(xStart,yStart) {
    things.push(new Weapon({	//pistol
        name: 'awp',
        kindBullets: 'awpAmmo',
        damage: 600,
        countBullets: 15,
        countBulletsInHolder: 1,
        imagePos: {x: 300, y: 0},
        pos: {x: xStart, y: yStart},
        timeBetweenShots: 3000
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