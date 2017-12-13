class Inventory {
    constructor() {
        this.objects = [];
    }

    pushItem(item) {
        if(this.objects.length < 5){
            this.objects.push(item);
        }
    }

    getItems() {
        return this.objects;
    }

    removeItem(id) {
        if (id < this.objects.length){
            this.objects.splice(id,1);
        }
    }

    update(obj) {
		push();

		translate(obj.pos.x, obj.pos.y);
        colorMode(HSL);
        strokeWeight(2);
        stroke('rgba(35, 35, 35, 1)');
        fill(50, 0.5);

        rect(-150,225, 60,60);   //1 
        rect(-150, 240, this.objects[0].size.width, this.objects[0].size.height);
        if(this.objects[0] instanceof Weapon) {
            fill('#fff');
            text(this.objects[0].bulletsCount + this.objects[0].bulletsHolder,-140,280);
        }
        fill(50, 0.5);
        rect(-90,225, 60,60);    //2
        rect(-80, 240, this.objects[1].size.width, this.objects[1].size.height);
        if(this.objects[0] instanceof Weapon) {
            fill('#fff');
            text(this.objects[1].bulletsCount + this.objects[1].bulletsHolder,-80,280);
        }
        fill(50, 0.5);
        rect(-30,225, 60,60);    //3
        rect(30,225, 60,60);     //4
        rect(90,225, 60,60);     //5 



        if(player.currentObjInHand instanceof Weapon) {
            fill('#fff');
            textSize(30);
            text(player.currentObjInHand.bulletsCount + '/' + player.currentObjInHand.bulletsHolder,500,280);
        }

		pop();
    }
    
    clearCellStrokeWidth() {
        
    }
}