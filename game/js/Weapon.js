class Weapon {
    constructor(weapon) {
        this.name = weapon.name;
        this.bulletType = weapon.bulletType;
        this.damage = weapon.damage;
        this.img = loadImage(GUN_SPRITE_SHEET);
        this.pos = weapon.pos;
        this.imagePos = weapon.imagePos;

        this.bulletAmount = weapon.bulletAmount;
        this.bulletMagazineCapacity = weapon.bulletMagazineCapacity;
        this.bulletCurrentMagazine = weapon.bulletMagazineCapacity;

        this.reloadIsNow = false;
        this.reload = 0;
        this.timeReload = 3530;
        
        this.timeBetweenShots = weapon.timeBetweenShots;
        this.canShoot = true;

        this.bullets = new Bullet();

        this.size = weapon.size;
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
            INVENTORY_THING_SIZE,
            INVENTORY_THING_SIZE
        );
        pop();
    }
    
    makeShot(player) {
        if(this.bulletCurrentMagazine > 0 && this.canShoot && !this.reloadIsNow) {
            
            this.playGunShotSound(player.currentWeaponInHand.name);
             //delay between shots
            this.canShoot = false;
            setTimeout(this.allowShoot.bind(this), this.timeBetweenShots);

            this.bulletCurrentMagazine--;
            

            //player property
            var xp = player.pos.x;
            var yp = player.pos.y;

            var x2 = mouseX + player.pos.x - WIN_WIDTH_HALF;  //mouse x
            var y2 = mouseY + player.pos.y - WIN_HEIGHT_HALF; //mouse y
            var angleBullet = atan2(y2 - yp, x2 - xp);

            //var x1 = xp + player.r * Math.sin(- angleP + 1); // gun x
            //var y1 = yp + player.r * Math.cos(- angleP + 1); // gun y
            //var angleBullet = atan2(y2 - y1, x2 - x1);

            this.bullets.pushBullet({
                x: xp,
                y: yp,
                angle: angleBullet,
                v: 1800,            //bullet speed
                bulletsLength: 10,  //bullet lenght
                bulletsColor: BULLET_COLOR, //color
                lifeTime: 35,
                penetrationCapacity: player.currentWeaponInHand.damage / 2
            });
        }
        if(this.bulletCurrentMagazine <= 0 && this.bulletAmount > 0 && !this.reloadIsNow) {  //update bullets holder
            this.initRecharge(player.currentWeaponInHand.name);
        }
    }
    
    initRecharge(gunName) {
        if(!this.reloadIsNow && this.bulletAmount && this.bulletCurrentMagazine != this.bulletMagazineCapacity){
            this.playGunReloadSound(gunName);
            this.reload = -Math.PI / 2; 
            this.reloadIsNow = true;
            setTimeout(this.recharge.bind(this), this.timeReload);
        } 
    }
    recharge() {
        if(this.bulletAmount > this.bulletMagazineCapacity) {
            this.bulletAmount += this.bulletCurrentMagazine - this.bulletMagazineCapacity;
            this.bulletCurrentMagazine = this.bulletMagazineCapacity;
        } else if(this.bulletAmount + this.bulletCurrentMagazine > this.bulletMagazineCapacity){
            this.bulletAmount = (this.bulletAmount + this.bulletCurrentMagazine) % this.bulletMagazineCapacity;
            this.bulletCurrentMagazine = this.bulletMagazineCapacity;
        } else {
            this.bulletCurrentMagazine += this.bulletAmount;
            this.bulletAmount = 0;
        }
        this.reloadIsNow = false;
        this.reload = 0;
    }

    updateRecharge(pos) {
        let iRecharge = Math.PI / this.timeReload * 33;
        this.reload += iRecharge;

        push();

        ellipseMode(CENTER);
        translate(pos.x, pos.y);
        colorMode(HSL);
        noFill();
        strokeWeight(5);
        stroke('rgba(255, 255, 255, 0.8)');
        arc(60, -60, 25, 25, -Math.PI / 2, this.reload);

        pop();
    }

    allowShoot() {
        this.canShoot = true;
    }

    isBulletHolderEmpty() {
        if(this.bullets.bulletsList.length > 0) {
            return false;
        }
        return true;
    }

    playGunShotSound(weaponName) {
		switch(weaponName) {
			case 'glock17': 
                sounds.glock17.play();
				break;
			case 'ak47':
                sounds.ak47.play();
				break;
			case 'm4a1': 
                sounds.m4a1.play();
				break;
			case 'awp':
                sounds.awp.play();
				break;
		}
    }
    
    playGunReloadSound(weaponName) {
		switch(weaponName) {
			case 'glock17': 
                sounds.glock17Reload.play();
				break;
			case 'ak47':
                sounds.ak47Reload.play();
				break;
			case 'm4a1': 
                sounds.m4a1Reload.play();
				break;
			case 'awp':
                sounds.awpReload.play();
				break;
		}
	}
}