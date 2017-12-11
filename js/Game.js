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
        'x': 2500,
        'y': 1700});
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

    if(randInt(0, 1000) == 0) {
        enemies.push(new Enemy(randInt(0, MAP_SIZE_X * TILE_W), randInt(0, MAP_SIZE_Y * TILE_H), ENTITY_DIAMETR / 2));
    }

    checkCollisionEnemies(enemies);

    //update enemies
    enemies.forEach(function(itemEnemy,index,obj) {
        let damageValue = itemEnemy.update(player.pos.x, player.pos.y);
        player.healthBar.value -= damageValue;
        //check player hp value
        if(player.getHealthValue() <= 0) {
        } else {
            player.healthBar.w -= damageValue;
        }

        //check bullet hit the enemy
        if(player.currentObjInHand instanceof Weapon) {
            let bullets = player.currentObjInHand.bullets.getBullets();
            bullets.forEach(function(itemBullet,indexBullet,objBullets) {
                if( Math.sqrt(Math.pow(itemBullet.x - itemEnemy.pos.x,2) + Math.pow(itemBullet.y - itemEnemy.pos.y,2)) < (itemEnemy.r - itemBullet.bulletsLength*2)){
                    objBullets.splice(indexBullet, 1);
                    itemEnemy.hp -= player.currentObjInHand.damage;
                }
            });
        }

        if(itemEnemy.hp <= 0){
            obj.splice(index, 1);
        }
    });

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
    if(player.currentObjInHand) {
        player.currentObjInHand.makeShot(player);
    }
};