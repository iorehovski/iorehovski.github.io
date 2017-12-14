class Weapon {
    constructor(weapon) {
        this.name = weapon.name;
        this.kindBullets = weapon.kindBullets;
        this.damage = weapon.damage;
        this.img = loadImage(SPRITE_THINGS);
        this.pos = weapon.pos
        this.size = {'width': weapon.width, 'height': weapon.height};

        this.bulletsCount = weapon.countBullets;
        this.countBulletsInHolder = weapon.countBulletsInHolder;
        this.bulletsHolder = weapon.countBulletsInHolder;

        this.reloadIsNow = false;
        this.reload = 0;
        this.timeReload = 3530;
        
        this.timeBetweenShots = weapon.timeBetweenShots;
        this.canShoot = true;

        this.bullets = new Bullet();
    }

    update() {
        fill('#282828');
        //rotate(-0.07);  //rotate gun
        image(this.img,
            this.pos.x,
            this.pos.y,
            this.size.width, 
            this.size.height);
        //image(,this.pos.x,this.pos.y);
    }
    
    makeShot(player) {
        console.log(this.canShoot);
        if(this.bulletsHolder > 0 && this.canShoot && !this.reloadIsNow) {
           
            
            if(!sounds.pistol.isPlaying()) {
                sounds.pistol.play();
            }

             //delay between shots
            this.canShoot = false;
            setTimeout(this.allowShoot.bind(this), this.timeBetweenShots);

            this.bulletsHolder--;
            

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
                lifeTime: 30,
            });
        }
        if(this.bulletsHolder == 0 && this.bulletsCount > 0 &&  !this.reloadIsNow) {  //update bullets holder
            this.initRecharge();// 90*
        }
    }
    
    initRecharge() {
        if(!this.reloadIsNow){
            sounds.pistolReload.play();
            this.reload = -Math.PI / 2; 
            this.reloadIsNow = true;
            setTimeout(this.recharge.bind(this), this.timeReload);
        } 
    }
    recharge() {
        if(this.bulletsCount > this.countBulletsInHolder) {
            if(this.bulletsHolder) {
                this.bulletsCount -= this.countBulletsInHolder - this.bulletsHolder;
                this.bulletsHolder = this.countBulletsInHolder;
            }
            else{
                this.bulletsCount -= this.countBulletsInHolder;
                this.bulletsHolder = this.countBulletsInHolder;
            }
        }
        else {
            this.bulletsHolder = this.bulletsCount;
            this.bulletsCount = 0;
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

}