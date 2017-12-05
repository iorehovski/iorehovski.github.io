class Player {
    constructor(r){
	    this.animantionInProcess = false;
	    this.forward = true;
	    this.mouseIsPressed = false;
	    this.color = 255; 
	    this.r = r;
	    this.r2 = Math.floor(r/4);
	    this.pos = createVector(displayWidthDivBy2, displayHeightDivBy2);

        this.currentAngle = 0;

        this.rightHandX = 41;
        this.rightHandY = 0;

        this.rightHandXGlobal = this.pos.x + this.rightHandX;
        this.rightHandYGlobal = this.pos.y + this.rightHandY;

        this._rightHandX = this.rightHandX;
        this._rightHandY = this.rightHandY;
        this._currentAngle = this.currentAngle;
    }

	leftHand() {
		ellipse(-41, 0, this.r2, this.r2);
	}

	rightHand() {
		ellipse(this.rightHandX, this.rightHandY, this.r2, this.r2);
	}

	update() {
		push();
		fill(this.color);
		ellipseMode(CENTER);
		translate(this.pos.x, this.pos.y);
		rotate(90);
		rotate(atan2(mouseY-displayHeightDivBy2, mouseX-displayWidthDivBy2));
		ellipse(0, 0, this.r, this.r);
		this.leftHand();
		this.rightHand();
		image(playerImg, 0, 0, 60, 60);
		pop();
	}

	changeColor() {
		if(this.color == 255) {
			this.color = 0;
		} else {
			this.color = 255;
		}
	}

	handAnimation() {
		console.log("hand global Y: " + this.rightHandYGlobal);
		
		if (this.rightHandY > -45 && this.forward){
			this.currentAngle += 0.1;
			this.rightHandX = Math.cos(this.currentAngle) * this.r - 18;
			this.rightHandY = -Math.sin(this.currentAngle) * this.r;
		} else if(this.forward) {
			this.forward = false;
		}

		if(!this.forward && this.rightHandY < 0) {
			this.rightHandX +=1.4;
			this.rightHandY +=3;
		} else if(!this.forward) {
			this.currentAngle = 0;
			this.forward = true;
			this.rightHandX = this._rightHandX;
			this.rightHandY = this._rightHandY;
			this.currentAngle = this._currentAngle;

			this.animantionInProcess = false;

			this.stopHandAnim();
		}
    }
    stopHandAnim() {
        clearInterval(handAnim);
    }
    // mousePressed() {
    //     //player
    //     if (!player.animantionInProcess) {
    //         player.animantionInProcess = true;
    //         handAnim = setInterval('player.handAnimation()', 30);
    //     }
    // }
    resetPLayerDirection() {
        for(let i = 0; i < playerDirection.length; i++) {
            playerDirection[i] = true;
        }
    }
    controller(plDir) {
            //w
            if(keyIsDown(87) && plDir[0]){
                player.pos.y -= playerSpeed;
            }
            //a
            if(keyIsDown(65) && plDir[1]){
                player.pos.x -= playerSpeed;
            }
            //s
            if(keyIsDown(83) && plDir[2]){
                player.pos.y += playerSpeed;
            }
            //d
            if(keyIsDown(68) && plDir[3]){
                player.pos.x += playerSpeed;
            }
        
            if(keyIsDown(16)){
                playerSpeed = boostedPlayerSpeed;
            } else {
                playerSpeed = boostedPlayerSpeed / 5;
            }
        }
}