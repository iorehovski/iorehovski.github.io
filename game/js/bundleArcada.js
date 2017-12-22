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

class Backpack {
    constructor() {
        this.backpacksThings = [];
        this.ceilSize = 60;
        this.backpacksCeil = [
            {x: -150, y: -this.ceilSize, thing: false},
            {x: -90, y: -this.ceilSize, thing: false},
            {x: -30, y: -this.ceilSize, thing: false},
            {x: 30, y: -this.ceilSize, thing: false},
            {x: 90, y: -this.ceilSize, thing: false},
            {x: 150, y: -this.ceilSize, thing: false},
            {x: -150, y: 0, thing: false},
            {x: -90, y: 0, thing: false},
            {x: -30, y: 0, thing: false},
            {x: 30, y: 0, thing: false},
            {x: 90, y: 0, thing: false},
            {x: 150, y: 0, thing: false},
            {x: -150, y: this.ceilSize, thing: false},
            {x: -90, y: this.ceilSize, thing: false},
            {x: -30, y: this.ceilSize, thing: false},
            {x: 30, y: this.ceilSize, thing: false},
            {x: 90, y: this.ceilSize, thing: false},
            {x: 150, y: this.ceilSize, thing: false},
            {x: -150, y: this.ceilSize * 2, thing: false},
            {x: -90, y: this.ceilSize * 2, thing: false},
            {x: -30, y: this.ceilSize * 2, thing: false},
            {x: 30, y: this.ceilSize * 2, thing: false},
            {x: 90, y: this.ceilSize * 2, thing: false},
            {x: 150, y: this.ceilSize * 2, thing: false},
        ];
        this.processItem = false;
        this.rollAndDrop = false;
        this.show = false;
    }

    update(pos) {
        if(!this.show) {
            return;
        }
		push();

		translate(pos.x, pos.y);
        
        fill(30);
        rect(-151,-90,this.ceilSize * 6 + 1, 30);
        fill('#fff');
        textSize(25);
        textFont(font);
        text('Backpack', -20, -68);
        textSize(15);
        colorMode(HSL);

        strokeWeight(2);
        //stroke('rgba(35, 35, 35, 1)');
        fill(50, 0.5); 

        this.backpacksCeil.forEach(function(item, index, object) {
            // let currentThing = this.backpacksThings[index];
            let currentThing = item.thing;
            fill(20, 0.8);
            rect(item.x,item.y,this.ceilSize,this.ceilSize);
            
            if(currentThing) {
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

		pop();
    }

    pushItem(itemToAdd) {
        console.log(itemToAdd)
        let added = false;
        this.backpacksCeil.forEach(function(item, index, obj) {
            if(added){
                return;
            }
            if(item.thing){
               if(item.thing instanceof Thing && itemToAdd instanceof Thing) {
                    if(itemToAdd.name == item.thing.name){
                        item.thing.count += itemToAdd.count;
                        added = true;
                    }
                }
            }else {
                if(itemToAdd instanceof Thing || itemToAdd instanceof Weapon ){
                    item.thing = itemToAdd;
                    added = true;
                }
            }
        }.bind(this));
        if(added){
            return true;
        }
        return false;
    }

    pushItemInReqPos(itemToAdd) {
        let mousePosX = (mouseX - WIN_WIDTH_HALF);
        let mousePosY = (mouseY - WIN_HEIGHT_HALF);
        let added = false;
        if(mousePosX < -150 || mousePosX > 210) {
			if(mousePosY < -this.ceilSize || mousePosY > this.ceilSize * 2 + this.ceilSize) {
                return added;
            }
        }

        this.backpacksCeil.forEach(function(item, index, obj) {
            if(mousePosX >= item.x && mousePosX <= item.x + this.ceilSize && mousePosX ) {
                if(mousePosY >= item.y && mousePosY <= item.y + this.ceilSize) {
                    if(item.thing){
                        if(item.thing instanceof Thing && itemToAdd instanceof Thing) {
                            if(itemToAdd.name == item.thing.name){
                                if(itemToAdd != item.thing) {
                                    item.thing.count += itemToAdd.count;
                                    added = true;
                                }
                            }
                        }
                     }else {
                         if(itemToAdd instanceof Thing || itemToAdd instanceof Weapon ){
                            item.thing = itemToAdd;
                            added = true;
                         }
                     }
                }
            }
        }.bind(this));
        return added;
    }

    getItem(id) {
        return  id < this.backpacksThings.length ? this.backpacksThings[id] : 0;
    }

    removeProcessingItem() {
        for(let i = 0; i < this.backpacksCeil.length; i++) {
            if(this.processItem.x >= this.backpacksCeil[i].x && this.processItem.x < this.backpacksCeil[i].x + this.ceilSize) {
                if(this.processItem.y >= this.backpacksCeil[i].y && this.processItem.y < this.backpacksCeil[i].y + this.ceilSize) {
                    this.backpacksCeil[i].thing = false;
                }
            }
        }
    }  

    mouseOverItem(pos) {
        let mousePosX = (mouseX - WIN_WIDTH_HALF);
        let mousePosY = (mouseY - WIN_HEIGHT_HALF);
       
        let nCeil = this.backpacksCeil.length;
        for(let i = 0; i < nCeil; i++) {
            if(mousePosX >= this.backpacksCeil[i].x && mousePosX <= this.backpacksCeil[i].x + this.ceilSize) {
                if(mousePosY >= this.backpacksCeil[i].y && mousePosY <= this.backpacksCeil[i].y + this.ceilSize && this.backpacksCeil[i].thing) {
                    $('html').css('cursor','pointer'); 
                    this.processItemInfo(pos,this.backpacksCeil[i].thing);
                    return true;
                }
            }else {
                $('html').css('cursor',' url("../game/img/player/crosshair.cur"), crosshair');
            }
        }
        return false;
    }


    chooseItem() {
        let mousePosX = (mouseX - WIN_WIDTH_HALF);
        let mousePosY = (mouseY - WIN_HEIGHT_HALF);

        let nCeil = this.backpacksCeil.length;
        for(let i = 0; i < nCeil; i++) {
            if(mousePosX >= this.backpacksCeil[i].x && mousePosX <= this.backpacksCeil[i].x + this.ceilSize) {
                if(mousePosY >= this.backpacksCeil[i].y && mousePosY <= this.backpacksCeil[i].y + this.ceilSize && this.backpacksCeil[i].thing) {
                    this.processItem = this.backpacksCeil[i].thing;
                    this.processItem.x = this.backpacksCeil[i].x;
                    this.processItem.y = this.backpacksCeil[i].y;
                    return this.processItem;
                }
            }
        }
    }

    handlingBackpackItem(pos,thing) {
        let mousePosX = (mouseX - WIN_WIDTH_HALF);
        let mousePosY = (mouseY - WIN_HEIGHT_HALF);
        push();
        translate(pos.x,pos.y);
        image(this.processItem.img,
            mousePosX-20, 
            mousePosY-20, 
            40, 
            40,
            this.processItem.imagePos.x,
            this.processItem.imagePos.y,
            this.processItem.size.w + 9,
            this.processItem.size.h + 9
        );
        pop();
    }

    processItemInfo(pos,thing) {
        push();
        translate(pos.x,pos.y);
        fill(30);
        rect(-350,-90,this.ceilSize * 3 + 1, 30);
        fill('#fff');
        textSize(25);
        textFont(font);

        text(thing.name, -300, -68);
        textSize(20);

        if(thing instanceof Thing) {
            text('count: ' + thing.count, -280, -40);
            text('amount: ' + thing.count * thing.value, -280, -10);
        } 
        else if (thing instanceof Weapon) {
            text('bullets: ' + (+thing.bulletAmount+thing.bulletCurrentMagazine), -280, -40);
            text('damage: ' + thing.damage, -280, -10);
        }
       
        colorMode(HSL);
        fill(50, 0.5); 
        rect(-350,-90,this.ceilSize * 3 + 1, 90);
        image(thing.img,
            -350, 
            -60, 
            60, 
            60,
            thing.imagePos.x,
            thing.imagePos.y,
            thing.size.w + 9,
            thing.size.h + 9
        );
        pop();
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

    render(barsX, barsY) {
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
        this.strokeCol = '#138221';
    }

    update() {
        this.w -= 0.015;
        this.value -= 0.015;
    }

}

class EnduranceBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#8ca3aa';
    }
}

class ThirstBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#1c407a';
    }

    update() {
        this.w -= 0.01;
        this.value -= 0.02;
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
            if(map.map[objTile.objTileY]){  
                if(map.map[objTile.objTileY][objTile.objTileX]) {
                    if(map.map[objTile.objTileY][objTile.objTileX].hasOwnProperty('solid')) {
                        bulletsList.splice(index, 1);
                        map.map[objTile.objTileY][objTile.objTileX].healthValue -= player.currentWeaponInHand.damage;
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
    const isCollideObj = handleCollision(
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
        isCollideObj: isCollideObj,
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
        objTileY >= map.mapSize.y - 1 ||
        objTileX < 0 ||
        objTileX >= map.mapSize.x - 1
    ) {
        return collidingTile;
    }

    //collision logic
    let maxDist;
    if(maxDistArg == undefined) {
        maxDist = 33;
    } else {
        maxDist = maxDistArg
    }
    
    //up
    if(map.map[uH][objTileX].hasOwnProperty('solid')) {
        if(objPos.y <= map.map[uH][objTileX].pos.y + TILE_H + maxDist) {
            objPos.y = map.map[uH][objTileX].pos.y + TILE_H + maxDist;
            collidingTile.isCollide = true;
            collidingTile.tileX = objTileX;
            collidingTile.tileY = uH;
        }
    }
    //right
    if(map.map[objTileY][rW].hasOwnProperty('solid')) {
        if(objPos.x >= map.map[objTileY][rW].pos.x - maxDist) {
            objPos.x = map.map[objTileY][rW].pos.x - maxDist;
            collidingTile.isCollide = true;
            collidingTile.tileX = rW;
            collidingTile.tileY = objTileY;
        }
    }
    //down
    if(map.map[dH][objTileX].hasOwnProperty('solid')) {
        if(objPos.y >= map.map[dH][objTileX].pos.y - maxDist) {
            objPos.y = map.map[dH][objTileX].pos.y - maxDist;
            collidingTile.isCollide = true;
            collidingTile.tileX = objTileX;
            collidingTile.tileY = dH;
        }
    }
    //left
    if(map.map[objTileY][lW].hasOwnProperty('solid')) {
        if(objPos.x <= map.map[objTileY][lW].pos.x + TILE_W + maxDist) {
            objPos.x = map.map[objTileY][lW].pos.x + TILE_W + maxDist;
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

    if(objTileX < map.map[0].length / 2){
        if(lW < 0){
            lW = 0;
        }
    } else {
        if(rW > map.map[0].length){
            rW = map.map[0].length;
        }
    }

    if(objTileY < map.map.length / 2){
        if(uH < 0){
            uH = 0;
        }
    } else {
        if(dH > map.map.length){
            dH = map.map.length;
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

function handleCollisionBorders(playerPos, mapSize) {
    let mapFullX = mapSize.x  * TILE_H;
    let mapFullY = mapSize.y  * TILE_H;

    let dist = 20;

    //down
    if(playerPos.y >= mapFullY - dist) {
        playerPos.y = mapFullY - dist;
    }

    //up
    if(playerPos.y <= dist) {
        playerPos.y = dist;
    }

    //right
    if(playerPos.x >= mapFullX - dist) {
        playerPos.x = mapFullX - dist;
    }

    //left
    if(playerPos.x <= dist) {
        playerPos.x = dist;
    }
}

const WIN_WIDTH = window.outerWidth;
const WIN_HEIGHT = window.outerHeight;
const WIN_WIDTH_HALF = window.outerWidth / 2;
const WIN_HEIGHT_HALF = window.outerHeight / 2;

const TEXTSIZE_TECHDATA = 14;
const ENTITY_DIAMETR = 100;

//map
const MAP_SHOOTER_X = 40;
const MAP_SHOOTER_Y = 40;
const MAP_OPEN_WORLD_X = 320;
const MAP_OPEN_WORLD_Y = 320;

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
const BGCOLOR_BLACK = '#000000';
const BGCOLOR_BLUE = '#5abcd8';
const BGCOLOR_ALMOSTBLACK = '#080808';
const GRASS_COLOR = '#2e8c27';
const HP_BAR_COLOR = '#c01111';
const HUNGER_BAR_COLOR = '#1fc633';
const THIRST_BAR_COLOR = '#3b80ef';
const COLD_BAR_COLOR = '#1295d8';
const ENDURANCE_BAR_COLOR = '#b3ced6';
const BULLET_COLOR = '#fffb2d';

//things
const MEDICINE_KIT_WIDTH = 60;
const MEDICINE_KIT_HEIGHT = 60;
const AMMO_WIDTH = 60;
const AMMO_HEIGHT = 60;

//paths
const SHOOTER_MAP_JSON_PATH = '../game/js/arcadeModeMAP.json';
const SURVIVAL_MAP_JSON_PATH = '../game/js/survivalModeMAP.json';
const HOUSE1_JSON_PATH = '../game/js/json/house1.json';
const HOUSE2_JSON_PATH = '../game/js/json/house2.json';
const HOUSE3_JSON_PATH = '../game/js/json/house3.json';
const HOUSE4_JSON_PATH = '../game/js/json/house4.json';
const HOUSE5_JSON_PATH = '../game/js/json/house5.json';

const ITEMS_SPRITE = '../game/img/itemsSheet.png'; 
const GUN_SPRITE_SHEET = '../game/img/gunSpriteSheet.png';
const ITEMS_JSON_PATH = '../game/js/itemsJSON.json';
const WEAPON_JSON_PATH = '../game/js/weaponJSON.json';
const BUNKER_JSON_PATH = '../game/js/bunkerJSON.json';

const INVENTORY_THING_SIZE = 100;
const ITEM_SIZE = 60;

class Enemy {
    constructor(x, y, r, spriteSet, moveSpeed) {
        this.r = r;
        this.pos = createVector(x, y);
        this.moveSpeed = moveSpeed || 2;
        this.color = color(255);
        this.animation = new Animation(spriteSet);

        this.hp = 100;
        this.damage = 0;
        this.damageToWall = 3;

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
       this.checkCollidingWalls(this.pos, map, 20);
    }

    moveEnemy(playerPos) {
        
        // let angle = atan2( playerPos.y  - this.pos.y, playerPos.x  - this.pos.x);
        
        // let tmp = Math.abs(cos(angle) % 0.707);
        // console.log(tmp)
        // playerPos.x  >= this.pos.x ? this.pos.x += this.moveSpeed * tmp : this.pos.x += -this.moveSpeed*tmp;
        // playerPos.y >= this.pos.y ? this.pos.y += this.moveSpeed * tmp: this.pos.y += -this.moveSpeed*tmp;


        let dx = playerPos.x - this.pos.x;
        let dy = playerPos.y - this.pos.y;

        // if(tmp < 0.2 || tmp > 0.7) tmp = 1;
        // else{
        //     tmp *= 2;
        // }

        let x1 = this.pos.x,
            y1 = this.pos.y;

        if(dx >= 0) {
            this.pos.x += this.moveSpeed;
        } else {
            this.pos.x += -this.moveSpeed
        }
        if(dy != 0 && Math.abs(dx) > 100) {
            this.pos.y = (this.pos.x-x1)*(playerPos.y-y1)/(playerPos.x-x1) + y1;
        } else {
            dy > 0 ? this.pos.y += this.moveSpeed : this.pos.y += -this.moveSpeed;
        }

        // dx > 0 ? this.pos.x += this.moveSpeed : this.pos.x += -this.moveSpeed;
        // dy > 0 ? this.pos.y += this.moveSpeed : this.pos.y += -this.moveSpeed;
    }

    checkCollidingWalls(enemyPos, map, dist) {
        let collTile = handleCollisionWalls(enemyPos, map, dist);
        
        if(collTile.isCollideObj.isCollide) {
            map.map[collTile.isCollideObj.tileY][collTile.isCollideObj.tileX].healthValue -= this.damageToWall;
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
    // $('.gameOverMenu').hide();
    $('.finishMenu').hide();
});

$('.resumeBtn').click(function(){
    $('.pauseMenu').toggle();
    $('.pauseIndicator').toggle();
    gameIsPaused = false;
});

// $('.restartBtn').click(function(){
//     $('.gameOverMenu').hide();
//     window.location.reload();
// });

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
    if(!gameIsWon) {
        window.location.reload();
    }
    gameOver = false;
    gameIsPaused = false;
    gameIsWon = false;
});

$('.landingBtn').click(function () {
    location.href = '/';
});

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
    constructor(map, jsonItems, jsonWeapon, player, enemies, enemySpriteSet, mapX, mapY) {
        this.map = map;
        this.generationArea = [];
        this.jsonItems = jsonItems;
        this.jsonWeapon = jsonWeapon;
        this.items = [];
        this.player = player;
        this.enemies = enemies;
        this.mapMaxSize = {x: mapX * TILE_W - 100, y: mapY * TILE_W - 100};
        this.generatedWeaponNames = [];
        this.enemySpriteSet = enemySpriteSet;

        this.chanceItems = 4; //larger value lower chance
        this.chanceWeapon = 15;
        this.generalChance = 20;
        this.chanceZombie = 30;
        this.generItemsTryNumber = 10; 
        this.generWeaponTryNumber = 2;

        this.enemiesOnScreen = [];
    }

    createGenerationArea(map) {
        this.generationArea.length = 0;
        let lenY = map.map.length;
        let lenX = map.map[0].length;

        for(let i = 0; i < lenY; i++) {
            for(let j = 0; j < lenX; j++) {
                if(map.map[i][j]) {
                    if(map.map[i][j].isWalkable) {
                        this.generationArea.push(map.map[i][j].pos);
                    }
                }
            }
        }
    }

    generateEnemy() {
        if(map.activeMap !== 'world') {
            return;
        }

        if(randInt(0, this.chanceZombie) == 0) {
            this.addEnemy();
        }
    }

    generateEnemyAmount(number) {
        for(let i = 0, len = number; i < len; i++) {
            this.addEnemy();
        }
    }

    generateItemsAmount() {
        let number = randInt(0, this.generationInHouseTryNumber);
        for(let i = 0, len = number; i < len; i++) {
            if(randInt(0, this.chanceItems) == 0) {
                let randItemID = randInt(0, 5);
                let randItemPosID = randInt(0, this.generationArea.length - 1);
                this.addThing(
                    this.generationArea[randItemPosID].x + 50,
                    this.generationArea[randItemPosID].y + 50,
                    randItemID
                );
            }
        }
    }

    generateWeaponAmount(number) {
        let number = randInt(0, this.generWeaponTryNumber);
        for(let i = 0, len = number; i < len; i++) {
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

    genWeapon() {

    }

    genItem() {
        
    }

    //generate ammo, weapons, aid in map
    generateItems() {
        if(map.activeMap !== 'world') {
            return;
        }

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
            3
        ));
    }

    updateItems() {
        for(let i = 0, len = this.items.length; i < len; i++) {
            this.items[i].update();

            if(this.isIntersects(this.player.pos, this.items[i].pos)) {
                if(this.player.putThingInInventory(this.items[i])) {
                    this.items.splice(i, 1);
                    len--;
                }
                else if(player.backpack && this.items[i] instanceof Thing) {
                    //add bullets in backpack
                    this.player.backpack.pushItem(this.items[i]);
                    this.items.splice(i, 1);
                    len--;
                }
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

    updateEnemiesSurvivalMode(map, player) {
        if(map.activeMap)

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
        // this.inventoryThings = [];
        this.inventoryCeil = [
            {x: -150, y: WIN_HEIGHT_HALF - 150, thing: false},
            {x: -90, y: WIN_HEIGHT_HALF - 150, thing: false},
            {x: -30, y: WIN_HEIGHT_HALF - 150, thing: false},
            {x: 30, y: WIN_HEIGHT_HALF - 150, thing: false},
            {x: 90, y: WIN_HEIGHT_HALF - 150, thing: false},
            {x: 150, y: WIN_HEIGHT_HALF - 150, thing: false}
        ];
        this.ceilSize = 60;
        this.processItem = false;
        this.rollAndDrop = false;
    }

    pushItem(itemToAdd) {
        let added = false;
        let addGunToGun = false;
        this.inventoryCeil.forEach(function(item, index, obj) {
            if(added || addGunToGun){
                return;
            }
            if(item.thing){
                if(item.thing instanceof Weapon && itemToAdd instanceof Thing) {
                    if(itemToAdd.name == item.thing.bulletType){
                        item.thing.bulletAmount += itemToAdd.value;
                        added = true;
                    }
                }else if(item.thing instanceof Thing && itemToAdd instanceof Thing) {
                    if(itemToAdd.name == item.thing.name){
                        item.thing.incThing();
                        added = true;
                    }
                }else if(item.thing instanceof Weapon && itemToAdd instanceof Weapon){
                    if(itemToAdd.name == item.thing.name){
                        added = false;
                        addGunToGun = true;
                    }
                }
            }else {
                if(itemToAdd.itemType == 'aid' || itemToAdd instanceof Weapon ){
                    item.thing = itemToAdd;
                    added = true;
                }
            }
        }.bind(this));
        if(added){
            return true;
        }
        return false;
    }

    pushItemInReqPos(itemToAdd) {
        let mousePosX = (mouseX - WIN_WIDTH_HALF);
        let mousePosY = (mouseY - WIN_HEIGHT_HALF);
        let added = false;

        //if we put thing in inventory
		if(mousePosX < -150 || mousePosX > 150 + this.ceilSize) {
			if(mousePosY < WIN_HEIGHT_HALF - 150 || mousePosY > WIN_HEIGHT_HALF - 150 + this.ceilSize) {
                return added;
            }
        }
        this.inventoryCeil.forEach(function(item, index, obj) {
            if(mousePosX >= item.x && mousePosX <= item.x + this.ceilSize) {
                if(mousePosY >= item.y && mousePosY <= item.y + this.ceilSize) {
                    if(item.thing){
                        if(item.thing instanceof Thing && itemToAdd instanceof Thing) {
                            if(itemToAdd.name == item.thing.name){
                                item.thing.count += itemToAdd.count;
                                added = true;
                            }
                        }
                     }else {
                         if(itemToAdd instanceof Thing || itemToAdd instanceof Weapon ){
                            item.thing = itemToAdd;
                            added = true;
                         }
                     }
                }
            }
        }.bind(this));
        return added;
    }

    getItem(id) {
        return  id < this.inventoryCeil.length ? this.inventoryCeil[id].thing : 0;
    }

    removeItem(id) {
        if (id < this.inventoryCeil.length) {
            for(let i = this.inventoryCeil.length - 1; i >= 0; i--) {
                if(i == id) {
                    this.inventoryCeil[i].thing = false;
                    break;
                }
            }
        }
    }

    removeProcessingItem() {
        for(let i = 0; i < this.inventoryCeil.length; i++) {
            if(this.processItem.x >= this.inventoryCeil[i].x && this.processItem.x < this.inventoryCeil[i].x + this.ceilSize) {
                if(this.processItem.y >= this.inventoryCeil[i].y && this.processItem.y < this.inventoryCeil[i].y + this.ceilSize) {
                    this.inventoryCeil[i].thing = false;
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
            let currentThing = item.thing;
            if(obj.currentThingInHand == currentThing && currentThing) {
                fill(60, 0.7);
                rect(item.x,item.y,this.ceilSize,this.ceilSize);
            }else {
                fill(50, 0.5);
                rect(item.x,item.y,this.ceilSize,this.ceilSize);
            }
            
            if(currentThing) {
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
    mouseOverItem() {
        let mousePosX = (mouseX - WIN_WIDTH_HALF);
        let mousePosY = (mouseY - WIN_HEIGHT_HALF);
        let nCeil = this.inventoryCeil.length;
        for(let i = 0; i < nCeil; i++) {
         
            if(mousePosX >= this.inventoryCeil[i].x && mousePosX <= this.inventoryCeil[i].x + this.ceilSize) {
                if(mousePosY >= this.inventoryCeil[i].y && mousePosY <= this.inventoryCeil[i].y + this.ceilSize && this.inventoryCeil[i].thing) {
                    $('html').css('cursor','pointer'); 
                    return true;
                }
            }else {
                $('html').css('cursor',' url("../game/img/player/crosshair.cur"), crosshair');
            }
        }
        return false;
    }

    chooseItemUnderMouse() {
        // if(this.processItem) {
        //     return;
        // }
        
        let mousePosX = (mouseX - WIN_WIDTH_HALF);
        let mousePosY = (mouseY - WIN_HEIGHT_HALF);
        let nCeil = this.inventoryCeil.length;
        for(let i = 0; i < nCeil; i++) {

            if(mousePosX >= this.inventoryCeil[i].x && mousePosX <= this.inventoryCeil[i].x + this.ceilSize) {
                if(mousePosY >= this.inventoryCeil[i].y && mousePosY <= this.inventoryCeil[i].y + this.ceilSize && this.inventoryCeil[i].thing) {
                    this.processItem = this.inventoryCeil[i].thing;
                    this.processItem.x = this.inventoryCeil[i].x;
                    this.processItem.y = this.inventoryCeil[i].y;
                    return this.processItem;
                }
            }
        }
    }

    handlingInventoryItem(pos) {
        let mousePosX = (mouseX - WIN_WIDTH_HALF);
        let mousePosY = (mouseY - WIN_HEIGHT_HALF);
        push();
        translate(pos.x,pos.y);
        image(this.processItem.img,
            mousePosX-20, 
            mousePosY-20, 
            40, 
            40,
            this.processItem.imagePos.x,
            this.processItem.imagePos.y,
            this.processItem.size.w + 9,
            this.processItem.size.h + 9
        );
        pop();
    }
}

class Map {
    constructor(objOrigin) {
        this.name = name;
        this.origin = {'x': objOrigin.x, 'y': objOrigin.y};
        this.map = [];
        this.imagesSet = null;
        this.activeMap = 'world';
        this.loaded = false;
        this.mapSize = {};

        this.locationsHouses = [];
        this.generatedHouses = [];
    }

    createMap(json) {

        this.mapSize.x = json.width;
        this.mapSize.y = json.height;

        this.map.length = 0;
        let tmpMap = [];
        let tileX = 0;
        let tileY = 0;


        let jsonIndex = 0;
        let imgID = 0;
        for(let i = 0; i < this.mapSize.y; i++) {
            tmpMap[i] = [];
            for(let j = 0; j < this.mapSize.x; j++) {
                let imgX = 0, imgY = 0;

                switch(json.layers[0].data[jsonIndex]) {
                    case 0: //black tile
                        imgY = 900;
                        break;
                    case 1: //grass top-left
                        break;
                    case 2: //grass top
                        imgX = 100;
                        break;
                    case 3: //grass top-right
                        imgX = 200;
                        break;
                    case 11: //grass left
                        imgY = 100;
                        break;
                    case 12: //grass center
                        imgX = 100;
                        imgY = 100;
                        break;
                    case 13: //grass right
                        imgX = 200;
                        imgY = 100;
                        break;
                    case 21: //grass down-left
                        imgY = 200;
                        break;
                    case 22: //grass down
                        imgX = 100;
                        imgY = 200;
                        break;
                    case 23: //grass down-right
                        imgX = 200;
                        imgY = 200;
                        break;

                    case 4: //ground top-left
                        imgX = 300;
                        break;
                    case 5: //ground top
                        imgX = 400;
                        break;
                    case 6: //ground top-right
                        imgX = 500;
                        break;
                    case 14: //ground left
                        imgX = 300;
                        imgY = 100;
                        break;
                    case 15: //ground center
                        imgX = 400;
                        imgY = 100;
                        break;
                    case 16: //ground right
                        imgX = 500;
                        imgY = 100;
                        break;
                    case 24: //ground down-left
                        imgX = 300;
                        imgY = 200;
                        break;
                    case 25: //ground down
                        imgX = 400;
                        imgY = 200;
                        break;
                    case 26: //ground down-right
                        imgX = 500;
                        imgY = 200;
                        break;
                    case 4: //ground top-left
                        imgX = 300;
                        break;
                    case 5: //ground top
                        imgX = 400;
                        break;
                    case 6: //ground top-right
                        imgX = 500;
                        break;
                    case 14: //ground left
                        imgX = 300;
                        imgY = 100;
                        break;
                    case 15: //ground center
                        imgX = 400;
                        imgY = 100;
                        break;
                    case 16: //ground right
                        imgX = 500;
                        imgY = 100;
                        break;
                    case 24: //ground down-left
                        imgX = 300;
                        imgY = 200;
                        break;
                    case 25: //ground down
                        imgX = 400;
                        imgY = 200;
                        break;
                    case 26: //ground down-right
                        imgX = 500;
                        imgY = 200;
                        break;

                    case 31: //water top-left
                        imgY = 300;
                        break;
                    case 32: //water top
                        imgY = 300;
                        imgX = 100;
                        break;
                    case 33: //water top-right
                        imgY = 300;
                        imgX = 200;
                        break;
                    case 41: //water left
                        imgY = 400;
                        break;
                    case 42: //water center
                        imgX = 100;
                        imgY = 400;
                        break;
                    case 43: //water right
                        imgY = 400;
                        imgX = 200;
                        break;
                    case 51: //water down-left
                        imgY = 500;
                        break;
                    case 52: //water down
                        imgX = 100;
                        imgY = 500;
                        break;
                    case 53: //water down-right
                        imgX = 200;
                        imgY = 500;
                        break;

                    case 71: //brick wall 
                        imgY = 700;
                        break;
                    case 72: //infinite brick wall 
                        imgY = 700;
                        imgX = 100;
                        break;
                    case 63: //ruined brick wall | gray
                        imgX = 200;
                        imgY = 600;
                        break;
                    case 64: //ruined brick wall | grass
                        imgX = 300;
                        imgY = 600;
                        break;
                    case 81: //concrete wall
                        imgY = 800;
                        break;
                    case 82: //infinite wall
                        imgX = 100;
                        imgY = 800;
                        break;
                    case 83: //wooden floor
                        imgY = 800;
                        imgX = 200;
                        break;
                    case 73: //gray roof
                        imgX = 200;
                        imgY = 700;
                        break;

                    //roads
                    case 7:
                        imgX = 600;
                        break;
                    case 8:
                        imgX = 700;
                        break;
                    case 9: //zebra vert
                        imgX = 800;
                        break;
                    case 17:
                        imgX = 600;
                        imgY = 100;
                        break;
                    case 18:
                        imgX = 700;
                        imgY = 100;
                        break;
                    case 19: //zebra vert
                        imgX = 800;
                        imgY = 100;
                        break;
                    case 27:
                        imgX = 600;
                        imgY = 200;
                        break;
                    case 28:
                        imgX = 700;
                        imgY = 200;
                        break;

                    case 61: //sidewalk 
                        imgY = 600;
                        break;
                    case 62: //building entrance 
                        imgY = 600;
                        imgX = 100;
                        break;
                    case 92: //black tile
                        imgY = 900;
                        imgX = 100;
                        break;
                }

                tmpMap[i][j] = new Tile(tileX, tileY, imgX, imgY, json.layers[0].data[jsonIndex], map.activeMap);

                jsonIndex++;
                tileX += TILE_H;
            }
            tileY += TILE_H;
            tileX = 0;
        }

        this.map = tmpMap;
    }

    update(playerPos) {

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
                if(!this.map[j][i]) {

                } else {
                    this.map[j][i].update();
                } 
            }
        }
    }
}

class Minimap {
    constructor(img, playerPos) {
        this.mapImg = img;

        this.show = true;
        
        this.posX = WIN_WIDTH_HALF / 2 + 100;
        this.posY = -100;

        this.playerPoint = null;

        this.mapScale = 160;
    }

    update(playerPos) {

        let mapX = playerPos.x / this.mapScale;
        let mapY = playerPos.y / this.mapScale;

        if(this.show) {
            this.render(playerPos, mapX, mapY);
        }
    }

    render(playerPos, mapX, mapY) {
        push();

        translate(playerPos.x, playerPos.y);
        fill('#282828');
        stroke(2);
        rect(this.posX - 1, this.posY - 2, 203, 203); //border
        image(
            this.mapImg,
            this.posX,
            this.posY, 
            200,
            200
        );

        fill('#c10000');
        ellipse(this.posX + mapX, this.posY + mapY, 6, 6);

        pop();
    }
}

class Player {
    constructor(radius, windowDimentions, playerSprites) {
		this.r = radius;
		this.rHand = (radius / 4) | 0;
		this.pos = {'x': windowDimentions.x / 2, 'y': windowDimentions.y / 2};
		this.savedPosX;
		this.savedPosY;

		this.windowDimBy2 = this.pos;
		this.isblockRunning = false;

		this.inventory = new Inventory();
		this.backpack;

		this.minimap;

		this.queueBullets = null;

		this.playerSpeedNormal = 10;
		this.playerSpeed = this.playerSpeedNormal;
		this.playerspeedBoosted = this.playerSpeedNormal * 1.5;

		this.barsX = 10;
		this.barsY = 200;
		this.healthBar = new HealthBar(HP_BAR_COLOR);
		this.hungerBar = new HungerBar(HUNGER_BAR_COLOR);
		this.thirstBar = new ThirstBar(THIRST_BAR_COLOR);
		this.enduranceBar = new EnduranceBar(ENDURANCE_BAR_COLOR);

		this.score = new Score();

		this.playerSprites = playerSprites;
		this.currentSprite = playerSprites[0];
		
		this.bodySpriteCurrentWidth = 115;
		this.bodySpriteCurrentX = 0;

		this.bloodIntervalCounter = 0;
		
		this.entrancePause = true;
		
		this.actionKeyPressed = false;
		

		//this.animationIdle = new Animation(playerSprites); 
		//this.currentWeaponNumber = 0;
	}

	update(map, itemsGenerator) {
		
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
			this.queueBullets.update(0.02, map);
			this.queueBullets.render();
		}

		//update inventory
		this.inventory.update({
			'currentThingInHand':this.currentWeaponInHand,
			'pos': this.pos
		});

		if(this.minimap) {
			this.minimap.update(this.pos);
		}

		if(this.backpack) {
			this.backpack.update(this.pos);
			if(this.backpack.show) {
				this.handlingItems();
			}
		}

		this.score.update(this.pos);
		
		this.controller();
	
		if(map.activeMap !== 'world') {
			handleCollisionBorders(this.pos, map.mapSize);
		}
		
		const collistionObject = handleCollisionWalls(this.pos, map);
		this.checkEntranceTile(map, collistionObject, itemsGenerator);

		if(this.healthBar.w <= 1) {
			gameOver = true;
			$('.message').text('YOU DIED OF ZOMBIES');
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

	updateStateBarsArcadeMode() {
		push();
		strokeWeight(2);

		this.barsX = this.pos.x - WIN_WIDTH_HALF + 10;
		this.barsY = this.pos.y + 225;

		this.healthBar.render(this.barsX, this.barsY);
		this.enduranceBar.render(this.barsX, this.barsY + 25);

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

	updateStateBarsSurvivalMove() {
		push();
		strokeWeight(2);

		this.hungerBar.w -= 0.01;
		this.thirstBar.w -= 0.02;

		this.barsX = this.pos.x - WIN_WIDTH_HALF + 10;
		this.barsY = this.pos.y + 100;

		this.healthBar.render(this.barsX, this.barsY);
		this.hungerBar.render(this.barsX, this.barsY + 25);
		this.thirstBar.render(this.barsX, this.barsY + 50);
		this.enduranceBar.render(this.barsX, this.barsY + 75);
		pop();

		
		//check status bars
		if(this.enduranceBar.w < 150 && !this.blockRunning) {
			this.enduranceBar.w += 0.1;
		}
		if(this.blockRunning) {
			setTimeout(() => {
				this.blockRunning = false;
			}, 3000);
		}

		if(this.hungerBar.w <= 1) {
			$('.message').text('YOU DIED OF HUNGER');
			gameOver = true;
		}
		if(this.thirstBar.w <= 1) {
			$('.message').text('YOU DIED OF THIRST');
			gameOver = true;
		}
	}

	checkEntranceTile(map, collistionObject, itemsGenerator) {

		if(map.map[collistionObject.objTile.objTileY][collistionObject.objTile.objTileX]) {

			/*
			if(map.map[collistionObject.objTile.objTileY][collistionObject.objTile.objTileX].hasOwnProperty('isBunkerEntrance')) {
				if(map.activeMap === 'world') {
					map.activeMap = 'bunker';
					this.pos.x = 6 * TILE_W;
					this.pos.y = 17 * TILE_H + 100;
					map.createMap(jsonBunkerMap);
					itemsGenerator.createGenerationArea(map);
					background(BGCOLOR_GRAY);
					enemies.length = 0;
					blood.bloodList.length = 0;
				} else {
					map.activeMap = 'world';
					map.createMap(jsonMap, jsonMap.width, jsonMap.height);
					itemsGenerator.createGenerationArea(map);
					background(BGCOLOR_ALMOSTBLACK);
				}
			}
			*/

			if(map.map[collistionObject.objTile.objTileY][collistionObject.objTile.objTileX].hasOwnProperty('isHouseEntrance') && this.actionKeyPressed) {
				this.actionKeyPressed = false;
				if(map.activeMap === 'world') {

					map.activeMap = 'house';

					let randHouseNumber = randInt(0, map.locationsHouses.length - 1);
					let playerPos = map.locationsHouses[randHouseNumber].properties;
					let houseMap = map.locationsHouses[randHouseNumber];
					
					this.savedPosX = this.pos.x;
					this.savedPosY = this.pos.y;

					map.createMap(houseMap);
					itemsGenerator.createGenerationArea(map);

					this.pos.x = playerPos.playerStartX;
					this.pos.y = playerPos.playerStartY;
					
					itemsGenerator.enemies.length = 0;
					blood.bloodList.length = 0;

					//itemsGenerator.generateEnemyAmount(randInt(0, 5));
					
					return;

				}
				if(map.activeMap === 'house') {

					map.activeMap = 'world';
					map.createMap(jsonMap);
					itemsGenerator.enemies.length = 0;
					blood.bloodList.length = 0;

					this.pos.x = this.savedPosX;
					this.pos.y = this.savedPosY + 50;

					itemsGenerator.createGenerationArea(map);

					return;
				}
			}
		}
	}


	controller() {
		
		//w
		if(keyIsDown(87)){
			player.pos.y -= this.playerSpeed;
		}
		//a
		if(keyIsDown(65)){
			player.pos.x -= this.playerSpeed;
		}
		//s
		if(keyIsDown(83)){
			player.pos.y += this.playerSpeed;
		}
		//d
		if(keyIsDown(68)){
			player.pos.x += this.playerSpeed;
		}

		//fire
		if((keyIsDown(32) || mouseIsPressed)) {
			if(this.currentWeaponInHand instanceof Weapon){
				if(!this.backpack || (this.backpack && !this.backpack.show)) {
					this.currentWeaponInHand.makeShot(this);
				}
				
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

		//backpack
		if(keyIsDown(84)){
			if(this.backpack) {
				if(keyIsPressed){
					this.backpack.show = this.backpack.show ? false : true;
					keyIsPressed = false;
				}
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
				this.bodySpriteCurrentX = 45;
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

	handlingItems() {
		if(this.backpack.mouseOverItem(this.pos)) {
			if(mouseIsPressed && !this.backpack.rollAndDrop && !this.inventory.rollAndDrop) {
				this.backpack.chooseItem();
			}
		}
		else if(this.inventory.mouseOverItem()) {
			if(mouseIsPressed && !this.backpack.rollAndDrop && !this.inventory.rollAndDrop) {
				 this.inventory.chooseItemUnderMouse();
			}
		}  

		let mousePosX = (mouseX - WIN_WIDTH_HALF);
		let mousePosY = (mouseY - WIN_HEIGHT_HALF);
		
		if(this.backpack.processItem) {

			if(mouseIsPressed) {
				this.backpack.rollAndDrop = true;
				this.inventory.processItem = false;
				this.backpack.handlingBackpackItem(this.pos);
			}
			else {
				this.backpack.rollAndDrop = false;
				if(!this.inventory.processItem && !this.inventory.rollAndDrop) {
					if(this.inventory.pushItemInReqPos(this.backpack.processItem) || this.backpack.pushItemInReqPos(this.backpack.processItem)) {
						this.backpack.removeProcessingItem();
					}
					this.inventory.processItem = false;
					this.backpack.processItem = false;
					this.backpack.rollAndDrop = false;
				}
			}
		}
		else if(this.inventory.processItem) {
			if(mouseIsPressed) {
				this.inventory.rollAndDrop = true;
				this.backpack.rollAndDrop = false;
				this.inventory.handlingInventoryItem(this.pos);
				this.backpack.processItem = false;
			}
			else {
				if(this.inventory.pushItemInReqPos(this.inventory.processItem) || this.backpack.pushItemInReqPos(this.inventory.processItem)) {
					if(this.currentWeaponInHand == this.inventory.processItem) {
						this.currentWeaponInHand = 0;
					}
					this.inventory.removeProcessingItem();
				}
				this.inventory.processItem = false;
				this.backpack.processItem = false;
				this.inventory.rollAndDrop = false;
				this.backpack.rollAndDrop = false;
			}
		}

		if(this.backpack.rollAndDrop || this.inventory.rollAndDrop) {
			$('html').css('cursor','pointer');
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

    incThing() {
        this.count++;
    }
}

class Tile {
    constructor(x, y, imgX, imgY, spriteID, activeMap) {
        this.pos = {'x': x, 'y': y};
        this.imgPos = {'x': imgX, 'y': imgY};
        this.spriteID = spriteID;
        this.isWalkable = true;

        switch(spriteID) {
            case 0: //black tile
                this.isWalkable = false;
                break;
            case 81: //concrete wall
                this.healthValue = 1800;
                this.solid = true;
                this.isWalkable = false;
                break;
            case 82: //infinite wall
                this.solid = true;
                this.isWalkable = false;
                break;
            case 72: //building entrance
                this.isWalkable = false;
                this.solid = true;
                break;
            case 71: //brick wall
                this.healthValue = 1000;
                this.solid = true;
                this.isWalkable = false;
                break;
            case 72: //infinite brick wall
                this.solid = true;
                this.isWalkable = false;
                break;
            case 73: //gray roof
                this.isWalkable = false;
                this.solid = true;

            case 31: 
                this.solid = true;
                this.isWalkable = false;
                break;
            case 32: 
                this.solid = true;
                this.isWalkable = false;
                break;
            case 33: 
                this.solid = true;
                this.isWalkable = false;
                break;
            case 41: 
                this.solid = true;
                this.isWalkable = false;
                break;
            case 42: 
                this.solid = true;
                this.isWalkable = false;
                break;
            case 43: 
                this.solid = true;
                this.isWalkable = false;
                break;
            case 51: 
                this.solid = true;
                this.isWalkable = false;
                break;
            case 52: 
                this.solid = true;
                this.isWalkable = false;
                break;
            case 53: 
                this.solid = true;
                this.isWalkable = false;
                break;
            case 62:
                this.isWalkable = false;
                this.isHouseEntrance = true;
            case 92:
                this.isWalkable = false;
                this.isBunkerEntrance = true;
        }
    }

    update() {
        if(this.healthValue <= 0) {
            this.imgPos.y = 600;

            switch(this.spriteID) {
                case 71: 
                    this.imgPos.x = 300;
                    this.spriteID = 64;
                    break;
                case 81: 
                    this.imgPos.x = 200;
                    this.spriteID = 63;
                    break;
            }
            delete this.solid; 
            this.isWalkable = true;
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
        //if game is finished show congratulations
        if(this.nWave == 5) {
			$('.message').text('');
            $('.finishMenu').show();
            gameIsWon = true;
            gameOver = true;
            gameIsPaused = true;
        }
        itemsGenerator.generalChanceZombie = Infinity;
        setTimeout(function(){
            this.timeForRest = false;
            this.nWave += 1;
            if((10 - this.nWave) > 0 && this.nWave < 5) {
                itemsGenerator.chanceZombie = 20 - this.nWave * 2;
            } else {
                itemsGenerator.chanceZombie = 1;
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
        this.itemType = weapon.itemType;
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
    jsonMap = loadJSON(SHOOTER_MAP_JSON_PATH);
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
    
    //sounds.music.track1 = loadSound('../game/audio/Resident_Evil_movie_soundtrack_2008.mp3');
    //sounds.music.track2 = loadSound('../game/audio/Resident_Evil_Corp_Umbrella.mp3');

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

    player = new Player(
        ENTITY_DIAMETR / 2,
        {
            'x': 3500,
            'y': 2000},
            playerSprites
    );
    map = new Map(
        {
            'x': 0,
            'y': 0
        },
    );

    map.imagesSet = images;
    map.createMap(jsonMap);


    itemsGenerator = new Generation(map.map, jsonItems, jsonWeapon, player, enemies, zimbieSprites);
    itemsGenerator.createGenerationArea(map);
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
}

function draw() {
    if(gameOver) {
        gameIsPaused = true;
        if(gameIsWon) {
            $('.titleFinishMenu p').text('YOU SURVIVED');
            $('.titleFinishMenu').css('background','url(../game/img/win.jpg)');
            $('.resumeFinishBtn').text('RESUME');
            $('.titleFinishMenu').addClass('gameWon');
            $('.titleFinishMenu').removeClass('gameOver');
        } else {
            $('.titleFinishMenu p').text('GAME OVER');
            $('.titleFinishMenu').css('background','url(../game/img/game-over.jpg)');
            $('.resumeFinishBtn').text('RESTART');
            $('.titleFinishMenu').addClass('gameOver');
            $('.titleFinishMenu').removeClass('gameWon');
        }
        $('.finishMenu').show();
        // $('.gameScore').text('score:' + player.score.value);
    }
    if(gameIsPaused) {
        return;
    }
    background(BGCOLOR_ALMOSTBLACK);

    camera(player.pos.x - WIN_WIDTH_HALF, player.pos.y - WIN_HEIGHT_HALF);

    map.update(player.pos);

    blood.update();

    itemsGenerator.generateItems();
    itemsGenerator.updateItems();

    itemsGenerator.generateEnemy();
    itemsGenerator.updateEnemies(map, player);

    wavesEnemies.update(player.pos);

    printTechData( {
        'xPlayer': player.pos.x, 
        'yPlayer': player.pos.y,
        'frameRate': fpsValue,
        'enemiesNum': enemies.length
    });

    player.updateStateBarsArcadeMode();
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