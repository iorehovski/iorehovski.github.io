const game = new Phaser.Game(
    window.innerWidth,
    window.innerHeight,
    Phaser.AUTO,
    '',
    { preload: preload, create: create, update: update }
);

function preload() {
    //map
    game.load.tilemap('map', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/map/terrainSet.png');

    game.load.image('background','assets/background.png');
	game.load.image('player','assets/player.png');
}

var map;
var layer;
var player;
var cursors;

function create() {
    game.stage.backgroundColor = "#2e2e2e";
    //game.add.tileSprite(0, 0, 1920, 1920, 'background');
	//game.world.setBounds(0, 0, 1920, 1920);

    map = game.add.tilemap('map');
    map.addTilesetImage('terrainSet', 'tiles');
    layer = map.createLayer('World1');
    layer.resizeWorld();

	game.physics.startSystem(Phaser.Physics.P2JS);

	player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
	game.physics.p2.enable(player);

	//cursors = game.input.keyboard.createCursorKeys();

	game.camera.follow(player);
}

function update() {
	var playerSpeed = 300;

	player.body.setZeroVelocity();

	if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
    	playerSpeed = playerSpeed * 10;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        player.body.moveUp(playerSpeed)
    }

    else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        player.body.moveDown(playerSpeed);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        player.body.moveLeft(playerSpeed);
    }

    else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        player.body.moveRight(playerSpeed);
    }


}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
}