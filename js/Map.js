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

    update() {
        fill(GRASS_COLOR);

        for(let i = 0; i < MAP_SIZE_X; i++) {
            for(let j = 0; j < MAP_SIZE_Y; j++) {
                this.map[i][j].update();
            }
        }
    }
}

