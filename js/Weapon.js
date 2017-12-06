class Weapon {
    constructor(srcImage,bCount) {
        this.damage = 0;
        //this.img = loadImage(srcImage);
        this.position = {'x': 0, 'y': 25};
        this.bulletsCount = bCount;
        this.bulletsRoom = bCount;
        this.processingBullets = [];
    }

    update() {
        fill('#282828');
        rect(this.position.x,this.position.y, 20, 8);
        //image(this.img,this.position.x,this.position.y);
    }
    
    makeShot(pos) {
        
        if(this.bulletsRoom > 0) {
            this.bulletsRoom--;
            var x1 =  pos.x; // gun x
            var y1 =  pos.y; // gun y
            var x2 = mouseX + pos.x - WIN_WIDTH_HALF;  //mouse x
            var y2 = mouseY + pos.y - WIN_HEIGHT_HALF; //mouse y
            this.processingBullets.push(new Bullet(x1,y1,x2,y2));
        }else{
            //reload bullets
            setTimeout(this.recharge.bind(this),2000);
        }
    }

    recharge(){
        this.bulletsRoom = this.bulletsCount;
    }

    shootQueue() { 
        if(this.processingBullets.length > 0){
            this.processingBullets.forEach(function(item,index,obj){
                if(!item.isLife()){
                    obj.splice(index, 1);
                }
                item.update();
            });
        }
    }
}