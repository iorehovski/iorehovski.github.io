class Animation {
    constructor(imagesSet) {
        this.imagesSet = imagesSet;
        this.moveSpriteIndex = 0;
        this.attackSpriteIndex = 0;
        this.tickCount = 0;
        this.ticksPerSprite = 1;
        
        this.width = 110;
        this.height = 130;

        this.spritesMoveLength = this.imagesSet[0].length;
        this.spritesAttackLength = this.imagesSet[1].length;

        this.isMoving = true;
        this.isAttacking = false;
    }

    resetParams() {
        this.moveSpriteIndex = 0;
        this.tickCount = 0;
    }

    renderZombieAnim(enemyPos, playerPos) {

        push();
        imageMode(CENTER);
        translate(enemyPos.x, enemyPos.y);

        let angle = atan2(enemyPos.y - playerPos.y, enemyPos.x - playerPos.x);
        
        rotate(angle + Math.PI);

        this.tickCount++;
        
        if(this.isMoving) {
            image(this.imagesSet[0][this.moveSpriteIndex], 0, 0, this.width, this.height);

            if(this.tickCount > this.ticksPerSprite) {
                this.moveSpriteIndex++;
                if(this.moveSpriteIndex >= this.spritesMoveLength) this.moveSpriteIndex = 0;
                this.tickCount = 0;
            }
        } else {
            image(this.imagesSet[1][this.attackSpriteIndex], 0, 0, this.width, this.height);

            if(this.tickCount > this.ticksPerSprite) {
                this.attackSpriteIndex++;
                if(this.attackSpriteIndex >= this.spritesAttackLength) this.attackSpriteIndex = 0;
                this.tickCount = 0;
            }
        }
        pop();
    }

    renderPlayer(curWeapon, playerPos, bodySpriteCurX, bodySpriteCurY, bodySpriteCurW, bodySpriteCurH) {
        //push();
        imageMode(CENTER);
        rotate(-0.1);
        image(this.imagesSet[curWeapon][this.spriteIndex], bodySpriteCurX, bodySpriteCurY, bodySpriteCurW, bodySpriteCurH);
        //pop();

        this.tickCount++;
        if(this.tickCount > this.ticksPerSpritePlayer) {
            this.spriteIndex++;
            if(this.spriteIndex >= this.spritesMoveLength) this.spriteIndex = 0;
            this.tickCount = 0;
        }
    }
}

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
    constructor(posX, posY) {
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
        this.bulletsList.forEach(function(item, index, bulletsList) {

            const objTile = determineObjectTilePos({x: item.x, y: item.y}, map);

            //check if bullet flies upon wall sprite
            //bullet coll. with a wall
            if(map[objTile.objTileY]){  
                if(map[objTile.objTileY][objTile.objTileX]) {
                    if(map[objTile.objTileY][objTile.objTileX].hasOwnProperty('solid')) {
                        bulletsList.splice(index, 1);
                        map[objTile.objTileY][objTile.objTileX].healthValue -= player.currentWeaponInHand.damage;
                    } else {
                        item.x += item.vx * dt;
                        item.y += item.vy * dt;
            
                        item.lifeTime -= 1;
            
                        if(item.lifeTime <= 0) {
                            bulletsList.splice(index, 1);
                        }
                    }
                }
            }
             else {
                bulletsList.splice(index, 1);
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

function handleCollisionWalls(objPos, map, maxDistArg) {
    const objTile = determineObjectTilePos(objPos, map);
    const isCollide = handleCollision(
        objPos, 
        map, 
        objTile.objTileX, 
        objTile.objTileY, 
        objTile.lW, 
        objTile.rW, 
        objTile.uH, 
        objTile.dH,
        maxDistArg
    );

    const returnObject = {
        isCollide: isCollide,
        objTile
    }
    return returnObject;
}

function handleCollision(objPos, map, objTileX, objTileY, lW, rW, uH, dH, maxDistArg) {

    //check and handle wall collisions 
    //up
    let collidingTile = {
        isCollide : false,
    };
    
    //ckeck if out of map borders
    if(objTileY < 0 ||
        objTileY >= MAP_SIZE_Y - 1 ||
        objTileX < 0 ||
        objTileX >= MAP_SIZE_X - 1
    ) {
        return collidingTile;
    }

    //collision logic
    let maxDist;
    if(maxDistArg == undefined) {
        maxDist = 10;
    } else {
        maxDist = maxDistArg
    }
    
    //up
    if(map[uH][objTileX].hasOwnProperty('solid')) {
        if(objPos.y <= map[uH][objTileX].pos.y + TILE_H + maxDist) {
            objPos.y = map[uH][objTileX].pos.y + TILE_H + maxDist;
            collidingTile.isCollide = true;
            collidingTile.tileX = objTileX;
            collidingTile.tileY = uH;
        }
    }
    //right
    if(map[objTileY][rW].hasOwnProperty('solid')) {
        if(objPos.x >= map[objTileY][rW].pos.x - maxDist) {
            objPos.x = map[objTileY][rW].pos.x - maxDist;
            collidingTile.isCollide = true;
            collidingTile.tileX = rW;
            collidingTile.tileY = objTileY;
        }
    }
    //down
    if(map[dH][objTileX].hasOwnProperty('solid')) {
        if(objPos.y >= map[dH][objTileX].pos.y - maxDist) {
            objPos.y = map[dH][objTileX].pos.y - maxDist;
            collidingTile.isCollide = true;
            collidingTile.tileX = objTileX;
            collidingTile.tileY = dH;
        }
    }
    //left
    if(map[objTileY][lW].hasOwnProperty('solid')) {
        if(objPos.x <= map[objTileY][lW].pos.x + TILE_W + maxDist) {
            objPos.x = map[objTileY][lW].pos.x + TILE_W + maxDist;
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
const BGCOLOR_GRAY = '#686868';
const BGCOLOR_ALMOSTBLACK = '#080808';
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

//paths
const ITEMS_SPRITE = '../game/img/itemsSheet.png'; 
const GUN_SPRITE_SHEET = '../game/img/gunSpriteSheet.png';
const ITEMS_JSON_PATH = '../game/js/itemsJSON.json';
const MAP_JSON_PATH = '../game/js/mapJSON.json';
const WEAPON_JSON_PATH = '../game/js/weaponJSON.json';
const BUNKER_JSON_PATH = '../game/js/bunkerJSON.json';

const INVENTORY_THING_SIZE = 100;
const ITEM_SIZE = 60;


class Enemy {
    constructor(x, y, r, spriteSet) {
        this.r = r;
        this.pos = createVector(x, y);
        this.moveSpeed = 2;
        this.color = color(255);
        this.animation = new Animation(spriteSet);

        this.hp = 100;
        this.damage = 0;
        this.damageToWall = 2;

        this.moveQueue = [];

        this.isOnScreen = false;
    }

    update(player, map) {

        if(this.animation.isMoving) this.moveEnemy(player.pos);

        if(this.isOnScreen) {

            if(this.isIntersects(player.pos)) {
                this.animation.isMoving = false;

                player.makeBlood();
                setTimeout(function() {
                    this.damage = 0.5;
                }.bind(this), 500);
                this.animation.renderZombieAnim(this.pos, player.pos);

                this.damage = 0.5;

            } else {
                this.animation.isMoving = true;
                this.animation.renderZombieAnim(this.pos, player.pos);
                this.damage = 0;
                
            }

            /*
            if(this.pos.x <= 600 || playerPos.x <= 600 ||  (Math.abs(dx) <= 100)) {
                
            }
            if(this.moveQueue.length == 0) {
                
                let arrX = [this.pos.x, (this.pos.x + playerPos.x)  / 1, playerPos.x];
                let arrY = [this.pos.y,  (this.pos.y + playerPos.y) / 1, playerPos.y];
    
                let nPoints = arrX.length;
                let resultY = 0;
                let s = 0;
    
                let currentX = this.pos.x;
                for(let k = 0; k < 15; k++) {
                    if(currentX < 600 || playerPos.x < 600 || Math.abs( playerPos.x - currentX ) < 100) { 
                        break;
                     } else {
                        resultY = arrY[0];
                        for(let i = 1; i < nPoints; i++) {
                            let difference = 0;
                            for(let j = 0; j <= i; j++) {
                                s = 1;
                                for(let m = 0; m <= i; m++) {
                                    if(m != j) {
                                        s *= arrX[j] - arrX[m];
                                    }
                                }
                                if(s != 0) {
                                    difference += arrY[j] / s;
                                }
                            }
                            for(let m = 0; m < i; m++) {
                                let findX = currentX;
                                difference *= (findX - arrX[m]);
                            }
                            resultY += difference;
                        }
        
                        this.moveQueue.push(createVector(currentX,resultY));
        
                        if(dx > 0) {    
                            currentX += 1;//this.moveSpeed;
                        } else if(dx <= 0) {
                            currentX -= 1;//this.moveSpeed;
                        }
                     }
                }
                // console.log(this.moveQueue);
            } else {
                this.pos.x = this.moveQueue[0].x;
                this.pos.y = this.moveQueue[0].y;
                this.moveQueue.splice(0, 1);
            }
            */

        }
        handleCollisionWalls(this.pos, map, 20);
    }

    moveEnemy(playerPos) {

        let dx = playerPos.x - this.pos.x;
        let dy = playerPos.y - this.pos.y;

        dx >= 0 ? this.pos.x += this.moveSpeed : this.pos.x += -this.moveSpeed;
        dy >= 0 ? this.pos.y += this.moveSpeed : this.pos.y += -this.moveSpeed;
    }

    checkCollidingWalls(map) {
        let collTile = handleCollisionWalls(this.pos, map, 25);
        
        if(collTile.isCollide) {
            map[collTile.tileY][collTile.tileX].healthValue -= this.damageToWall;
        }
    }

    changeColor() {
        this.color = color(random(255), random(255), random(255));
    }

    isIntersects(playerPos) {
        let d = dist(this.pos.x, this.pos.y, playerPos.x, playerPos.y);
        if(d < 50) {
            return true;
        }
        return false;
    }
}

$(document).ready(function(){
    $('.pauseMenu').hide();
    $('.pauseIndicator').hide();
    $('.gameOverMenu').hide();
    $('.finishMenu').hide();
});

$('.resumeBtn').click(function(){
    $('.pauseMenu').toggle();
    $('.pauseIndicator').toggle();
    gameIsPaused = false;
});

$('.restartBtn').click(function(){
    $('.gameOverMenu').hide();
    window.location.reload();
});

$(this).keydown(function(e){
    
    if(e.keyCode == 27 && !gameOver && !gameIsWon) {
        gameIsPaused = gameIsPaused ? false : true;
        $('.pauseMenu').toggle();
        $('.pauseIndicator').toggle();
    }
});

$("html,body").on("contextmenu", false);

$('.resumeFinishBtn').click(function(){
    $('.finishMenu').hide();
    gameIsPaused = false;
    gameIsWon = false;
});

let map;
let player = {};
let techData;
let enemies;

let jsonMap;
let jsonBunkerMap;
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
let gameIsWon = false;
let keyIsPressed = false;

let font;

let wavesEnemies;

let fpsValue;

function preload() {
    jsonMap = loadJSON(MAP_JSON_PATH);
    jsonBunkerMap = loadJSON(BUNKER_JSON_PATH);
    jsonItems = loadJSON(ITEMS_JSON_PATH);
    jsonWeapon = loadJSON(WEAPON_JSON_PATH);

    font = loadFont('../game/fonts/SquadaOne-Regular.ttf');
    
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
    
    //sounds.music.track1 = loadSound('../audio/Resident_Evil_movie_soundtrack_2008.mp3');
    //sounds.music.track2 = loadSound('../audio/Resident_Evil_Corp_Umbrella.mp3');

    zimbieSprites[0] = [];
    for(let i = 0; i < 17; i++) {
        zimbieSprites[0][i] = loadImage('../game/img/enemy/zombieNormal/skeleton-move_' + i + '.png');
    }
    zimbieSprites[1] = [];
    for(let i = 0; i < 9; i++) {
        zimbieSprites[1][i] = loadImage('../game/img/enemy/zombieNormal/skeleton-attack_' + i + '.png');
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


    itemsGenerator = new Generation(map.map, jsonItems, jsonWeapon, player, enemies, zimbieSprites);
    itemsGenerator.createGenerationArea(map.map);
    setInterval(function() {
        itemsGenerator.findEnemiesOnScreen(enemies, player.pos);
    }.bind(this), 2000);

    wavesEnemies = new WaveEnemies();
    wavesEnemies.launchNewWaves();

    blood = new Blood();

    background(BGCOLOR_GRAY);

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

    map.update(player.pos);

    blood.update();

    itemsGenerator.generateItem();
    itemsGenerator.updateItems();

    itemsGenerator.generateEnemy();
    itemsGenerator.updateEnemies(map.map, player);

    wavesEnemies.update(player.pos);

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

function printTechData(objData) {
    fill(255);
    textSize(TEXTSIZE_TECHDATA);
    text('x: ' + objData.xPlayer + ' y: ' + objData.yPlayer, objData.xPlayer - 100, objData.yPlayer - 60);
    text('FPS: ' + objData.frameRate, objData.xPlayer - WIN_WIDTH_HALF + 5, objData.yPlayer - WIN_HEIGHT_HALF + 15);
    text('enemies: ' + objData.enemiesNum, objData.xPlayer - WIN_WIDTH_HALF + 5, objData.yPlayer - WIN_HEIGHT_HALF + 30)
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkCollisionEnemies(enemies) {
    if(!enemies) {
        return;
    }

    let eLen = enemies.length;
    if(enemies.length > 1) {
        for(let i = 0; i < eLen; i++) {
            for(let j = i + 1; j < eLen; j++) {
                const d = dist(
                    enemies[i].pos.x,
                    enemies[i].pos.y,
                    enemies[j].pos.x,
                    enemies[j].pos.y,
                );

                if(d < 100) {
                    //enemies[i].changeColor();
                    //enemies[j].changeColor();

                    if(enemies[i].pos.x < enemies[j].pos.x) {
                    } else {
                        enemies[i].pos.x += 1;
                        enemies[j].pos.x -= 1;
                    } 

                    if(enemies[i].pos.y < enemies[j].pos.y) {
                        enemies[i].pos.y += 1;
                        enemies[j].pos.y -= 1;
                    } else {
                        enemies[i].pos.y -= 1;
                        enemies[j].pos.y += 1;
                    }
                }
            }
        }
    }
}

// it doesn't work
function restart() {
    enemies.lenght = 0;
    map.createMap(jsonMap);
    itemsGenerator = new Generation(map.map, jsonItems, jsonWeapon, player, enemies, zimbieSprites[0]);

}
/*
function copyObject(initialObject) {
    const obj = {};

    return obj;
}

*/

class Generation {
    constructor(map, jsonItems, jsonWeapon, player, enemies, enemySpriteSet) {
        this.map = map;
        this.generationArea = [];
        this.jsonItems = jsonItems;
        this.jsonWeapon = jsonWeapon;
        this.items = [];
        this.player = player;
        this.enemies = enemies;
        this.mapMaxSize = {x: MAP_SIZE_X * TILE_W - 100, y: MAP_SIZE_Y * TILE_W - 100};
        this.generatedWeaponNames = [];
        this.enemySpriteSet = enemySpriteSet;

        this.chanceItems = 2; //larger value lower chance
        this.chanceWeapon = 10;
        this.generalChance = 100;

        this.generalChanceZombie = 10;
        this.chanceZombieNormal = 3;
        this.chanceFastZombie = 5;
        this.chanceFatZombie = 8;

        this.enemiesOnScreen = [];
    }

    createGenerationArea(mapArray) {
        this.generationArea.length = 0;

        let lenY = mapArray.length;
        let lenX = mapArray[0].length;


        console.log(mapArray);
        for(let i = 0; i < lenY; i++) {
            for(let j = 0; j < lenX; j++) {
                if(mapArray[i][j]) {
                    if(mapArray[i][j].isWalkable == true) {
                        this.generationArea.push(mapArray[i][j].pos);
                    }
                }
            }
        }
    }

    generateEnemy() {
        if(randInt(0, this.generalChanceZombie) == 0) {
            if(randInt(0, this.chanceZombieNormal) == 0) {
                this.addEnemy();
            }
        }
    }

    //generate ammo, weapons, aid in map
    generateItem() {
        if(randInt(0, this.generalChance) == 0) {
            //generate ammo, aid kit,
            if(randInt(0, this.chanceItems) == 0) {
                let randItemID = randInt(0, 5);
                let randItemPosID = randInt(0, this.generationArea.length - 1);
                this.addThing(
                    this.generationArea[randItemPosID].x + 50,
                    this.generationArea[randItemPosID].y + 50,
                    randItemID
                );
            }

            //generate weapon
            if(randInt(0, this.chanceWeapon) == 0) {
                let randItemID = randInt(0, 3);
                let weaponName = JSON.parse(JSON.stringify(this.jsonWeapon.contents[randItemID])).name;
                if(this.generatedWeaponNames.indexOf(weaponName) >= 0) {
                    return;
                } else {
                    this.generatedWeaponNames.push(weaponName);
                    let randItemID = randInt(0, 3);
                    let randItemPosID = randInt(0, this.generationArea.length - 1);
                    this.addWeapon(
                        this.generationArea[randItemPosID].x + 50,
                        this.generationArea[randItemPosID].y + 50,
                        randItemID
                    );
                }
            }
        }
    }

    addThing(posX, posY, randItemID) {

        const item = JSON.parse(JSON.stringify(this.jsonItems.contents[randItemID]));
        item.pos.x = posX;
        item.pos.y = posY;
        
        this.items.push(new Thing(item));
    }

    addWeapon(posX, posY, randItemID) {

        const item = JSON.parse(JSON.stringify(this.jsonWeapon.contents[randItemID]));
        item.pos.x = posX;
        item.pos.y = posY;

        this.items.push(new Weapon(item));
    }

    addEnemy() {
        let randItemPosID = randInt(0, this.generationArea.length - 1);
        this.enemies.push(new Enemy(
            this.generationArea[randItemPosID].x + 50,
            this.generationArea[randItemPosID].y + 50,
            ENTITY_DIAMETR / 2,
            this.enemySpriteSet,
        ));
    }

    updateItems() {
        for(let i = 0, len = this.items.length; i < len; i++) {
            this.items[i].update();

            if(this.isIntersects(this.player.pos, this.items[i].pos)) {
                this.player.putThingInInventory(this.items[i]);
                this.items.splice(i, 1);
                len--;
            }
        }
    }

    updateEnemies(map, player) {

        for(let i = 0, len = this.enemies.length; i < len; i++) {

            this.enemies[i].update(player, map);

            const damage = this.enemies[i].damage;
            player.healthBar.value -= damage;
            //check player hp value
            if(player.getHealthValue() <= 0) {
            } else {
                player.healthBar.w -= damage;
            }

            //check if bullet hit an enemy
            if(player.currentWeaponInHand instanceof Weapon) {
                let bullets = player.currentWeaponInHand.bullets.bulletsList;
                for(let j = 0, lenBullets = bullets.length; j < lenBullets; j++) {
                    if(this.isIntersects({x : bullets[j].x, y : bullets[j].y}, this.enemies[i].pos)) {

                        this.enemies[i].hp -= bullets[j].penetrationCapacity;
                        bullets[j].penetrationCapacity -= this.enemies[i].hp;
                        if(bullets[j].penetrationCapacity <= 0) {
                            bullets.splice(j, 1);
                        }

                        blood.createBloodSpot(this.enemies[i].pos.x, this.enemies[i].pos.y);
                        lenBullets--;
                    }
                }
            }

            if(this.enemies[i].hp <= 0){
                this.enemies.splice(i, 1);
                len--;
                player.score.increaseScore();
            }
        }

        checkCollisionEnemies(this.enemiesOnScreen);
    }

    isIntersects(playerPos, itemPos) {
        let d = dist(itemPos.x, itemPos.y, playerPos.x, playerPos.y);
        if(d < 50) {
            return true;
        }
        return false;
    }

    findEnemiesOnScreen(enemiesList, playerPos) {

        this.enemiesOnScreen.length = 0;


        let renderBorderUp = playerPos.y - WIN_HEIGHT;
        let renderBorderDown = playerPos.y + WIN_HEIGHT;
        let renderBorderLeft = playerPos.x - WIN_WIDTH;
        let renderBorderRight = playerPos.x + WIN_WIDTH;
        
        for(let i = 0, len = enemiesList.length; i < len; i++) {
            if(this.isEnemyOnScreen(
                enemiesList[i].pos,
                renderBorderUp,
                renderBorderDown,
                renderBorderLeft,
                renderBorderRight
            )) {
                enemiesList[i].isOnScreen = true;
                this.enemiesOnScreen.push(enemiesList[i]);
            } else {
                enemiesList[i].isOnScreen = false;
            }
        }
    }

    isEnemyOnScreen(enemyPos, renderBorderUp, renderBorderDown, renderBorderLeft, renderBorderRight) {

        if(enemyPos.y < renderBorderUp) {
            return false;
        }

        if(enemyPos.y > renderBorderDown) {
            return false;
        }

        if(enemyPos.x < renderBorderLeft) {
            return false;
        }

        if(enemyPos.x > renderBorderRight) {
            return false;
        }

        return true;
    }
}

class Inventory {
    constructor() {
        this.inventoryThings = [];
        this.inventoryCeil = [
            {x: -150, y: WIN_HEIGHT_HALF - 150, empty: true},
            {x: -90, y: WIN_HEIGHT_HALF - 150, empty: true},
            {x: -30, y: WIN_HEIGHT_HALF - 150, empty: true},
            {x: 30, y: WIN_HEIGHT_HALF - 150, empty: true},
            {x: 90, y: WIN_HEIGHT_HALF - 150, empty: true},
            {x: 150, y: WIN_HEIGHT_HALF - 150, empty: true}
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
                    if(itemToAdd.name == this.inventoryThings[index].bulletType){
                        this.inventoryThings[index].bulletAmount += itemToAdd.value;
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
                if(itemToAdd.itemType == 'aid' || itemToAdd instanceof Weapon ){
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
        //stroke('rgba(35, 35, 35, 1)');
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
                image(currentThing.img,
                    item.x + 10, 
                    item.y + 5, 
                    40, 
                    40,
                    currentThing.imagePos.x,
                    currentThing.imagePos.y,
                    currentThing.size.w + 9,
                    currentThing.size.h + 9
                );
                
                if(currentThing instanceof Weapon) {
                    fill('#fff');
                    textFont(font);
                    text(currentThing.bulletAmount + currentThing.bulletCurrentMagazine, item.x + 25, item.y + 55);
                }else {
                    fill('#fff');
                    textFont(font);
                    text(currentThing.count, item.x + 25, item.y + 55);
                }
            }
        }.bind(this));
        if(player.currentWeaponInHand instanceof Weapon) {
            fill('#fff');
            textSize(30);
            textFont(font);
            text(player.currentWeaponInHand.bulletCurrentMagazine + '/' + player.currentWeaponInHand.bulletAmount, WIN_WIDTH_HALF/2 + 80,WIN_HEIGHT_HALF - 120);
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
        this.map = [];
        this.imagesSet = null;
        this.activeMap = 'arena';
        this.loaded = false;
    }

    createMap(json) {
        this.map.length = 0;
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
                        break;
                    case 2: 
                        imgX = 100;
                        break;
                    case 5: //sand
                        imgY = 100;
                        break;
                    case 9: //brick wall 
                        imgY = 200;
                        break;
                    case 13: //wooden floor
                        imgY = 300;
                        break;
                    case 17: //infinite wall
                        imgY = 400;
                        break;
                    case 0:
                        imgY = 500;
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

    update(playerPos) {

        background(BGCOLOR_ALMOSTBLACK);

        let playerTileX = (playerPos.x / TILE_W) | 0;
        let playerTileY = (playerPos.y / TILE_H) | 0;

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

        this.playerSpeedNormal = 7;
        this.playerSpeed = this.playerSpeedNormal;
        this.playerspeedBoosted = this.playerSpeedNormal * 2;

        this.barsX = 10;
        this.barsY = 200;
        this.healthBar = new HealthBar(HP_BAR_COLOR);
        //this.hungerBar = new HungerBar(HUNGER_BAR_COLOR);
        //this.coldBar = new ColdBar(COLD_BAR_COLOR);
        this.enduranceBar = new EnduranceBar(ENDURANCE_BAR_COLOR);

        this.score = new Score();

        this.playerSprites = playerSprites;
        this.currentSprite = playerSprites[0];
        
        this.bodySpriteCurrentWidth = 115;
        this.bodySpriteCurrentX = 0;

        this.bloodIntervalCounter = 0; 

        //this.animationIdle = new Animation(playerSprites); 
        //this.currentWeaponNumber = 0;
    }

    update(map) {
        
        push();

        imageMode(CENTER);
        translate(this.pos.x, this.pos.y);
        rotate(atan2(mouseY - WIN_HEIGHT_HALF, mouseX - WIN_WIDTH_HALF));

        image(this.currentSprite, this.bodySpriteCurrentX, 0, this.bodySpriteCurrentWidth, 115);
        
        pop();

        if(this.currentWeaponInHand instanceof Weapon) {
            
            //if reload, update circle animation
            if(this.currentWeaponInHand.reload) {
                this.currentWeaponInHand.updateRecharge(this.pos);
            }
            this.queueBullets = player.currentWeaponInHand.bullets;
        }

        if(this.queueBullets){
            //render and update bullets in queue
            this.queueBullets.update(0.02, map.map);
            this.queueBullets.render();
        }

        //update inventory
        this.inventory.update({
            'currentThingInHand':this.currentWeaponInHand,
            'pos': this.pos
        });

        this.score.update(this.pos);

        //state bars
        this.updateStateBars();
        
        this.controller();
        
        const collistionObject = handleCollisionWalls(this.pos, map.map);
        this.checkActionTile(map, collistionObject);

        if(this.healthBar.w <= 1) {
            gameOver = true;
        }
    }

    focusCamera() {
        camera(this.pos.x - this.windowDimBy2.x, this.pos.y - this.windowDimBy2.y);
    }

    makeBlood() {
        this.bloodIntervalCounter++;
        if(this.bloodIntervalCounter > 50) {
            blood.createBloodSpot(this.pos.x, this.pos.y);
            this.bloodIntervalCounter = 0;
        }
    }

    getHealthValue() {
        return this.healthBar.value;
    }

    checkActionTile(map, collistionObject) {
        if(map.map[collistionObject.objTile.objTileY][collistionObject.objTile.objTileX]) {
            if(map.map[collistionObject.objTile.objTileY][collistionObject.objTile.objTileX].isBunkerEntrance) {
                if(map.activeMap === 'arena') {
                    map.activeMap = 'bunker';
                    this.pos.x = 6 * TILE_W;
                    this.pos.y = 17 * TILE_H + 100;
                    map.createMap(jsonBunkerMap);
                    itemsGenerator.createGenerationArea(map.map);
                    background(BGCOLOR_GRAY);
                    enemies.length = 0;
                    blood.bloodList.length = 0;
                } else {
                    map.activeMap = 'arena';
                    map.createMap(jsonMap);
                    itemsGenerator.createGenerationArea(map.map);
                    background(BGCOLOR_ALMOSTBLACK);
                }   
            }
        }
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
            if(this.currentWeaponInHand instanceof Weapon){
                this.currentWeaponInHand.makeShot(this);
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
        //6
        if(keyIsDown(54)){
            this.processingCurrentInventorySbj(5);
        }   
        //R - recharge
        if(keyIsDown(82)){
            if(this.currentWeaponInHand instanceof Weapon){
                this.currentWeaponInHand.initRecharge(this.currentWeaponInHand.name);
            }
        }

        //shift(boosted movement)
        if(keyIsDown(16) && !this.blockRunning){
            if(this.enduranceBar.w > 10) {
                this.enduranceBar.w -= 0.5;
                this.playerSpeed = this.playerspeedBoosted;
            } else {
                this.blockRunning = true;
            }
        } else {
            this.playerSpeed = this.playerSpeedNormal;
        }
    }

    putThingInInventory(thing) {
        return this.inventory.pushItem(thing);
    }

    changePlayerSkin(weaponName) {
        //if(currentObjectInHand instanceof Weapon || currentObjectInHand  instanceof Thing)
        switch(weaponName) {
            case 'glock17': 
                this.bodySpriteCurrentWidth = 115;
                this.bodySpriteCurrentX = 0;
                this.currentSprite = playerSprites[0];
                break;
            case 'ak47':
                this.bodySpriteCurrentWidth = 150;
                this.bodySpriteCurrentX = 20;
                this.currentSprite = playerSprites[1];
                break;
            case 'm4a1': 
                this.bodySpriteCurrentWidth = 150;
                this.bodySpriteCurrentX = 20;
                this.currentSprite = playerSprites[2];
                break;
            case 'awp':
                this.currentSprite = this.playerSprites[3];
                this.bodySpriteCurrentWidth = 167;
                this.bodySpriteCurrentX = 29;
                this.currentSprite = playerSprites[3];
                break;
            default:
                this.bodySpriteCurrentWidth = 115;
                this.bodySpriteCurrentX = 0;
                this.currentSprite = playerSprites[0];
                break;
        }
    
    }

    processingCurrentInventorySbj(index) {
        this.currentWeaponInHand = this.inventory.getItem(index);
        if(this.currentWeaponInHand) {
            this.changePlayerSkin(this.currentWeaponInHand.name);
            if(this.currentWeaponInHand.itemType == 'aid') {
                console.log((this.healthBar.w + this.currentWeaponInHand.value))
                if(keyIsPressed){
                if((this.healthBar.w + this.currentWeaponInHand.value) < 150) {
                    this.healthBar.w = (this.healthBar.w + this.currentWeaponInHand.value) % 150;
                    this.healthBar.value = this.healthBar.w;
                }else {
                    this.healthBar.w = 150;
                    this.healthBar.value = 150;
                }
                    if(this.currentWeaponInHand.count == 1){
                        this.inventory.removeItem(index);
                    }else {
                        this.currentWeaponInHand.count--;
                    }
                    keyIsPressed = false;
                }

            }       
        }
    }
}
class Score {
    constructor() {
        this.value = 0;
        this.kills = 0;
    }

    increaseScore() {
        this.value += 120;
        this.kills++;
    }

    update(pos) {
        push();
        translate(pos.x, pos.y);
        fill('#fff');
        textSize(26);
        textFont(font);
        text('score: ' + this.value, WIN_WIDTH_HALF/2 - 100, -WIN_HEIGHT_HALF + 40);
        text('kills: ' + this.kills, WIN_WIDTH_HALF/2 + 80, -WIN_HEIGHT_HALF + 40);
        pop();
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
        this.itemType = kit.itemType;
        this.count = 1;
    }
    
    update() {

        push();
        imageMode(CENTER);
        image(this.img,
            this.pos.x,
            this.pos.y,
            this.size.w,
            this.size.h,
            this.imagePos.x, 
            this.imagePos.y,
            60,
            60,
        );
        pop();
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
        this.isWalkable = true;

        switch(spriteID) {
            case 0:
                this.isWalkable = false;
                break;
            case 17: 
                this.healthValue = Infinity;
                this.solid = true;
                this.isWalkable = false;
                break;
            case 9: 
                this.healthValue = 1000;
                this.solid = true;
                this.isWalkable = false;
                break;
            case 21:
                this.isWalkable = false;
                break;
            case 5:
                this.isBunkerEntrance = true;
                break;
        }
    }

    update() {
        if(this.healthValue <= 0) {
            this.imgPos.x = 100;
            this.imgPos.y = 200;
            this.spriteID = 10;
            delete this.solid; 
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
}

class WaveEnemies {
    constructor() {
        this.nWave = 1;
        this.timeWaveS = 60;
        this.timeRestS = 20;
        this.timeForRest = false;
        this.timeFromStart= 0;
    }

    launchNewWaves() {
        setInterval(function(){
           
            if(!this.timeForRest && !gameIsPaused) {
                this.timeFromStart += 1;
            }
            if(this.timeFromStart == this.timeWaveS) {
                this.timeForRest = true;
                this.timeFromStart = 0;
                this.launchRest();
            }
            
        }.bind(this), 1000);
    }

    launchRest() { 
        if(this.nWave == 5) {
            $('.finishMenu').show();
            gameIsWon = true;
            gameIsPaused = true;
        }
        itemsGenerator.generalChanceZombie = Infinity;
        setTimeout(function(){
            this.timeForRest = false;
            this.nWave += 1;
            if((10 - this.nWave) > 0 && this.nWave < 5) {
                itemsGenerator.generalChanceZombie = 10 - this.nWave * 2;
            } else {
                itemsGenerator.generalChanceZombie = 1;
                itemsGenerator.chanceZombieNormal = 2;
            }
            
        }.bind(this),this.timeRestS * 1000);
    }

    update(pos) {
        push();
        translate(pos.x, pos.y);
        
        textSize(36);
        textFont(font);
        fill('#FA3838');
        text('00:' + (60 - this.timeFromStart), -40, -WIN_HEIGHT_HALF + 40);
        textSize(26);
        fill('#fff');
        text('Wave: ' + this.nWave, -38, -WIN_HEIGHT_HALF + 80);
       
        pop();
    }
}

class Weapon {
    constructor(weapon) {
        this.name = weapon.name;
        this.bulletType = weapon.bulletType;
        this.damage = weapon.damage;
        this.img = loadImage(GUN_SPRITE_SHEET);
        this.pos = weapon.pos;
        this.imagePos = weapon.imagePos;

        this.bulletAmount = weapon.bulletAmount;
        this.bulletMagazineCapacity = weapon.bulletMagazineCapacity;
        this.bulletCurrentMagazine = weapon.bulletMagazineCapacity;

        this.reloadIsNow = false;
        this.reload = 0;
        this.timeReload = 3530;
        
        this.timeBetweenShots = weapon.timeBetweenShots;
        this.canShoot = true;

        this.bullets = new Bullet();

        this.size = weapon.size;
    }

    update() {
        push();
        imageMode(CENTER);
        image(this.img,
            this.pos.x,
            this.pos.y,
            this.size.w,
            this.size.h,
            this.imagePos.x, 
            this.imagePos.y,
            INVENTORY_THING_SIZE,
            INVENTORY_THING_SIZE
        );
        pop();
    }
    
    makeShot(player) {
        if(this.bulletCurrentMagazine > 0 && this.canShoot && !this.reloadIsNow) {
            
            this.playGunShotSound(player.currentWeaponInHand.name);
             //delay between shots
            this.canShoot = false;
            setTimeout(this.allowShoot.bind(this), this.timeBetweenShots);

            this.bulletCurrentMagazine--;
            

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
                lifeTime: 35,
                penetrationCapacity: player.currentWeaponInHand.damage / 2
            });
        }
        if(this.bulletCurrentMagazine <= 0 && this.bulletAmount > 0 && !this.reloadIsNow) {  //update bullets holder
            this.initRecharge(player.currentWeaponInHand.name);
        }
    }
    
    initRecharge(gunName) {
        if(!this.reloadIsNow && this.bulletAmount && this.bulletCurrentMagazine != this.bulletMagazineCapacity){
            this.playGunReloadSound(gunName);
            this.reload = -Math.PI / 2; 
            this.reloadIsNow = true;
            setTimeout(this.recharge.bind(this), this.timeReload);
        } 
    }
    recharge() {
        if(this.bulletAmount > this.bulletMagazineCapacity) {
            this.bulletAmount += this.bulletCurrentMagazine - this.bulletMagazineCapacity;
            this.bulletCurrentMagazine = this.bulletMagazineCapacity;
        } else if(this.bulletAmount + this.bulletCurrentMagazine > this.bulletMagazineCapacity){
            this.bulletAmount = (this.bulletAmount + this.bulletCurrentMagazine) % this.bulletMagazineCapacity;
            this.bulletCurrentMagazine = this.bulletMagazineCapacity;
        } else {
            this.bulletCurrentMagazine += this.bulletAmount;
            this.bulletAmount = 0;
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