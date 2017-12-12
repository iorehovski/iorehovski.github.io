class Player {
    constructor(radius, windowDimentions) {
		this.r = radius;
		this.rHand = (radius / 4) | 0;
		this.pos = {'x': windowDimentions.x / 2, 'y': windowDimentions.y / 2};
		this.windowDimBy2 = this.pos;
		this.dirMove = [false, false, false, false]; //WASD
		this.isblockRunning = false;

		this.weapon = new Weapon({	//availible weapon
			'damage': 100,
			'srcImage':'src/to/image',
			'countBullets': 600,
			'countBulletsInHolder':200
		}); 

		this.currentObjInHand = this.weapon; //current Object in hand
		
		this.playerSpeed = 8;
		this.boostedPlayerSpeed = this.playerSpeed * 5;

		this.barsX = 10;
		this.barsY = 200;
		this.healthBar = new HealthBar(HP_BAR_COLOR);
		this.hungerBar = new HungerBar(HUNGER_BAR_COLOR);
		this.coldBar = new ColdBar(COLD_BAR_COLOR);
		this.enduranceBar = new EnduranceBar(ENDURANCE_BAR_COLOR);

	}

	update(map) {
		fill(PLAYER_COLOR);

		push();

		ellipseMode(CENTER);
		translate(this.pos.x, this.pos.y);
		rotate(atan2(mouseY - WIN_HEIGHT_HALF, mouseX - WIN_WIDTH_HALF));
		ellipse(0, 0, this.r, this.r); //body
		ellipse(0, -35, this.rHand, this.rHand); //left hand
		ellipse(0, 35, this.rHand, this.rHand); //right hand

		if(this.currentObjInHand){
			this.currentObjInHand.update(); //weapon
		}
		
		pop();

		//render and update bullets
		this.weapon.bullets.update(0.02);
		this.weapon.bullets.render();

		//state bars
		this.updateStateBars();
		if(this.enduranceBar.w < 120 && !this.blockRunning) {
			this.enduranceBar.w += 0.1;
		}
		if(this.blockRunning) {
			setTimeout(() => {
				this.blockRunning = false;
			}, 3000);
		}
		
		this.controller();
		
		handleCollisionWalls(this.pos, map.map);
		
	}

	focusCamera() {
		camera(this.pos.x - this.windowDimBy2.x, this.pos.y - this.windowDimBy2.y);
	}

	getHealthValue() {
		return this.healthBar.value;
	}

	updateStateBars() {
		push();
		strokeWeight(2);
		this.hungerBar.w -= 0.01;

		this.barsX = this.pos.x - WIN_WIDTH_HALF + 10;
		this.barsY = this.pos.y + 200;
		this.healthBar.update(this.barsX, this.barsY);
		this.hungerBar.update(this.barsX, this.barsY + 25);
		this.coldBar.update(this.barsX, this.barsY + 50);
		this.enduranceBar.update(this.barsX, this.barsY + 75);
		pop();
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

		//fire
		if(keyIsDown(32)) {
			if(player.currentObjInHand){
				player.currentObjInHand.makeShot(player);
			}
		}

		//shift(boosted movement)
		if(keyIsDown(16) && !this.blockRunning){
			if(this.enduranceBar.w > 10) {
				this.enduranceBar.w -= 0.5;
				this.playerSpeed = this.boostedPlayerSpeed;
			} else {
				this.blockRunning = true;
			}
		} else {
			this.playerSpeed = this.boostedPlayerSpeed / 5;
		}
	}
}