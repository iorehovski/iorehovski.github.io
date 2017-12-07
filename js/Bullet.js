class Bullet {
    constructor() {
        this.objects = [];
    }

    init(bullet) {
        bullet.vx = bullet.v * Math.cos(bullet.angle);
        bullet.vy = bullet.v * Math.sin(bullet.angle);
        bullet.xInit = bullet.x;
        bullet.yInit = bullet.y;
    }
    pushBullet(bullet) {
        this.init(bullet);
        this.objects.push(bullet);
    }
    update(dt) {
        this.objects.forEach(function(item, index, obj) {
            item.x += item.vx * dt;
            item.y += item.vy * dt;
            if(item.x < item.xInit - WIN_WIDTH_HALF || item.x > item.xInit + WIN_WIDTH_HALF || item.y < item.yInit - WIN_HEIGHT_HALF || item.y > item.yInit + WIN_HEIGHT_HALF){
                obj.splice(index, 1);
            }
        });
    }
    render() {
        this.objects.forEach(function(item, index, obj) {
            ellipse(item.x, item.y, 10, 10);
        });
    }
}