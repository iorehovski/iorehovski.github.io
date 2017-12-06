class Bullet {
    constructor(x,y,mousePosX,mousePosY) {
        this.bulletSpeed  = 20;
        this.xStart = x;
        this.yStart = y;
        this.x = x;
        this.y = y;
        this.dX = Math.abs(x - mousePosX);
        this.dY = Math.abs(y - mousePosY);
        this.signX = x < mousePosX ?  this.bulletSpeed : - this.bulletSpeed;
		this.signY = y < mousePosY ?  this.bulletSpeed : - this.bulletSpeed;
        this.error = this.dX - this.dY;
        this.error2 = 0;
    }

    swap(first,second) {
        let tmp = first;
        first = second;
        second = tmp;
    }

    setDirection() {
        this.error2 = this.error * 2;
        if (this.error2 > -this.dY) {
            this.error -= this.dY;
            this.x += this.signX;
        }
        if (this.error2 < this.dX) {
            this.error += this.dX;
            this.y += this.signY;
        }
    }

    isLife(){
        if(this.x < this.xStart - WIN_WIDTH_HALF || this.x > this.xStart + WIN_WIDTH_HALF || this.y < this.yStart - WIN_HEIGHT_HALF || this.y > this.yStart + WIN_HEIGHT_HALF) {
            return false;
        }
        return true;
    }

    drawBullet() {
        ellipse(this.x,this.y,15,15)
    }
    update() {
        this.setDirection();
        this.drawBullet();
    }
}