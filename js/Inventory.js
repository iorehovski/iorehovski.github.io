class Inventory {
    constructor() {
        this.inventoryThings = [];
        this.inventoryCeil = [
            {x:-150,y:225,empty: true},
            {x:-90,y:225,empty: true},
            {x:-30,y:225,empty: true},
            {x:30,y:225,empty: true},
            {x:90,y:225,empty: true}
        ];
        this.ceilSize = 60;
    }

    pushItem(itemToAdd) {

        let added = false;
        let addGunToGun = false;
        this.inventoryCeil.forEach(function(item, index, obj) {
            if(added || addGunToGun){
                return;
            }
            if(!item.empty){
                if(this.inventoryThings[index] instanceof Weapon && itemToAdd instanceof Thing) {
                    if(itemToAdd.name == this.inventoryThings[index].kindBullets){
                        this.inventoryThings[index].bulletsCount += itemToAdd.value;
                        added = true;
                    }
                }else if(this.inventoryThings[index] instanceof Thing && itemToAdd instanceof Thing) {
                    if(itemToAdd.name == this.inventoryThings[index].name){
                        this.inventoryThings[index].addThing();
                        added = true;
                    }
                }else if(this.inventoryThings[index] instanceof Weapon && itemToAdd instanceof Weapon){
                    if(itemToAdd.name == this.inventoryThings[index].name){
                        added = false;
                        addGunToGun = true;
                    }
                }
            }else {
                if(itemToAdd.name == 'medicineKit' || itemToAdd instanceof Weapon ){
                    this.inventoryThings[index] = itemToAdd;
                    this.inventoryCeil[index].empty = false;
                    added = true;
                }
            }
        }.bind(this));
        if(added){
            return true;
        }
        return false;
    }

    getItem(id) {
        return  id < this.inventoryThings.length ? this.inventoryThings[id] : 0;
    }

    removeItem(id) {
       
        if (id < this.inventoryThings.length) {
            this.inventoryThings.splice(id, 1);
            
            for(let i = this.inventoryCeil.length - 1; i >= 0; i--) {
                if(!this.inventoryCeil[i].empty) {
                    this.inventoryCeil[i].empty = true;
                    break;
                }
            }
        }
    }

    update(obj) {
		push();

		translate(obj.pos.x, obj.pos.y);
        colorMode(HSL);
        strokeWeight(2);
        stroke('rgba(35, 35, 35, 1)');
        fill(50, 0.5); 
        this.inventoryCeil.forEach(function(item, index, object) {
            let currentThing = this.inventoryThings[index];
            if(obj.currentThingInHand == currentThing && currentThing) {
                fill(60, 0.7);
                rect(item.x,item.y,this.ceilSize,this.ceilSize);
            }else {
                fill(50, 0.5);
                rect(item.x,item.y,this.ceilSize,this.ceilSize);
            }
            
            if(!item.empty && currentThing) {
                //shwo gun sprite in inventory panel
                image(currentThing.img,item.x + 10, 
                    item.y + 5, 
                    this.ceilSize*2/3, 
                    this.ceilSize*2/3,
                    currentThing.imagePos.x,
                    currentThing.imagePos.y,
                    INVENTORY_THING_SIZE,
                    INVENTORY_THING_SIZE
                );
                    
                if(currentThing instanceof Weapon) {
                    fill('#fff');
                    text(currentThing.bulletsCount + currentThing.bulletsHolder, item.x + 25, item.y + 55);
                }else {
                    fill('#fff');
                    text(currentThing.count, item.x + 25, item.y + 55);
                }
            }
        }.bind(this));

        if(player.currentObjInHand instanceof Weapon) {
            fill('#fff');
            textSize(30);
            text(player.currentObjInHand.bulletsCount + '/' + player.currentObjInHand.bulletsHolder,WIN_WIDTH_HALF/2 + 80,280);
        }

		pop();
    }
    
    clearCellStrokeWidth() {
        
    }

}