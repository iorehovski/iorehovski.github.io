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

                if(d < 50) {
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

