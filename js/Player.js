class Player {
    constructor(radius, windowDimentions, playerSprites) {
		this.r = radius;
		this.rHand = (radius / 4) | 0;
		this.pos = {'x': windowDimentions.x / 2, 'y': windowDimentions.y / 2};
		this.windowDimBy2 = this.pos;
		this.dirMove = [false, false, false, false]; //WASD
		this.isblockRunning = false;

		this.inventory = new Inventory();

		this.queueBullets = null;

		this.playerSpeed = 5;
		this.boostedPlayerSpeed = this.playerSpeed * 2;

		this.barsX = 10;
		this.barsY = 200;
		this.healthBar = new HealthBar(HP_BAR_COLOR);
		//this.hungerBar = new HungerBar(HUNGER_BAR_COLOR);
		//this.coldBar = new ColdBar(COLD_BAR_COLOR);
		this.enduranceBar = new EnduranceBar(ENDURANCE_BAR_COLOR);

		this.playerSprites = playerSprites;
		this.currentSprite = this.playerSprites[0];
		
		this.bodySpriteCurrentWidth = 115;
		this.bodySpriteCurrentX = 0;
		
		
	}

	update(map) {
		fill(PLAYER_COLOR);

		push();

		ellipseMode(CENTER);
		translate(this.pos.x, this.pos.y);
		rotate(atan2(mouseY - WIN_HEIGHT_HALF, mouseX - WIN_WIDTH_HALF));

		// if(this.currentObjInHand instanceof Weapon){
		
		// 	if(this.currentObjInHand){
		// 		this.currentObjInHand.update();
		// 	}
		// }

		imageMode(CENTER);
		//angleMode(DEGREES);
		//ellipse(0, -35, this.rHand, this.rHand); //left hand
		//ellipse(0, 35, this.rHand, this.rHand);
		rotate(-0.1);
		image(this.currentSprite, this.bodySpriteCurrentX, 0, this.bodySpriteCurrentWidth, 115);
		//ellipse(0, 0, this.r, this.r); //body
		 //right hand
		
		pop();

		if(this.currentObjInHand instanceof Weapon) {
			
			//if reload, update circle animation
			if(this.currentObjInHand.reload) {
				this.currentObjInHand.updateRecharge(this.pos);
			}
			this.queueBullets = player.currentObjInHand.bullets;
		}

		if(this.queueBullets){
			//render and update bullets in queue
			this.queueBullets.update(0.02, map.map);
			this.queueBullets.render();
		}

		//update inventory
		this.inventory.update({
			'currentThingInHand':this.currentObjInHand,
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
		//this.coldBar.update(this.barsX, this.barsY + 25);
		this.enduranceBar.update(this.barsX, this.barsY + 25);
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
			if(this.currentObjInHand instanceof Weapon){
				this.currentObjInHand.makeShot(this);
			}
		}

		//inventory
		
			//1
		if(keyIsDown(49)){
			this.processingCurrentInventorySbj(0);
		}
		//2
		if(keyIsDown(50)){
			this.processingCurrentInventorySbj(1);
		}
		//3
		if(keyIsDown(51)){
			this.processingCurrentInventorySbj(2);
		}
		//4
		if(keyIsDown(52)){
			this.processingCurrentInventorySbj(3);
		}
		//5
		if(keyIsDown(53)){
			this.processingCurrentInventorySbj(4);
		}	
		

		//R - recharge
		if(keyIsDown(82)){
			if(this.currentObjInHand instanceof Weapon){
				this.currentObjInHand.initRecharge(this.currentObjInHand.name);
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
			this.playerSpeed = this.boostedPlayerSpeed / 2;
		}
	}

	putThingInInventory(thing) {
		return this.inventory.pushItem(thing);
	}

	changePlayerSkin(weaponName) {
		console.log('skin: ' + weaponName);
		//if(currentObjectInHand instanceof Weapon || currentObjectInHand  instanceof Thing)
		switch(weaponName) {
			case 'glock17': 
				this.currentSprite = this.playerSprites[0];
				this.bodySpriteCurrentWidth = 115;
				this.bodySpriteCurrentX = 0;
				break;
			case 'ak47':
				this.currentSprite = this.playerSprites[1];
				this.bodySpriteCurrentWidth = 150;
				this.bodySpriteCurrentX = 20;
				break;
			case 'm4a1': 
				this.currentSprite = this.playerSprites[2];
				this.bodySpriteCurrentWidth = 150;
				this.bodySpriteCurrentX = 20;
				break;
			case 'awp':
				this.currentSprite = this.playerSprites[3];
				this.bodySpriteCurrentWidth = 165;
				this.bodySpriteCurrentX = 30;
				break;
			default:
				this.currentSprite = this.playerSprites[0];
				this.bodySpriteCurrentWidth = 115;
				this.bodySpriteCurrentX = 0;
				break;
		}
	
	}

	processingCurrentInventorySbj(index) {
		this.currentObjInHand = this.inventory.getItem(index);
		if(this.currentObjInHand) {
			this.changePlayerSkin(this.currentObjInHand.name);
			if(this.currentObjInHand.name == 'medicineKit') {
				if((this.healthBar.w + this.currentObjInHand.value) > 150) {
					this.healthBar.w = 150;
					this.healthBar.value = 150;
				}else {
					this.healthBar.w += this.currentObjInHand.value;
					this.healthBar.value += this.currentObjInHand.value;
				}
				if(keyIsPressed){
					console.log(this.currentObjInHand.count ) 
					if(this.currentObjInHand.count == 1){
						this.inventory.removeItem(index);
					}else {
						this.currentObjInHand.count--;
					}
					keyIsPressed = false;
				}

			}		
		}
	}
}