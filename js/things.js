class Thing {
    constructor(kit) {
        this.name = kit.name;
        this.value = kit.value;
        this.pos = kit.pos;
        this.size = kit.size;
        this.img = loadImage(kit.srcImage);
        this.count = 1;
    }
    
    update() {
        image(this.img,this.pos.x,this.pos.y,  this.size.width, this.size.height);
    }
    addThing() {
        this.count++;
    }
}