class Generation {
    constructor(map) {
        this.map = map;
        this.items = [];
    }

    generateEnemy(chance) {

    }

    //generate ammo, weapons, aid in map
    generateItems(chance) {
        
    }

    update() {
        for(let i = 0, len = this.items.length; i < len; i++) {
            this.items[i].update();
            if(distantionFromAtoB({x: player.pos.x + INVENTORY_THING_SIZE / 2, y:player.pos.y + INVENTORY_THING_SIZE / 2},this.items[i].pos) < INVENTORY_THING_SIZE * 2){
                //put thing in inventory and remove it from map
                if(player.putThingInInventory(this.items[i])){
                    this.items.splice(i, 1);
                }
                len--;
            }
        }
    }
    
    distantionFromAtoB(a,b) {
        return Math.sqrt(((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y))); 
    }

    putMedicineKitOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'medicineKit',
            value: 50,
            pos: {x: xStart, y: yStart},
            imagePos: {x: 240, y: 0},
            size: {width: 60, height: 60},
        }));
    }
    
    putPistolAmmoOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'glock17Ammo',
            value: 20,
            pos: {x:xStart, y:yStart},
            imagePos: {x: 0, y: 0},
            size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT},
            imgPath: ITEMS_SPRITE,
        }));
    }
    
    putAk47AmmoOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'ak47Ammo',
            value: 20,
            pos: {x:xStart, y:yStart},
            imagePos: {x: 120, y: 0},
            size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT},
        }));
    }
    
    putM4A1AmmoOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'm16Ammo',
            value: 20,
            pos: {x:xStart, y:yStart},
            imagePos: {x: 60, y: 0},
            size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT},
        }));
    }
    
    putAWPAmmoOnMap(xStart, yStart) {
        this.items.push(new Thing({
            name: 'awpAmmo',
            value: 20,
            pos: {x:xStart, y:yStart},
            imagePos: {x: 180, y: 0},
            size: {width: MEDICINE_KIT_WIDTH, height: MEDICINE_KIT_HEIGHT},
        }));
    }
    
    putPistolOnMap(xStart, yStart) {
        this.items.push(new Weapon({	//pistol
            name: 'glock17',
            kindBullets: 'glock17Ammo',
            damage: 40,
            countBullets: 72,
            countBulletsInHolder: 10,
            imagePos: {x: 0, y: 0},
            pos: {x: xStart, y: yStart},
            timeBetweenShots: 1200
        }));
    }
    
    putAk47OnMap(xStart, yStart) {
        this.items.push(new Weapon({	//pistol
            name: 'ak47',
            kindBullets: 'ak47Ammo',
            damage: 100,
            countBullets: 60,
            countBulletsInHolder: 30,
            imagePos: {x: 100, y: 0},
            pos: {x: xStart, y: yStart},
            timeBetweenShots: 1200
        }));
    }
    
    putM4A1OnMap(xStart, yStart) {
        this.items.push(new Weapon({	//pistol
            name: 'm4a1',
            kindBullets: 'm4a1Ammo',
            damage: 80,
            countBullets: 60,
            countBulletsInHolder: 30,
            imagePos: {x: 200, y: 0},
            pos: {x: xStart, y: yStart},
            timeBetweenShots: 160
        }));
    }
    
    putAWPOnMap(xStart, yStart) {
        this.items.push(new Weapon({	//pistol
            name: 'awp',
            kindBullets: 'awpAmmo',
            damage: 600,
            countBullets: 15,
            countBulletsInHolder: 1,
            imagePos: {x: 300, y: 0},
            pos: {x: xStart, y: yStart},
            timeBetweenShots: 2800
        }));
    }
}

