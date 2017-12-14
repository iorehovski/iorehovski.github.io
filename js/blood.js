class BloodItem {
    constructor(posX, posY, ) {
        this.x = posX;
        this.y = posY;
    }

    render() {
        push();
        //angleMode(DEGREES);
        imageMode(CENTER);
        image(spritesBlood, this.x, this.y);
        pop();
    }
    
} 

class Blood {
    constructor() {
        this.bloodList = [];
        this.lifeTimeTimer = 500;
    }

    createBloodSpot(posX, posY) {
        this.bloodList.push(new BloodItem(posX, posY));
    }

    update() {
        for(let i = 0, len = this.bloodList.length; i < len; i++) {
            this.bloodList[i].render();
        }
    }
}
