class Thing {
    constructor(kit) {
        this.name = kit.name;
        this.value = kit.value;
        this.pos = kit.pos;
        this.imagePos = kit.imagePos;
        this.size = kit.size;
        this.img = loadImage(ITEMS_SPRITE);
        this.count = 1;
    }
    
    update() {
        image(this.img,
            this.pos.x,
            this.pos.y,
            ITEM_SIZE,
            ITEM_SIZE,
            this.imagePos.x, 
            this.imagePos.y,
            60,
            60,
        );
    }

    addThing() {
        this.count++;
    }
}