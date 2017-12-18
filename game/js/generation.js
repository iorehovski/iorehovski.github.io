class Generation {
    constructor(map, jsonItems, jsonWeapon, player, enemies, enemySpritesMove) {
        this.map = map;
        this.jsonItems = jsonItems;
        this.jsonWeapon = jsonWeapon;
        this.items = [];
        this.player = player;
        this.enemies = enemies;
        this.mapMaxSize = {x: MAP_SIZE_X * TILE_W - 100, y: MAP_SIZE_Y * TILE_W - 100};
        this.generatedWeaponNames = [];
        this.enemySpritesMove = enemySpritesMove;

        this.chanceItems = 2; //larger value lower chance
        this.chanceWeapon = 10;
        this.generalChance = 100;

        this.generalChanceZombie = 15;
        this.chanceZombieNormal = 3;
        this.chanceFastZombie = 5;
        this.chanceFatZombie = 8;

        this.enemiesOnScreen = [];
    }

    generateEnemy() {
        if(randInt(0, this.generalChanceZombie) == 0) {
            if(randInt(0, this.chanceZombieNormal) == 0) {
                this.addEnemy();
            }
        }
    }

    //generate ammo, weapons, aid in map
    generateItem() {
        if(randInt(0, this.generalChance) == 0) {
            //generate ammo, aid kit,
            if(randInt(0, this.chanceItems) == 0) {
                let randItemID = randInt(0, 5);
                this.addThing(
                    randInt(TILE_W, this.mapMaxSize.x),
                    randInt(TILE_H, this.mapMaxSize.y),
                    randItemID
                );
            }

            //generate weapon
            if(randInt(0, this.chanceWeapon) == 0) {
                let randItemID = randInt(0, 3);
                let weaponName = JSON.parse(JSON.stringify(this.jsonWeapon.contents[randItemID])).name;
                if(this.generatedWeaponNames.indexOf(weaponName) >= 0) {
                    return;
                } else {
                    this.generatedWeaponNames.push(weaponName);

                    this.addWeapon(
                        randInt(TILE_W, this.mapMaxSize.x),
                        randInt(TILE_H, this.mapMaxSize.y),
                        randItemID
                    );
                }
            }
        }
    }

    addThing(posX, posY, randItemID) {

        const item = JSON.parse(JSON.stringify(this.jsonItems.contents[randItemID]));
        item.pos.x = posX;
        item.pos.y = posY;
        this.items.push(new Thing(item));
    }

    addWeapon(posX, posY, randItemID) {

        const item = JSON.parse(JSON.stringify(this.jsonWeapon.contents[randItemID]));
        item.pos.x = posX;
        item.pos.y = posY;

        this.items.push(new Weapon(item));
    }

    addEnemy() {
        this.enemies.push(new Enemy(
            randInt(TILE_W, MAP_SIZE_X * TILE_W - TILE_W),
            randInt(TILE_H, MAP_SIZE_Y * TILE_H - TILE_H),
            ENTITY_DIAMETR / 2,
            this.enemySpritesMove
        ));
    }

    updateItems() {
        for(let i = 0, len = this.items.length; i < len; i++) {
            this.items[i].update();

            if(this.isIntersects(this.player.pos, this.items[i].pos)) {
                this.player.putThingInInventory(this.items[i]);
                this.items.splice(i, 1);
                len--;
            }
        }
    }

    updateEnemies(map, player) {

        for(let i = 0, len = this.enemies.length; i < len; i++) {

            this.enemies[i].update(player.pos, map);

            const damage = this.enemies[i].damage;
            player.healthBar.value -= damage;
            //check player hp value
            if(player.getHealthValue() <= 0) {
            } else {
                player.healthBar.w -= damage;
            }

            //check if bullet hit an enemy
            if(player.currentWeaponInHand instanceof Weapon) {
                let bullets = player.currentWeaponInHand.bullets.bulletsList;
                for(let j = 0, lenBullets = bullets.length; j < lenBullets; j++) {
                    if(this.isIntersects({x : bullets[j].x, y : bullets[j].y}, this.enemies[i].pos)) {

                        this.enemies[i].hp -= bullets[j].penetrationCapacity;
                        bullets[j].penetrationCapacity -= this.enemies[i].hp;
                        if(bullets[j].penetrationCapacity <= 0) {
                            bullets.splice(j, 1);
                        }

                        blood.createBloodSpot(this.enemies[i].pos.x, this.enemies[i].pos.y);
                        lenBullets--;
                    }
                }
            }

            if(this.enemies[i].hp <= 0){
                this.enemies.splice(i, 1);
                len--;
                player.score.increaseScore();
            }
        }

        checkCollisionEnemies(this.enemiesOnScreen);
    }

    isIntersects(playerPos, itemPos) {
        let d = dist(itemPos.x, itemPos.y, playerPos.x, playerPos.y);
        if(d < 50) {
            return true;
        }
        return false;
    }

    findEnemiesOnScreen(enemiesList, playerPos) {

        this.enemiesOnScreen.length = 0;

        let renderBorderUp = playerPos.y - WIN_HEIGHT;
        let renderBorderDown = playerPos.y + WIN_HEIGHT;
        let renderBorderLeft = playerPos.x - WIN_WIDTH;
        let renderBorderRight = playerPos.x + WIN_WIDTH;
        
        for(let i = 0, len = enemiesList.length; i < len; i++) {
            if(this.isEnemyOnScreen(
                enemiesList[i].pos,
                renderBorderUp,
                renderBorderDown,
                renderBorderLeft,
                renderBorderRight
            )) {
                enemiesList[i].isOnScreen = true;
                this.enemiesOnScreen.push(enemiesList[i]);
            } else {
                enemiesList[i].isOnScreen = false;
            }
        }
    }

    isEnemyOnScreen(enemyPos, renderBorderUp, renderBorderDown, renderBorderLeft, renderBorderRight) {

        if(enemyPos.y < renderBorderUp) {
            return false;
        }

        if(enemyPos.y > renderBorderDown) {
            return false;
        }

        if(enemyPos.x < renderBorderLeft) {
            return false;
        }

        if(enemyPos.x > renderBorderRight) {
            return false;
        }

        return true;
    }
}

