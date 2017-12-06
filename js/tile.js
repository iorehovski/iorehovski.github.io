class Tile {
    constructor(x, y) {
        this.pos = {'x': x, 'y': y};
    }

    update() {
        rect(this.pos.x, this.pos.y, TILE_W, TILE_H);
    }
}