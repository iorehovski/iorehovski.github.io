class BloodItem {
    constructor(posX, posY) {
        this.x = posX;
        this.y = posY;
        this.lifeTime = 500;
        this.angle = Math.PI/Math.random() * 3;
    }

    update() {
        push();
        imageMode(CENTER);
       
        translate(this.x, this.y);
        rotate(this.angle);
        image(spritesBlood, 0, 0);
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
