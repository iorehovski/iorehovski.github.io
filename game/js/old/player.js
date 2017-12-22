function Player(r) {
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


	this.leftHand = function() {
		ellipse(-41, 0, this.r2, this.r2);
	}

	this.rightHand = function() {
		ellipse(this.rightHandX, this.rightHandY, this.r2, this.r2);
	}

	this.update = function() {
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

	this.changeColor = function() {
		if(this.color == 255) {
			this.color = 0;
		} else {
			this.color = 255;
		}
	}

	this.handAnimation = function() {
		console.log("hand global Y: " + this.rightHandYGlobal);
		for(let i = 0; i < trees.length; i++) {
			if((trees[i].r + this.r2)/2 > dist(this.rightHandX, this.rightHandY, trees[i].pos.x, trees[i].pos.y)) {
				//не работает
				console.log("collision: tree & hand");
			}
		}
		

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

			stopHandAnim();
		}
	}
}