const game = new Phaser.Game(
    window.innerWidth,
    window.innerHeight,
    Phaser.AUTO,
    'test123',
    { preload: preload, create: create, update: update, render: render }
);

function preload() {
	 game.load.image('background','../images/background.png');
	game.load.image('player','../images/player.png');
}

var player;
var cursors;

function create() {
    game.stage.backgroundColor = "#2e2e2e";
    game.add.tileSprite(0, 0, 1920, 1920, 'background');
	game.world.setBounds(0, 0, 1920, 1920);

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