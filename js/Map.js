class Map {
    constructor(objOrigin, objMapSize) {
        this.name = name;
        this.origin = {'x': objOrigin.x, 'y': objOrigin.y};
        this.map = null;
        this.imagesSet = null;
    }

    createMap(json) {
        const MAP_SIZE = MAP_SIZE_X * MAP_SIZE_Y;
        let tmpMap = [];
        let tileX = 0;
        let tileY = 0;

        /*
        for(let x = 0; x < MAP_SIZE_X; x++) {
            tmpMap[x] = [];
            for(let y = 0; y < MAP_SIZE_Y; y++) {
                tmpMap[x][y] = new Tile(tileX, tileY);
                tileY += TILE_H;
            }
            tileX += TILE_W;
            tileY = 0;
        }
        */

        let jsonIndex = 0;
        let imgID = 0;
        for(let i = 0; i < MAP_SIZE_Y; i++) {
            tmpMap[i] = [];
            for(let j = 0; j < MAP_SIZE_X; j++) {
                let imgX = 100, imgY = 100;
                if(json.layers[0].data[jsonIndex] == 1) {
                    imgX = 0;
                    imgY = 0;
                }
                tmpMap[i][j] = new Tile(tileX, tileY, imgX, imgY);

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

