class Thing {
    constructor(kit) {
        this.name = kit.name;
        this.value = kit.value;
        this.pos = kit.pos;
        this.imagePos = kit.imagePos;
        this.size = kit.size;
        this.img = loadImage(ITEMS_SPRITE);
        this.itemType = kit.itemType;
        this.count = 1;
    }
    
    update() {

        push();
        imageMode(CENTER);
        image(this.img,
            this.pos.x,
            this.pos.y,
            this.size.w,
            this.size.h,
            this.imagePos.x, 
            this.imagePos.y,
            60,
            60,
        );
        pop();
    }

    addThing() {
        this.count++;
    }
}