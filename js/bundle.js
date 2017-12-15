class Bar {
    constructor() {
        this.value = 150;
        this.cornerRad = 20;
        this.w = 150;
        this.h = 10;
        this.col = null;
        this.strokeCol = null;
    }

    update(barsX, barsY) {
        fill(this.col);
        stroke(this.strokeCol);
        rect(barsX, barsY, this.w, this.h, this.cornerRad);
    }
}

class HealthBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#820a0a';
    }
    
}

class HungerBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#18a329';
    }
}

class EnduranceBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#8ca3aa';
    }
}

class ColdBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#0f79af';
    }
}

class BloodItem {
    constructor(posX, posY, ) {
        this.x = posX;
        this.y = posY;
        this.lifeTime = 500;
        this.angle = Math.PI/Math.random() * 3;
    }

    update() {
        push();
        imageMode(CENTER);
       
        translate(this.x, this.y);
        rotate(this.angle);
        image(spritesBlood, 0, 0);
        pop();

        this.lifeTime--;
    }
} 

class Blood {
    constructor() {
        this.bloodList = [];
        this.lifeTimeTimer = 500;
    }

    createBloodSpot(posX, posY) {
        this.bloodList.push(new BloodItem(posX, posY));
    }

    update() {
        for(let i = 0, len = this.bloodList.length; i < len; i++) {
            this.bloodList[i].update();
            if(this.bloodList[i].lifeTime <= 0) {
                this.bloodList.splice(i, 1);
                len--;
            }
        }
    }
}

class Bullet {
    constructor() {
        this.bulletsList = [];
    }

    init(bullet) {
        bullet.vx = bullet.v * Math.cos(bullet.angle);
        bullet.vy = bullet.v * Math.sin(bullet.angle);
        bullet.xInit = bullet.x;
        bullet.yInit = bullet.y;
    }
     
    pushBullet(bullet) {
        this.init(bullet);
        this.bulletsList.push(bullet);
    }

    update(dt, map) {
        this.bulletsList.forEach(function(item, index, obj) {

            const objTile = determineObjectTilePos({x: item.x, y: item.y}, map);

            //check if bullet flies upon wall sprite
            //bullet coll. with a wall
            if(map[objTile.objTileY]){  
                if(map[objTile.objTileY][objTile.objTileX]) {
                    if(map[objTile.objTileY][objTile.objTileX].spriteID == 9) {
                        obj.splice(index, 1);
                        map[objTile.objTileY][objTile.objTileX].healthValue -= player.currentObjInHand.damage;
                    } else {
                        item.x += item.vx * dt;
                        item.y += item.vy * dt;
            
                        item.lifeTime -= 1;
            
                        if(item.lifeTime <= 0) {
                            obj.splice(index, 1);
                        }
                    }
                }
            }
             else {
                obj.splice(index, 1);
            }
        });
    }
    
    render() {
        this.bulletsList.forEach(function(item, index, obj) {
            push();
            
            fill(item.bulletsColor);            
            rectMode(CENTER);
            translate(item.x, item.y);
            rotate(item.angle);
            rect(0, 0, item.bulletsLength,3);

            pop();
        });
    }
    getBullets() {
        return this.bulletsList;
    }
}

function handleCollisionWalls(objPos, map) {

    const objTile = determineObjectTilePos(objPos, map);
    
    return handleCollision(
        objPos, 
        map, 
        objTile.objTileX, 
        objTile.objTileY, 
        objTile.lW, 
        objTile.rW, 
        objTile.uH, 
        objTile.dH
    );
}

function handleCollision(objPos, map, objTileX, objTileY, lW, rW, uH, dH) {
    //check and handle wall collisions 
    //up
    let collidingTile = {
        isCollide : false,
    };
    if(map[uH][objTileX].spriteID == 9) {
        if(objPos.y <= map[uH][objTileX].pos.y + TILE_H + 10) {
            objPos.y = map[uH][objTileX].pos.y + TILE_H + 10;
            collidingTile.isCollide = true;
            collidingTile.tileX = objTileX;
            collidingTile.tileY = uH;
        }
    }
    //right
    if(map[objTileY][rW].spriteID == 9) {
        if(objPos.x >= map[objTileY][rW].pos.x - 10) {
            objPos.x = map[objTileY][rW].pos.x - 10;
            collidingTile.isCollide = true;
            collidingTile.tileX = rW;
            collidingTile.tileY = objTileY;
        }
    }
    //down
    if(map[dH][objTileX].spriteID == 9) {
        if(objPos.y >= map[dH][objTileX].pos.y - 10) {
            objPos.y = map[dH][objTileX].pos.y - 10;
            collidingTile.isCollide = true;
            collidingTile.tileX = objTileX;
            collidingTile.tileY = dH;
        }
    }
    //left
    if(map[objTileY][lW].spriteID == 9) {
        if(objPos.x <= map[objTileY][lW].pos.x + TILE_W + 10) {
            objPos.x = map[objTileY][lW].pos.x + TILE_W + 10;
            collidingTile.isCollide = true;
            collidingTile.tileX = lW;
            collidingTile.tileY = objTileY;
        }
    }

    return collidingTile;
}

function determineObjectTilePos(objPos, map) {

    let obj = {};

    let objTileX = (objPos.x / TILE_W) | 0;
    let objTileY = (objPos.y / TILE_H) | 0;

    let lW = objTileX - 1;
    let rW = objTileX + 1;
    let uH = objTileY - 1;
    let dH = objTileY + 1;

    if(objTileX < map[0].length / 2){
        if(lW < 0){
            lW = 0;
        }
    } else {
        if(rW > map[0].length){
            rW = map[0].length;
        }
    }

    if(objTileY < map.length / 2){
        if(uH < 0){
            uH = 0;
        }
    } else {
        if(dH > map.length){
            dH = map.length;
        }
    }

    obj.objTileX = objTileX;
    obj.objTileY = objTileY;

    obj.lW = lW;
    obj.rW = rW;
    obj.uH = uH;
    obj.dH = dH;

    return obj;
}

const WIN_WIDTH = window.outerWidth;
const WIN_HEIGHT = window.outerHeight;
const WIN_WIDTH_HALF = window.outerWidth / 2;
const WIN_HEIGHT_HALF = window.outerHeight / 2;

const TEXTSIZE_TECHDATA = 14;
const ENTITY_DIAMETR = 100;

//map
const MAP_SIZE_X = 80;
const MAP_SIZE_Y = 80;

const TILE_W = 100; 
const TILE_H = 100;

const REND_MAP_LEFT = ((WIN_WIDTH_HALF / TILE_W) | 0) + 1;
const REND_MAP_RIGHT = ((WIN_WIDTH_HALF / TILE_W) | 0) + 2;
const REND_MAP_UP = ((WIN_HEIGHT_HALF / TILE_H) | 0) + 1;
const REND_MAP_DOWN = ((WIN_HEIGHT_HALF / TILE_H) | 0) + 2;

//colors
const PLAYER_COLOR = '#8db0e8';
const ENEMY_COLOR = '#f73b3b';
const BGCOLOR = '#686868';
const GRASS_COLOR = '#2e8c27';
const HP_BAR_COLOR = '#c01111';
const HUNGER_BAR_COLOR = '#1fc633';
const COLD_BAR_COLOR = '#1295d8';
const ENDURANCE_BAR_COLOR = '#b3ced6';
const BULLET_COLOR = '#fffb2d';

//things
const MEDICINE_KIT_WIDTH = 60;
const MEDICINE_KIT_HEIGHT = 60;
const AMMO_WIDTH = 60;
const AMMO_HEIGHT = 60;

const ITEMS_SPRITE = '../img/itemsSheet.png'; 
const GUN_SPRITE_SHEET = '../img/gunSpriteSheet.png';
const INVENTORY_THING_SIZE = 100;

const ITEM_SIZE = 60;

class Enemy {
    constructor(x, y, r) {
        this.r = r;
        this.pos = createVector(x, y);
        this.moveSpeed = 2;
        this.color = color(255);

        this.hp = 100;
        this.damage = 0.5;
        this.damageToWall = 2;
    }

    update(playerX, playerY, map) {
        if(this.isIntersects(playerX, playerY)) {
            this.damage = 0.5;
        } else {
            this.damage = 0;
        }

        fill(this.color);
        let dx = playerX - this.pos.x;
        let dy = playerY - this.pos.y;

        let moveX = 0;
        let moveY = 0;

        if(dx > 0) {
            this.pos.x += 1;
            moveX += 1;
        } else if(dx < 0) {
            this.pos.x -= 1;
        }

        if(dy > 0) {
            this.pos.y += 1;
        } else if(dy < 0) {
            this.pos.y -= 1;
        }
        ellipse(this.pos.x, this.pos.y, this.r, this.r);

        let collTile = handleCollisionWalls(this.pos, map.map);
        if(collTile.isCollide) {
            map.map[collTile.tileY][collTile.tileX].healthValue -= this.damageToWall;
        }

        return this.damage;
        
    }

    changeColor() {
        this.color = color(random(255), random(255), random(255));
    }

    isIntersects(playerX, playerY) {
        let d = dist(this.pos.x, this.pos.y, playerX, playerY);
        if(d < 50) {
            return true;
        }
        return false;
    }
}
$(document).ready(function(){
    $('.pauseMenu').hide();
    $('.pauseIndicator').hide();
    $('.startMenu').show();
});

$('.startBtn').click(function(){
    $('.startMenu').hide();
    gameIsPaused = false;
});

$('.resumeBtn').click(function(){
    $('.pauseMenu').toggle();
    $('.pauseIndicator').toggle();
    gameIsPaused = false;
});

$(this).keydown(function(e){
    // alert(e.keyCode);
    if(e.keyCode == 27) {
        gameIsPaused = gameIsPaused ? false : true;
        $('.pauseMenu').toggle();
        $('.pauseIndicator').toggle();
    }
});

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
    player.putThingInInventory(new Weapon({ //pistol
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

function printTechData(objData) {
    fill(255);
    textSize(TEXTSIZE_TECHDATA);
    text('x: ' + objData.xPlayer + ' y: ' + objData.yPlayer, objData.xPlayer - 100, objData.yPlayer - 60);
    text('FPS: ' + objData.frameRate, objData.xPlayer - WIN_WIDTH_HALF + 5, objData.yPlayer - WIN_HEIGHT_HALF + 15);
    text('enemies: ' + objData.enemiesNum, objData.xPlayer - WIN_WIDTH_HALF + 5, objData.yPlayer - WIN_HEIGHT_HALF + 30)
    //text('tiles rendering: ');
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkCollisionEnemies(enemies) {
    let eLen = enemies.length;
    if(enemies.length > 1) {
        for(let i = 0; i < eLen; i++) {
            for(let j = i + 1; j < eLen; j++) {
                let d = dist(
                    enemies[i].pos.x,
                    enemies[i].pos.y,
                    enemies[j].pos.x,
                    enemies[j].pos.y,
                );

                if(d < 50) {
                    //enemies[i].changeColor();
                    //enemies[j].changeColor();

                    if(enemies[i].pos.x < enemies[j].pos.x) {
                        enemies[i].pos.x -= 1;
                        enemies[j].pos.x += 1;
                        enemies[i].pos.y += randInt(-1, 1);
                        enemies[j].pos.y += randInt(-1, 1);
                    } else {
                        enemies[i].pos.x += 1;
                        enemies[j].pos.x -= 1;
                        enemies[i].pos.y += randInt(-1, 1);
                        enemies[j].pos.y += randInt(-1, 1);
                    } 

                    if(enemies[i].pos.y < enemies[j].pos.y) {
                        enemies[i].pos.y += 1;
                        enemies[j].pos.y -= 1;
                        enemies[i].pos.x += randInt(-1, 1);
                        enemies[j].pos.x += randInt(-1, 1);
                    } else {
                        enemies[i].pos.y -= 1;
                        enemies[j].pos.y += 1;
                        enemies[i].pos.x += randInt(-1, 1);
                        enemies[j].pos.x += randInt(-1, 1);
                    }
                }
            }
        }
    }
}

class Generation {
    constructor(map) {
        this.map = map;
        this.items = [];
    }

    generateEnemy(chance) {

    }

    //generate ammo, weapons, aid in map
    generateItems(chance) {
        
    }

    update() {
        for(let i = 0, len = this.items.length; i < len; i++) {
            this.items[i].update();
            if(distantionFromAtoB({x: player.pos.x + INVENTORY_THING_SIZE / 2, y:player.pos.y + INVENTORY_THING_SIZE / 2},this.items[i].pos) < INVENTORY_THING_SIZE * 2){
                //put thing in inventory and remove it from map
                if(player.putThingInInventory(this.items[i])){
                    this.items.splice(i, 1);
                }
                len--;
            }
        }
    }
    
    distantionFromAtoB(a,b) {
        return Math.sqrt(((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y))); 
    }

    putMedicineKitOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'medicineKit',
            value: 50,
            pos: {x: xStart, y: yStart},
            imagePos: {x: 240, y: 0},
            size: {width: 60, height: 60},
        }));
    }
    
    putPistolAmmoOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'glock17Ammo',
            value: 20,
            pos: {x:xStart, y:yStart},
            imagePos: {x: 0, y: 0},
            size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT},
            imgPath: ITEMS_SPRITE,
        }));
    }
    
    putAk47AmmoOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'ak47Ammo',
            value: 30,
            pos: {x:xStart, y:yStart},
            imagePos: {x: 120, y: 0},
            size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT},
        }));
    }
    
    putM4A1AmmoOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'm4a1Ammo',
            value: 20,
            pos: {x:xStart, y:yStart},
            imagePos: {x: 60, y: 0},
            size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT},
        }));
    }
    
    putAWPAmmoOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'awpAmmo',
            value: 5,
            pos: {x:xStart, y:yStart},
            imagePos: {x: 180, y: 0},
            size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT},
        }));
    }
    
    putPistolOnMap(xStart, yStart) {
        this.items.push(new Weapon({    //pistol
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
    
    putAk47OnMap(xStart, yStart) {
        this.items.push(new Weapon({    //pistol
            name: 'ak47',
            kindBullets: 'ak47Ammo',
            damage: 100,
            countBullets: 60,
            countBulletsInHolder: 30,
            imagePos: {x: 100, y: 0},
            pos: {x: xStart, y: yStart},
            timeBetweenShots: 140
        }));
    }
    
    putM4A1OnMap(xStart, yStart) {
        this.items.push(new Weapon({    //pistol
            name: 'm4a1',
            kindBullets: 'm4a1Ammo',
            damage: 80,
            countBullets: 40,
            countBulletsInHolder: 20,
            imagePos: {x: 200, y: 0},
            pos: {x: xStart, y: yStart},
            timeBetweenShots: 140
        }));
    }
    
    putAWPOnMap(xStart, yStart) {
        this.items.push(new Weapon({    //pistol
            name: 'awp',
            kindBullets: 'awpAmmo',
            damage: 600,
            countBullets: 10,
            countBulletsInHolder: 1,
            imagePos: {x: 300, y: 0},
            pos: {x: xStart, y: yStart},
            timeBetweenShots: 2800
        }));
    }
}


class Inventory {
    constructor() {
        this.inventoryThings = [];
        this.inventoryCeil = [
            {x:-150,y:225,empty: true},
            {x:-90,y:225,empty: true},
            {x:-30,y:225,empty: true},
            {x:30,y:225,empty: true},
            {x:90,y:225,empty: true},
            {x:150,y:225,empty: true}
        ];
        this.ceilSize = 60;
    }

    pushItem(itemToAdd) {

        let added = false;
        let addGunToGun = false;
        this.inventoryCeil.forEach(function(item, index, obj) {
            if(added || addGunToGun){
                return;
            }
            if(!item.empty){
                if(this.inventoryThings[index] instanceof Weapon && itemToAdd instanceof Thing) {
                    if(itemToAdd.name == this.inventoryThings[index].kindBullets){
                        this.inventoryThings[index].bulletsCount += itemToAdd.value;
                        added = true;
                    }
                }else if(this.inventoryThings[index] instanceof Thing && itemToAdd instanceof Thing) {
                    if(itemToAdd.name == this.inventoryThings[index].name){
                        this.inventoryThings[index].addThing();
                        added = true;
                    }
                }else if(this.inventoryThings[index] instanceof Weapon && itemToAdd instanceof Weapon){
                    if(itemToAdd.name == this.inventoryThings[index].name){
                        added = false;
                        addGunToGun = true;
                    }
                }
            }else {
                if(itemToAdd.name == 'medicineKit' || itemToAdd instanceof Weapon ){
                    this.inventoryThings[index] = itemToAdd;
                    this.inventoryCeil[index].empty = false;
                    added = true;
                }
            }
        }.bind(this));
        if(added){
            return true;
        }
        return false;
    }

    getItem(id) {
        return  id < this.inventoryThings.length ? this.inventoryThings[id] : 0;
    }

    removeItem(id) {
       
        if (id < this.inventoryThings.length) {
            this.inventoryThings.splice(id, 1);
            
            for(let i = this.inventoryCeil.length - 1; i >= 0; i--) {
                if(!this.inventoryCeil[i].empty) {
                    this.inventoryCeil[i].empty = true;
                    break;
                }
            }
        }
    }

    update(obj) {
        push();

        translate(obj.pos.x, obj.pos.y);
        colorMode(HSL);
        strokeWeight(2);
        stroke('rgba(35, 35, 35, 1)');
        fill(50, 0.5); 
        this.inventoryCeil.forEach(function(item, index, object) {
            let currentThing = this.inventoryThings[index];
            if(obj.currentThingInHand == currentThing && currentThing) {
                fill(60, 0.7);
                rect(item.x,item.y,this.ceilSize,this.ceilSize);
            }else {
                fill(50, 0.5);
                rect(item.x,item.y,this.ceilSize,this.ceilSize);
            }
            
            if(!item.empty && currentThing) {
                //shwo gun sprite in inventory panel
                image(currentThing.img,item.x + 10, 
                    item.y + 5, 
                    this.ceilSize*2/3, 
                    this.ceilSize*2/3,
                    currentThing.imagePos.x,
                    currentThing.imagePos.y,
                    INVENTORY_THING_SIZE,
                    INVENTORY_THING_SIZE
                );
                    
                if(currentThing instanceof Weapon) {
                    fill('#fff');
                    text(currentThing.bulletsCount + currentThing.bulletsHolder, item.x + 25, item.y + 55);
                }else {
                    fill('#fff');
                    text(currentThing.count, item.x + 25, item.y + 55);
                }
            }
        }.bind(this));

        if(player.currentObjInHand instanceof Weapon) {
            fill('#fff');
            textSize(30);
            text(player.currentObjInHand.bulletsCount + '/' + player.currentObjInHand.bulletsHolder,WIN_WIDTH_HALF/2 + 80,280);
        }

        pop();
    }
    
    clearCellStrokeWidth() {
        
    }

}

class Map {
    constructor(objOrigin, objMapSize) {
        this.name = name;
        this.origin = {'x': objOrigin.x, 'y': objOrigin.y};
        this.map = null;
        this.imagesSet = null;
        this.ob
    }

    createMap(json) {
        let tmpMap = [];
        let tileX = 0;
        let tileY = 0;


        let jsonIndex = 0;
        let imgID = 0;
        for(let i = 0; i < MAP_SIZE_Y; i++) {
            tmpMap[i] = [];
            for(let j = 0; j < MAP_SIZE_X; j++) {
                let imgX = 0, imgY = 0;

                switch(json.layers[0].data[jsonIndex]) {
                    case 1: //grass
                        imgX = 0;
                        imgY = 0;
                        break;
                    case 2: 
                        imgX = 100;
                        imgY = 0;
                        break;
                    case 5: //sand
                        imgX = 0;
                        imgY = 100;
                        break;
                    case 9: //brick wall 
                        imgX = 0;
                        imgY = 200;
                        break;
                    case 13: //wooden floor
                        imgX = 0;
                        imgY = 300;
                        break;
                }

                tmpMap[i][j] = new Tile(tileX, tileY, imgX, imgY, json.layers[0].data[jsonIndex]);

                jsonIndex++;
                tileX += TILE_H;
            }
            tileY += TILE_H;
            tileX = 0;
        }

        this.map = tmpMap;
    }

    update(pCoors) {
        fill(GRASS_COLOR);

        let playerTileX = (pCoors.x / TILE_W) | 0;
        let playerTileY = (pCoors.y / TILE_H) | 0;

        let lW = playerTileX - REND_MAP_LEFT;
        let rW = playerTileX + REND_MAP_RIGHT;
        let uH = playerTileY - REND_MAP_UP;
        let dH = playerTileY + REND_MAP_DOWN;

        if(playerTileX < this.map[0].length / 2){
            if(lW < 0){
                lW = 0;
            }
        } else {
            if(rW > this.map[0].length){
                rW = this.map[0].length;
            }
        }

        if(playerTileY < this.map.length / 2){
            if(uH < 0){
                uH = 0;
            }
        } else {
            if(dH > this.map.length){
                dH = this.map.length;
            }
        }

        for(let i = lW; i < rW; i++) {
            for(let j = uH; j < dH; j++) {
                this.map[j][i].update();
            }
        }
    }
}

class Player {
    constructor(radius, windowDimentions, playerSprites) {
        this.r = radius;
        this.rHand = (radius / 4) | 0;
        this.pos = {'x': windowDimentions.x / 2, 'y': windowDimentions.y / 2};
        this.windowDimBy2 = this.pos;
        this.dirMove = [false, false, false, false]; //WASD
        this.isblockRunning = false;

        this.inventory = new Inventory();

        this.queueBullets = null;

        this.playerSpeed = 5;
        this.boostedPlayerSpeed = this.playerSpeed * 2;

        this.barsX = 10;
        this.barsY = 200;
        this.healthBar = new HealthBar(HP_BAR_COLOR);
        //this.hungerBar = new HungerBar(HUNGER_BAR_COLOR);
        //this.coldBar = new ColdBar(COLD_BAR_COLOR);
        this.enduranceBar = new EnduranceBar(ENDURANCE_BAR_COLOR);

        this.playerSprites = playerSprites;
        this.currentSprite = this.playerSprites[0];
        
        this.bodySpriteCurrentWidth = 115;
        this.bodySpriteCurrentX = 0;
        
        
    }

    update(map) {
        fill(PLAYER_COLOR);

        push();

        ellipseMode(CENTER);
        translate(this.pos.x, this.pos.y);
        rotate(atan2(mouseY - WIN_HEIGHT_HALF, mouseX - WIN_WIDTH_HALF));

        // if(this.currentObjInHand instanceof Weapon){
        
        //  if(this.currentObjInHand){
        //      this.currentObjInHand.update();
        //  }
        // }

        imageMode(CENTER);
        //angleMode(DEGREES);
        //ellipse(0, -35, this.rHand, this.rHand); //left hand
        //ellipse(0, 35, this.rHand, this.rHand);
        rotate(-0.1);
        image(this.currentSprite, this.bodySpriteCurrentX, 0, this.bodySpriteCurrentWidth, 115);
        //ellipse(0, 0, this.r, this.r); //body
         //right hand
        
        pop();

        if(this.currentObjInHand instanceof Weapon) {
            
            //if reload, update circle animation
            if(this.currentObjInHand.reload) {
                this.currentObjInHand.updateRecharge(this.pos);
            }
            this.queueBullets = player.currentObjInHand.bullets;
        }

        if(this.queueBullets){
            //render and update bullets in queue
            this.queueBullets.update(0.02, map.map);
            this.queueBullets.render();
        }

        //update inventory
        this.inventory.update({
            'currentThingInHand':this.currentObjInHand,
            'pos': this.pos
        });

        //state bars
        this.updateStateBars();
        
        this.controller();
        
        handleCollisionWalls(this.pos, map.map);
    }

    focusCamera() {
        camera(this.pos.x - this.windowDimBy2.x, this.pos.y - this.windowDimBy2.y);
    }

    getHealthValue() {
        return this.healthBar.value;
    }

    updateStateBars() {
        push();
        strokeWeight(2);
        //this.hungerBar.w -= 0.01;

        this.barsX = this.pos.x - WIN_WIDTH_HALF + 10;
        this.barsY = this.pos.y + 225;
        this.healthBar.update(this.barsX, this.barsY);
        
        //this.hungerBar.update(this.barsX, this.barsY + 25);
        //this.coldBar.update(this.barsX, this.barsY + 25);
        this.enduranceBar.update(this.barsX, this.barsY + 25);
        pop();

        if(this.enduranceBar.w < 150 && !this.blockRunning) {
            this.enduranceBar.w += 0.1;
        }
        if(this.blockRunning) {
            setTimeout(() => {
                this.blockRunning = false;
            }, 3000);
        }
    }

    controller() {
        
        //w
        if(keyIsDown(87) && !this.dirMove[0]){
            player.pos.y -= this.playerSpeed;
        }
        //a
        if(keyIsDown(65) && !this.dirMove[1]){
            player.pos.x -= this.playerSpeed;
        }
        //s
        if(keyIsDown(83) && !this.dirMove[2]){
            player.pos.y += this.playerSpeed;
        }
        //d
        if(keyIsDown(68) && !this.dirMove[3]){
            player.pos.x += this.playerSpeed;
        }

        //fire
        if(keyIsDown(32) || mouseIsPressed) {
            if(this.currentObjInHand instanceof Weapon){
                this.currentObjInHand.makeShot(this);
            }
        }

        //inventory
        
            //1
        if(keyIsDown(49)){
            this.processingCurrentInventorySbj(0);
        }
        //2
        if(keyIsDown(50)){
            this.processingCurrentInventorySbj(1);
        }
        //3
        if(keyIsDown(51)){
            this.processingCurrentInventorySbj(2);
        }
        //4
        if(keyIsDown(52)){
            this.processingCurrentInventorySbj(3);
        }
        //5
        if(keyIsDown(53)){
            this.processingCurrentInventorySbj(4);
        }   
        

        //R - recharge
        if(keyIsDown(82)){
            if(this.currentObjInHand instanceof Weapon){
                this.currentObjInHand.initRecharge(this.currentObjInHand.name);
            }
        }

        //shift(boosted movement)
        if(keyIsDown(16) && !this.blockRunning){
            if(this.enduranceBar.w > 10) {
                this.enduranceBar.w -= 0.5;
                this.playerSpeed = this.boostedPlayerSpeed;
            } else {
                this.blockRunning = true;
            }
        } else {
            this.playerSpeed = this.boostedPlayerSpeed / 2;
        }
    }

    putThingInInventory(thing) {
        return this.inventory.pushItem(thing);
    }

    changePlayerSkin(weaponName) {
        console.log('skin: ' + weaponName);
        //if(currentObjectInHand instanceof Weapon || currentObjectInHand  instanceof Thing)
        switch(weaponName) {
            case 'glock17': 
                this.currentSprite = this.playerSprites[0];
                this.bodySpriteCurrentWidth = 115;
                this.bodySpriteCurrentX = 0;
                break;
            case 'ak47':
                this.currentSprite = this.playerSprites[1];
                this.bodySpriteCurrentWidth = 150;
                this.bodySpriteCurrentX = 20;
                break;
            case 'm4a1': 
                this.currentSprite = this.playerSprites[2];
                this.bodySpriteCurrentWidth = 150;
                this.bodySpriteCurrentX = 20;
                break;
            case 'awp':
                this.currentSprite = this.playerSprites[3];
                this.bodySpriteCurrentWidth = 165;
                this.bodySpriteCurrentX = 30;
                break;
            default:
                this.currentSprite = this.playerSprites[0];
                this.bodySpriteCurrentWidth = 115;
                this.bodySpriteCurrentX = 0;
                break;
        }
    
    }

    processingCurrentInventorySbj(index) {
        this.currentObjInHand = this.inventory.getItem(index);
        if(this.currentObjInHand) {
            this.changePlayerSkin(this.currentObjInHand.name);
            if(this.currentObjInHand.name == 'medicineKit') {
                if((this.healthBar.w + this.currentObjInHand.value) > 150) {
                    this.healthBar.w = 150;
                    this.healthBar.value = 150;
                }else {
                    this.healthBar.w += this.currentObjInHand.value;
                    this.healthBar.value += this.currentObjInHand.value;
                }
                if(keyIsPressed){
                    console.log(this.currentObjInHand.count ) 
                    if(this.currentObjInHand.count == 1){
                        this.inventory.removeItem(index);
                    }else {
                        this.currentObjInHand.count--;
                    }
                    keyIsPressed = false;
                }

            }       
        }
    }
}

class Thing {
    constructor(kit) {
        this.name = kit.name;
        this.value = kit.value;
        this.pos = kit.pos;
        this.imagePos = kit.imagePos;
        this.size = kit.size;
        this.img = loadImage(ITEMS_SPRITE);
        this.count = 1;
    }
    
    update() {
        image(this.img,
            this.pos.x,
            this.pos.y,
            60,
            60,
            this.imagePos.x, 
            this.imagePos.y,
            60,
            60,
        );
    }

    addThing() {
        this.count++;
    }
}

class Tile {
    constructor(x, y, imgX, imgY, spriteID) {
        this.pos = {'x': x, 'y': y};
        this.imgPos = {'x': imgX, 'y': imgY};
        this.spriteID = spriteID;
        this.healthValue = 1000;
    }

    update() {
        if(this.healthValue <= 0) {
            this.imgPos.x = 100;
            this.imgPos.y = 200;
            this.spriteID = 10;
        }

        image(images,
            this.pos.x,
            this.pos.y, 
            TILE_W, 
            TILE_H, 
            this.imgPos.x, 
            this.imgPos.y, 
            TILE_W, 
            TILE_H
        );
    }

    debugUpdate() {
        fill(255, 50);
        rect(this.pos.x, this.pos.y, TILE_W, TILE_H);
    }
}

class Weapon {
    constructor(weapon) {
        this.name = weapon.name;
        this.kindBullets = weapon.kindBullets;
        this.damage = weapon.damage;
        this.img = loadImage(GUN_SPRITE_SHEET);
        this.pos = weapon.pos;
        this.imagePos = weapon.imagePos;

        this.bulletsCount = weapon.countBullets;
        this.countBulletsInHolder = weapon.countBulletsInHolder;
        this.bulletsHolder = weapon.countBulletsInHolder;

        this.reloadIsNow = false;
        this.reload = 0;
        this.timeReload = 3530;
        
        this.timeBetweenShots = weapon.timeBetweenShots;
        this.canShoot = true;

        this.bullets = new Bullet();

        this.sizeW = weapon.w | INVENTORY_THING_SIZE;
        this.sizeH = weapon.h | INVENTORY_THING_SIZE;
    }

    update() {
        image(this.img,
            this.pos.x,
            this.pos.y,
            this.sizeW,
            this.sizeH,
            this.imagePos.x, 
            this.imagePos.y,
            INVENTORY_THING_SIZE,
            INVENTORY_THING_SIZE);
    }
    
    makeShot(player) {
        if(this.bulletsHolder > 0 && this.canShoot && !this.reloadIsNow) {

            
            
            this.playGunShotSound(player.currentObjInHand.name);
             //delay between shots
            this.canShoot = false;
            setTimeout(this.allowShoot.bind(this), this.timeBetweenShots);

            this.bulletsHolder--;
            

            //player property
            var xp = player.pos.x;
            var yp = player.pos.y;

            var x2 = mouseX + player.pos.x - WIN_WIDTH_HALF;  //mouse x
            var y2 = mouseY + player.pos.y - WIN_HEIGHT_HALF; //mouse y
            var angleBullet = atan2(y2 - yp, x2 - xp);

            //var x1 = xp + player.r * Math.sin(- angleP + 1); // gun x
            //var y1 = yp + player.r * Math.cos(- angleP + 1); // gun y
            //var angleBullet = atan2(y2 - y1, x2 - x1);

            this.bullets.pushBullet({
                x: xp,
                y: yp,
                angle: angleBullet,
                v: 1800,            //bullet speed
                bulletsLength: 10,  //bullet lenght
                bulletsColor: BULLET_COLOR, //color
                lifeTime: 30,
            });
        }
        if(this.bulletsHolder == 0 && this.bulletsCount > 0 &&  !this.reloadIsNow) {  //update bullets holder
            this.initRecharge(player.currentObjInHand.name);
        }
    }
    
    initRecharge(gunName) {
        if(!this.reloadIsNow){
            this.playGunReloadSound(gunName);
            this.reload = -Math.PI / 2; 
            this.reloadIsNow = true;
            setTimeout(this.recharge.bind(this), this.timeReload);
        } 
    }
    recharge() {
        if(this.bulletsCount > this.countBulletsInHolder) {
            if(this.bulletsHolder) {
                this.bulletsCount -= this.countBulletsInHolder - this.bulletsHolder;
                this.bulletsHolder = this.countBulletsInHolder;
            }
            else{
                this.bulletsCount -= this.countBulletsInHolder;
                this.bulletsHolder = this.countBulletsInHolder;
            }
        }
        else {
            this.bulletsHolder = this.bulletsCount;
            this.bulletsCount = 0;
        }
        this.reloadIsNow = false;
        this.reload = 0;
    }

    updateRecharge(pos) {
        let iRecharge = Math.PI / this.timeReload * 33;
        this.reload += iRecharge;

        push();

        ellipseMode(CENTER);
        translate(pos.x, pos.y);
        colorMode(HSL);
        noFill();
        strokeWeight(5);
        stroke('rgba(255, 255, 255, 0.8)');
        arc(60, -60, 25, 25, -Math.PI / 2, this.reload);

        pop();
    }

    allowShoot() {
        this.canShoot = true;
    }

    isBulletHolderEmpty() {
        if(this.bullets.bulletsList.length > 0) {
            return false;
        }
        return true;
    }

    playGunShotSound(weaponName) {
        switch(weaponName) {
            case 'glock17': 
                sounds.glock17.play();
                break;
            case 'ak47':
                sounds.ak47.play();
                break;
            case 'm4a1': 
                sounds.m4a1.play();
                break;
            case 'awp':
                sounds.awp.play();
                break;
        }
    }
    
    playGunReloadSound(weaponName) {
        switch(weaponName) {
            case 'glock17': 
                sounds.glock17Reload.play();
                break;
            case 'ak47':
                sounds.ak47Reload.play();
                break;
            case 'm4a1': 
                sounds.m4a1Reload.play();
                break;
            case 'awp':
                sounds.awpReload.play();
                break;
        }
    }
}
