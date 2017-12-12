class Enemy {
    constructor(x, y, r) {
        this.r = r;
        this.pos = createVector(x, y);
        this.moveSpeed = 2;
        this.color = color(255);

        this.hp = 100;
        this.damageToPlayer = 0.5;
    }

    update(playerX, playerY, map) {
        if(this.isIntersects(playerX, playerY)) {
            this.damageToPlayer = 0.5;
        } else {
            this.damageToPlayer = 0;
        }

        fill(this.color);
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

        handleCollisionWalls(this.pos, map.map);

        return this.damageToPlayer;
        
    }

    changeColor() {
        this.color = color(random(255), random(255), random(255));
    }

    isIntersects(playerX, playerY) {
        let d = dist(this.pos.x, this.pos.y, playerX, playerY);
        if(d < 50) {
            return true;
        }
        return false;
    }
}