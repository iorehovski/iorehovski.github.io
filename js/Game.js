const game = new Phaser.Game(
    window.innerWidth,
    window.innerHeight,
    Phaser.AUTO,
    'test123',
    { preload: preload, create: create, update: update }
);

function preload() {

}

function create() {
    game.stage.backgroundColor = "#2e2e2e";
}

function update() {

}