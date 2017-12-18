class Enemy {
    constructor(x, y, r, spritesMove) {
        this.r = r;
        this.pos = createVector(x, y);
        this.moveSpeed = 7;
        this.color = color(255);
        this.animation = new Animation(spritesMove);

        this.hp = 100;
        this.damage = 0;
        this.damageToWall = 2;

        this.moveQueue = [];

        this.isOnScreen = false;
    }

    update(playerPos, map) {

        let moveX = 0;
        let moveY = 0;
       
        // if(dy >= 0) {
        //     moveY = this.pos.y * 2;
        // } else{
        //     moveY = this.pos.y / 2;
        // }

        let dx = playerPos.x - this.pos.x;
        let dy = playerPos.y - this.pos.y;

        if(this.pos.x <= 400 || playerPos.x <= 400 ||  (Math.abs(dx) <= 100)) {
            if(dx > 0) {    
                this.pos.x += 1;
            } else if(dx < 0) {
                this.pos.x -= 1;
            }

            if(dy > 0) {
                this.pos.y += 1;
            } else{
                this.pos.y -= 1;
            }
        }
        if(this.moveQueue.length == 0) {
            
            let arrX = [this.pos.x, (this.pos.x + playerPos.x)  / 1, playerPos.x];
            let arrY = [this.pos.y,  (this.pos.y + playerPos.y) / 1, playerPos.y];

            let nPoints = arrX.length;
            let resultY = 0,
                s = 0;

            let currentX = this.pos.x;
            for(let k = 0; k < 15; k++) {
                if(currentX < 400 || playerPos.x < 400 || Math.abs( playerPos.x - currentX ) < 100) { 
                    break;
                 }
                resultY = arrY[0];
                for(let i = 1; i < nPoints; i++) {
                    let difference = 0;
                    for(let j = 0; j <= i; j++) {
                        s = 1;
                        for(let m = 0; m <= i; m++) {
                            if(m != j) {
                                s *= arrX[j] - arrX[m];
                            }
                        }
                        if(s != 0) {
                            difference += arrY[j] / s;
                        }
                    }
                    for(let m = 0; m < i; m++) {
                        let findX = currentX;
                        difference *= (findX - arrX[m]);
                    }
                    resultY += difference;
                }

                this.moveQueue.push(createVector(currentX,resultY));

                if(dx > 0) {    
                    currentX += 1;
                } else if(dx <= 0) {
                    currentX -= 1;
                }
            }
            // console.log(this.moveQueue);
        }else {
            this.pos.x = this.moveQueue[0].x;
            this.pos.y = this.moveQueue[0].y;
            this.moveQueue.splice(0, 1);
        }
      
        // this.pos.y = resultY;
        // console.log('x: ' + this.pos.x + ' y:' + resultY);
        // if(dy >= 0) {
        //     this.pos.y += 1;
        // } else{
        //     this.pos.y -= 1;
        // }
       
        this.checkCollidingWalls(map);

        if(this.isOnScreen) {
            this.animation.renderZombieMove(this.pos.x, this.pos.y, playerPos);
            //this.render();

            if(this.isIntersects(playerPos)) {
                this.damage = 0.5;
            } else {
                this.damage = 0;
            }
        }
    }

    render() {
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }

    checkCollidingWalls(map) {
        let collTile = handleCollisionWalls(this.pos, map, 25);
        
        if(collTile.isCollide) {
            map[collTile.tileY][collTile.tileX].healthValue -= this.damageToWall;
        }
    }

    changeColor() {
        this.color = color(random(255), random(255), random(255));
    }

    isIntersects(playerPos) {
        let d = dist(this.pos.x, this.pos.y, playerPos.x, playerPos.y);
        if(d < 50) {
            return true;
        }
        return false;
    }
}