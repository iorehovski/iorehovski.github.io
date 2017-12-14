class BloodItem {
    constructor(posX, posY, ) {
        this.x = posX;
        this.y = posY;
        this.lifeTime = 500;
    }

    update() {
        push();
        //angleMode(DEGREES);
        imageMode(CENTER);
        image(spritesBlood, this.x, this.y);
        pop();

        this.lifeTime--;
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
            this.bloodList[i].update();
            if(this.bloodList[i].lifeTime <= 0) {
                this.bloodList.splice(i, 1);
                len--;
            }
        }
    }
}
