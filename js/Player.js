class Player {
    constructor(radius, windowDimentions) {
		this.r = radius;
		this.rHand = (radius / 4) | 0;
		this.pos = {'x': windowDimentions.x / 2, 'y': windowDimentions.y / 2};
		this.windowDimBy2 = this.pos;
		this.dirMove = [false, false, false, false]; //WASD
		this.isblockRunning = false;

		this.inventory = new Inventory();
		this.inventory.pushItem(new Weapon({	//availible weapon is pistol
			name: 'pistol',
			damage: 20,
			srcImage:'src/to/image',
			countBullets: 72,
			countBulletsInHolder: 12,
			width: 30,
			height: 8,
			timeBetweenShots: 500
		}));
		this.inventory.pushItem(new Weapon({	//availible weapon is pistol
			name: 'ak47',
			damage: 120,
			srcImage: 'src/to/image',
			countBullets: 120,
			countBulletsInHolder: 30,
			width: 50,
			height: 8,
			timeBetweenShots: 100
		}));


		this.queueBullets = [];

		this.currentObjInHand = this.inventory.getItems()[0]; //current Object in hand
		
		this.playerSpeed = 8;
		this.boostedPlayerSpeed = this.playerSpeed * 5;

		this.barsX = 10;
		this.barsY = 200;
		this.healthBar = new HealthBar(HP_BAR_COLOR);
		//this.hungerBar = new HungerBar(HUNGER_BAR_COLOR);
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
			this.currentObjInHand.update();
		}
	
		pop();

		if(this.currentObjInHand instanceof Weapon) {
			//if reload, update circle animation
			if(this.currentObjInHand.reload) {
				this.currentObjInHand.updateRecharge(this.pos);
			}
			this.queueBullets = player.currentObjInHand.bullets;
		}

		//render and update bullets in queue
		this.queueBullets.update(0.02, map.map);
		this.queueBullets.render();

		//update inventory
		this.inventory.update({
			'current':this.currentObjInHand,
			'pos': this.pos
		});

		//state bars
		this.updateStateBars();
		
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
		//this.hungerBar.w -= 0.01;

		this.barsX = this.pos.x - WIN_WIDTH_HALF + 10;
		this.barsY = this.pos.y + 225;
		this.healthBar.update(this.barsX, this.barsY);
		//this.hungerBar.update(this.barsX, this.barsY + 25);
		this.coldBar.update(this.barsX, this.barsY + 25);
		this.enduranceBar.update(this.barsX, this.barsY + 50);
		pop();

		if(this.enduranceBar.w < 150 && !this.blockRunning) {
			this.enduranceBar.w += 0.1;
		}
		if(this.blockRunning) {
			setTimeout(() => {
				this.blockRunning = false;
			}, 3000);
		}
	}

	handHitAnimation() {

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

		//inventory
		//1
		if(keyIsDown(49)){
			this.currentObjInHand = this.inventory.getItems()[0];
		}
		//2
		if(keyIsDown(50)){
			this.currentObjInHand = this.inventory.getItems()[1];
		}
		//3
		if(keyIsDown(51)){
			this.currentObjInHand = this.inventory.getItems()[2];
		}
		//4
		if(keyIsDown(52)){
			this.currentObjInHand = this.inventory.getItems()[3];
		}
		//5
		if(keyIsDown(53)){
			this.currentObjInHand = this.inventory.getItems()[4];
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