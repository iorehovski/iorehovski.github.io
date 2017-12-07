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
            for(let j = i; j < eLen; j++) {
                let d = dist(
                    enemies[i].pos.x,
                    enemies[i].pos.y,
                    enemies[j].pos.x,
                    enemies[j].pos.y,
                );
                
                //console.log(d);
                if(d < 75) {
                }
            }
        }
    }
}