class Thing {
    constructor(kit) {
        this.name = kit.name;
        this.value = kit.value;
        this.pos = kit.pos;
        this.imagePos = kit.imagePos;
        this.size = kit.size;
        this.img = loadImage(SPRITE_THINGS);
        this.count = 1;
    }
    
    update() {
        image(this.img,
            this.pos.x,
            this.pos.y,
            INVENTORY_THING_SIZE,
            INVENTORY_THING_SIZE,
            this.imagePos.x, 
            this.imagePos.y,
            INVENTORY_THING_SIZE,
            INVENTORY_THING_SIZE);
    }
    addThing() {
        this.count++;
    }
}