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