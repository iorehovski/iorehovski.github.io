function handleCollisionWalls(objPos, map) {

    const objTile = determineObjectTilePos(objPos, map);
    
    handleCollision(
        objPos, 
        map, 
        objTile.playerTileX, 
        objTile.playerTileY, 
        objTile.lW, 
        objTile.rW, 
        objTile.uH, 
        objTile.dH
    );
}

function handleCollision(objPos, map, playerTileX, playerTileY, lW, rW, uH, dH) {
    //check and handle wall collisions 
    //up
    if(map[uH][playerTileX].spriteID == 9) {
        if(objPos.y <= map[uH][playerTileX].pos.y + TILE_H + 10) {
            objPos.y = map[uH][playerTileX].pos.y + TILE_H + 10;
        }
    }
    //right
    if(map[playerTileY][rW].spriteID == 9) {
        if(objPos.x >= map[playerTileY][rW].pos.x - 10) {
            objPos.x = map[playerTileY][rW].pos.x - 10;
        }
    }
    //down
    if(map[dH][playerTileX].spriteID == 9) {
        if(objPos.y >= map[dH][playerTileX].pos.y - 10) {
            objPos.y = map[dH][playerTileX].pos.y - 10;
        }
    }
    //left
    if(map[playerTileY][lW].spriteID == 9) {
        if(objPos.x <= map[playerTileY][lW].pos.x + TILE_W + 10) {
            objPos.x = map[playerTileY][lW].pos.x + TILE_W + 10;
        }
    }
}

function determineObjectTilePos(objPos, map) {

    let obj = {};

    let playerTileX = (objPos.x / TILE_W) | 0;
    let playerTileY = (objPos.y / TILE_H) | 0;

    let lW = playerTileX - 1;
    let rW = playerTileX + 1;
    let uH = playerTileY - 1;
    let dH = playerTileY + 1;

    if(playerTileX < map[0].length / 2){
        if(lW < 0){
            lW = 0;
        }
    } else {
        if(rW > map[0].length){
            rW = map[0].length;
        }
    }

    if(playerTileY < map.length / 2){
        if(uH < 0){
            uH = 0;
        }
    } else {
        if(dH > map.length){
            dH = map.length;
        }
    }

    obj.playerTileX = playerTileX;
    obj.playerTileY = playerTileY;

    obj.lW = lW;
    obj.rW = rW;
    obj.uH = uH;
    obj.dH = dH;

    return obj;

}