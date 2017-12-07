class Weapon {
    constructor(weapon) {
        this.damage = weapon.damage;
        //this.img = loadImage(weapon.srcImage);
        this.position = {'x': 0, 'y': 25};
        this.bulletsCount = weapon.countBullets;
        this.countBulletsInHolder = weapon.countBulletsInHolder;
        this.bulletsHolder = weapon.countBulletsInHolder;
        this.reload = false;
        this.canShoot = true;

        this.bullets = new Bullet();
    }

    update() {
        fill('#282828');
        rect(this.position.x,this.position.y, 20, 8);
        //image(this.img,this.position.x,this.position.y);
    }
    
    makeShot(pos) {
        if(this.bulletsHolder > 0 && this.canShoot) {

            //delay between shots
            this.canShoot = false;
            setTimeout(this.allowShoot.bind(this), 100);

            this.bulletsHolder--;
            var x1 =  pos.x; // gun x
            var y1 =  pos.y; // gun y
            var x2 = mouseX + pos.x - WIN_WIDTH_HALF;  //mouse x
            var y2 = mouseY + pos.y - WIN_HEIGHT_HALF; //mouse y
            var angleBullet = atan2(y2 - y1, x2 - x1);
            this.bullets.pushBullet({
                x: x1,
                y: y1,
                angle: angleBullet,
                v: 1000         //speed bullet
            });
        }else if(this.bulletsHolder == 0 && this.bulletsCount > 0 && !this.reload) {  //update bullets holder
            this.reload = true;
            setTimeout(this.recharge.bind(this), 2000);
        }
    }
    
    recharge() {
        this.bulletsHolder = this.countBulletsInHolder;
        this.bulletsCount -= this.countBulletsInHolder;
        this.reload = false;
    }

    allowShoot(){
        this.canShoot = true;
    }

}