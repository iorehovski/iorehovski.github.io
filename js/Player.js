class Player {
    constructor(radius, windowDimentions) {
		this.r = radius;
		this.rHand = Math.floor(radius / 4);
		this.pos = {'x': windowDimentions.x / 2, 'y': windowDimentions.y / 2};
		this.windowDimBy2 = this.pos;
		this.dirMove = [false, false, false, false]; //WASD

		this.playerSpeed = 8;
		this.boostedPlayerSpeed = this.playerSpeed * 5;
	}

	update() {
		fill(PLAYER_COLOR);


		push();

		ellipseMode(CENTER);
		translate(this.pos.x, this.pos.y);
		rotate(atan2(mouseY - this.windowDimBy2.y, mouseX - this.windowDimBy2.x));

		ellipse(0, 0, this.r, this.r); //body
		ellipse(0, -35, this.rHand, this.rHand); //left hand
		ellipse(0, 35, this.rHand, this.rHand); //right hand
		pop();

		this.controller();
	}

	focusCamera() {
		camera(this.pos.x - this.windowDimBy2.x, this.pos.y - this.windowDimBy2.y);
	}

	controller() {
		
		//w
		if(keyIsDown(87) && !this.dirMove[0]){
			player.pos.y -= this.playerSpeed;
		}
		//a
		if(keyIsDown(65) && !this.dirMove[1]){
			player.pos.x -= this.playerSpeed;
		}
		//s
		if(keyIsDown(83) && !this.dirMove[2]){
			player.pos.y += this.playerSpeed;
		}
		//d
		if(keyIsDown(68) && !this.dirMove[3]){
			player.pos.x += this.playerSpeed;
		}

		//shift(boosted movement)
		if(keyIsDown(16)){
			this.playerSpeed = this.boostedPlayerSpeed;
		} else {
			this.playerSpeed = this.boostedPlayerSpeed / 5;
		}
	}
}