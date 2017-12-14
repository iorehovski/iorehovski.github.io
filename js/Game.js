let map;
let player = {};
let techData;
let enemies;

let jsonMap;
let images;
let blood;
let spritesBlood; 
let playerSprites = [];

let sounds = {};
let soundsQueue = [];

let things = [];    //things as medicine kit, ammo, weapons, etc.

let isGame = false;

function preload() {
    jsonMap = loadJSON('/js/mapJSON.json');
    images = loadImage('../img/terrainSet.png');
    spritesBlood = loadImage('../img/blood_spot.png');

    sounds.pistol = loadSound('../audio/gun_40_smith_wesson.wav');
    sounds.pistolReload = loadSound('../audio/gun_reload.mp3');
    sounds.music = {};
    //sounds.music.track1 = loadSound('../audio/Resident_Evil_movie_soundtrack_2008.mp3');
    //sounds.music.track2 = loadSound('../audio/Resident_Evil_Corp_Umbrella.mp3');

    playerSprites[0] = loadImage('../img/player/survivor-pistol.png');
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

    sounds.pistol.setVolume(0.4);


    //set standart inventory of player
    player.putThingInInventory(new Weapon({	//pistol
        name: 'pistol',
        kindBullets: 'postolAmmo',
        damage: 20,
        srcImage:'../img/axe.png',
        countBullets: 72,
        countBulletsInHolder: 10,
        width: 100,
        height: 30,
        timeBetweenShots: 1200
    }));
    player.currentObjInHand = player.inventory.getItems()[0];
    //add medicine kit to inventory
    player.putThingInInventory(new Thing({
        'name': 'medicineKit',
        'srcImage': '../img/heart.png',
        'value': 50,
        'pos': {x:0, y:0},
        'size': {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));

    //there are some things, as medicine kit or ammo or guns on map for testing
    things.push(new Thing({
        'name': 'medicineKit',
        'srcImage': '../img/heart.png',
        'value': 50,
        'pos': {x:100, y:100},
        'size': {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
    things.push(new Thing({
        'name': 'medicineKit',
        'srcImage': '../img/heart.png',
        'value': 50,
        'pos': {x:175, y:100},
        'size': {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
    things.push(new Thing({
        'name': 'postolAmmo',
        'srcImage': '../img/backpack.png',
        'value': 20,
        'pos': {x:250, y:100},
        'size': {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT}
    }));
    things.push(new Weapon({	//rifle
        name: 'rifle',
        kindBullets: 'rifleAmmo',
         damage: 120,
         srcImage: '../img/upg_spear.png',
         countBullets: 120,
         countBulletsInHolder: 30,
         width: 100,
         height: 40,
         timeBetweenShots: 200
 }));

    sounds.pistolReload.setVolume(0.4);
    //sounds.music.track1.setVolume(0.3);
    //sounds.music.track1.play();
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

        if(!sounds.pistol.isPlaying()) {
            sounds.pistol.play();
        }
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
        if(distantionFromAtoB(player.pos,item.pos) < item.size.width){
            player.putThingInInventory(item);
            obj.splice(index,1);
        }
    });
}

function distantionFromAtoB(a,b) {
    return Math.sqrt(Math.pow(a.x - b.x,2) 
         + Math.pow(a.y - b.y,2)) ; 
}