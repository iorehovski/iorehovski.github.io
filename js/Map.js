class Map {
    constructor(objOrigin, objMapSize) {
        this.name = name;
        this.origin = {'x': objOrigin.x, 'y': objOrigin.y};
        this.map = null;
    }

    createMap() {
        let tmpMap = [];
        let tileX = 0;
        let tileY = 0;

        for(let x = 0; x < MAP_SIZE_X; x++) {
            tmpMap[x] = [];
            for(let y = 0; y < MAP_SIZE_Y; y++) {
                tmpMap[x][y] = new Tile(tileX, tileY);
                tileY += TILE_H;
            }
            tileX += TILE_W;
            tileY = 0;
        }
        this.map = tmpMap;
    }

    update(pX, pY) {
        fill(GRASS_COLOR);

        let playerTileX = (pX / TILE_W) | 0;
        let playerTileY = (pY / TILE_H) | 0;

        let lW = playerTileX - REND_MAP_LEFT;
        let rW = playerTileX + REND_MAP_RIGHT;
        let uH = playerTileY - REND_MAP_UP;
        let dH = playerTileY + REND_MAP_DOWN;

        if(playerTileX < this.map.length / 2){
            if(lW < 0){
                lW = 0;
            }
        } else {
            if(rW > this.map.length){
                rW = this.map.length;
            }
        }

        if(playerTileY < this.map[0].length / 2){
            if(uH < 0){
                uH = 0;
            }
        } else {
            if(dH > this.map[0].length){
                dH = this.map[0].length;
            }
        }

        for(let i = lW; i < rW; i++) {
            for(let j = uH; j < dH; j++) {
                this.map[i][j].update();
            }
        }
    }
}

