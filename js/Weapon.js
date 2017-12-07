class Weapon {
    constructor(srcImage,bCount) {
        this.damage = 0;
        //this.img = loadImage(srcImage);
        this.position = {'x': 0, 'y': 25};
        this.bulletsCount = bCount;
        this.bullets = new Bullet();
    }

    update() {
        fill('#282828');
        rect(this.position.x,this.position.y, 20, 8);
        //image(this.img,this.position.x,this.position.y);
    }
    
    makeShot(pos) {
        if(this.bulletsCount > 0) {
            this.bulletsCount--;
            var x1 =  pos.x; // gun x
            var y1 =  pos.y; // gun y
            var x2 = mouseX + pos.x - WIN_WIDTH_HALF;  //mouse x
            var y2 = mouseY + pos.y - WIN_HEIGHT_HALF; //mouse y
            var angleBullet = atan2(y2 - y1, x2 - x1);
            console.log('make shoot');
            this.bullets.pushBullet({
                x: x1,
                y: y1,
                angle: angleBullet,
                v: 1000         //speed bullet
            });
        }else {
            //reload bullets
            setTimeout(this.recharge.bind(this), 2000);
        }
    }
    recharge() {
        this.bulletsRoom = this.bulletsCount;
    }
}