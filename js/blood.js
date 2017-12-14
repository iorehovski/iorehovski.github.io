class Blood {
    constructor(spritesObj) {
        this.spritesSet = spritesObj;
        this.bloodList = [];
        this.lifeTimeTimer = 500;
    }

    createBloodSpot(posX, posY) {
        let obj = {
            x: posX,
            y: posY,
            render: function() {
                image(this.spritesSet, this.x, this.y);
            }
        };
        this.bloodList.push(obj);
    }

    update() {
        for(let i = 0, len = this.bloodList.length; i < len; i++) {
            this.bloodList[i].render();
        }
    }
}

class BloodItem {
    constructor() {
        
    }
} 