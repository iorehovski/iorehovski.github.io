class Bullet {
    constructor() {
        this.bulletsList = [];
    }

    init(bullet) {
        bullet.vx = bullet.v * Math.cos(bullet.angle);
        bullet.vy = bullet.v * Math.sin(bullet.angle);
        bullet.xInit = bullet.x;
        bullet.yInit = bullet.y;
    }
     
    pushBullet(bullet) {
        this.init(bullet);
        this.bulletsList.push(bullet);
    }

    update(dt, map) {
        this.bulletsList.forEach(function(item, index, bulletsList) {

            const objTile = determineObjectTilePos({x: item.x, y: item.y}, map);

            //check if bullet flies upon wall sprite
            //bullet coll. with a wall
            if(map[objTile.objTileY]){  
                if(map[objTile.objTileY][objTile.objTileX]) {
                    if(map[objTile.objTileY][objTile.objTileX].hasOwnProperty('solid')) {
                        bulletsList.splice(index, 1);
                        map[objTile.objTileY][objTile.objTileX].healthValue -= player.currentWeaponInHand.damage;
                    } else {
                        item.x += item.vx * dt;
                        item.y += item.vy * dt;
            
                        item.lifeTime -= 1;
            
                        if(item.lifeTime <= 0) {
                            bulletsList.splice(index, 1);
                        }
                    }
                }
            }
             else {
                bulletsList.splice(index, 1);
            }
        });
    }
    
    render() {
        this.bulletsList.forEach(function(item, index, obj) {
            push();
            
            fill(item.bulletsColor);            
            rectMode(CENTER);
            translate(item.x, item.y);
            rotate(item.angle);
            rect(0, 0, item.bulletsLength,3);

            pop();
        });
    }
    getBullets() {
        return this.bulletsList;
    }
}