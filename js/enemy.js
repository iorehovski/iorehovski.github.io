class Enemy {
    constructor(x, y, r) {
        this.r = r;
        this.pos = {'x': x, 'y': y};
        this.moveSpeed = 2;
    }

    update(playerX, playerY) {
        let dx = playerX - this.pos.x;
        let dy = playerY - this.pos.y;

        let moveX = 0;
        let moveY = 0;

        if(dx > 0) {
            this.pos.x += 1;
            moveX += 1;
        } else if(dx < 0) {
            this.pos.x -= 1;
        }

        if(dy > 0) {
            this.pos.y += 1;
        } else if(dy < 0) {
            this.pos.y -= 1;
        }
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
}