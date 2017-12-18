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

		this.playerSpeed = 7;
		this.boostedPlayerSpeed = this.playerSpeed * 3;

		this.barsX = 10;
		this.barsY = 200;
		this.healthBar = new HealthBar(HP_BAR_COLOR);
		//this.hungerBar = new HungerBar(HUNGER_BAR_COLOR);
		//this.coldBar = new ColdBar(COLD_BAR_COLOR);
		this.enduranceBar = new EnduranceBar(ENDURANCE_BAR_COLOR);

		this.score = new Score();

		this.playerSprites = playerSprites;
		this.currentSprite = playerSprites[0];
		
		this.bodySpriteCurrentWidth = 115;
		this.bodySpriteCurrentX = 0;

		//this.animationIdle = new Animation(playerSprites); 
		//this.currentWeaponNumber = 0;
	}

	update(map) {
		
		push();

		imageMode(CENTER);
		translate(this.pos.x, this.pos.y);
		rotate(atan2(mouseY - WIN_HEIGHT_HALF, mouseX - WIN_WIDTH_HALF));

		image(this.currentSprite, this.bodySpriteCurrentX, 0, this.bodySpriteCurrentWidth, 115);
		
		pop();

		if(this.currentWeaponInHand instanceof Weapon) {
			
			//if reload, update circle animation
			if(this.currentWeaponInHand.reload) {
				this.currentWeaponInHand.updateRecharge(this.pos);
			}
			this.queueBullets = player.currentWeaponInHand.bullets;
		}

		if(this.queueBullets){
			//render and update bullets in queue
			this.queueBullets.update(0.02, map.map);
			this.queueBullets.render();
		}

		//update inventory
		this.inventory.update({
			'currentThingInHand':this.currentWeaponInHand,
			'pos': this.pos
		});

		this.score.update(this.pos);

		//state bars
		this.updateStateBars();
		
		this.controller();
		
		handleCollisionWalls(this.pos, map.map);

		if(this.healthBar.w <= 1) {
			gameOver = true;
		}
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
		if(keyIsDown(32) || mouseIsPressed) {
			if(this.currentWeaponInHand instanceof Weapon){
				this.currentWeaponInHand.makeShot(this);
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
		//6
		if(keyIsDown(54)){
			this.processingCurrentInventorySbj(5);
		}	
		//R - recharge
		if(keyIsDown(82)){
			if(this.currentWeaponInHand instanceof Weapon){
				this.currentWeaponInHand.initRecharge(this.currentWeaponInHand.name);
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
			this.playerSpeed = this.boostedPlayerSpeed / 3;
		}
	}

	putThingInInventory(thing) {
		return this.inventory.pushItem(thing);
	}

	changePlayerSkin(weaponName) {
		//if(currentObjectInHand instanceof Weapon || currentObjectInHand  instanceof Thing)
		switch(weaponName) {
			case 'glock17': 
				this.bodySpriteCurrentWidth = 115;
				this.bodySpriteCurrentX = 0;
				this.currentSprite = playerSprites[0];
				break;
			case 'ak47':
				this.bodySpriteCurrentWidth = 150;
				this.bodySpriteCurrentX = 20;
				this.currentSprite = playerSprites[1];
				break;
			case 'm4a1': 
				this.bodySpriteCurrentWidth = 150;
				this.bodySpriteCurrentX = 20;
				this.currentSprite = playerSprites[2];
				break;
			case 'awp':
				this.currentSprite = this.playerSprites[3];
				this.bodySpriteCurrentWidth = 167;
				this.bodySpriteCurrentX = 29;
				this.currentSprite = playerSprites[3];
				break;
			default:
				this.bodySpriteCurrentWidth = 115;
				this.bodySpriteCurrentX = 0;
				this.currentSprite = playerSprites[0];
				break;
		}
	
	}

	processingCurrentInventorySbj(index) {
		this.currentWeaponInHand = this.inventory.getItem(index);
		if(this.currentWeaponInHand) {
			this.changePlayerSkin(this.currentWeaponInHand.name);
			if(this.currentWeaponInHand.itemType == 'aid') {
				console.log((this.healthBar.w + this.currentWeaponInHand.value))
				if(keyIsPressed){
				if((this.healthBar.w + this.currentWeaponInHand.value) < 150) {
					this.healthBar.w = (this.healthBar.w + this.currentWeaponInHand.value) % 150;
					this.healthBar.value = this.healthBar.w;
				}else {
					this.healthBar.w = 150;
					this.healthBar.value = 150;
				}
					if(this.currentWeaponInHand.count == 1){
						this.inventory.removeItem(index);
					}else {
						this.currentWeaponInHand.count--;
					}
					keyIsPressed = false;
				}

			}		
		}
	}
}