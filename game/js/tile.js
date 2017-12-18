class Tile {
    constructor(x, y, imgX, imgY, spriteID) {
        this.pos = {'x': x, 'y': y};
        this.imgPos = {'x': imgX, 'y': imgY};
        this.spriteID = spriteID;

        switch(spriteID) {
            case 17: 
                this.healthValue = Infinity;
                this.solid = true;
                break;
            case 9: 
                this.healthValue = 1000;
                this.solid = true;
                break;
            default:
                break;
        }
    }

    update() {
        if(this.healthValue <= 0) {
            this.imgPos.x = 100;
            this.imgPos.y = 200;
            this.spriteID = 10;
            delete this.solid; 
        }

        image(images,
            this.pos.x,
            this.pos.y, 
            TILE_W, 
            TILE_H + 2, 
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