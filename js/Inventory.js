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

        rect(-90,225, 60,60);    //2
        rect(-80, 240, this.objects[1].size.width, this.objects[1].size.height);
        rect(-30,225, 60,60);    //3
        rect(30,225, 60,60);     //4
        rect(90,225, 60,60);     //5 

		pop();
    }
    
    clearCellStrokeWidth() {
        
    }
}