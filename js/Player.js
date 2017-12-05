class Player {
    constructor(radius, playerCoors) {
	    this.r = radius;
	    this.pos = {'x': playerCoors.x, 'y': playerCoors.y};
		this.dirMove = [false, false, false, false]; //WASD

		this.playerSpeed = 8;
		this.boostedPlayerSpeed = this.playerSpeed * 5;
	}

	update() {
		fill('#db5151');
		ellipse(this.pos.x, this.pos.y, this.r, this.r);
		this.controller();
		console.log('pos.x = ' + this.pos.x + ' pos.y = ' + this.pos.y);
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
	/*
    resetPLayerDirection() {
        for(let i = 0; i < playerDirection.length; i++) {
            playerDirection[i] = true;
        }
	}
	*/
}