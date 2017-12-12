class Tile {
    constructor(x, y, imgX, imgY, spriteID) {
        this.pos = {'x': x, 'y': y};
        this.imgPos = {'x': imgX, 'y': imgY};
        this.spriteID = spriteID;
    }

    update() {
        if(this.spriteID == 9) {

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

    debugUpdate() {
        fill(255, 50);
        rect(this.pos.x, this.pos.y, TILE_W, TILE_H);
    }
}