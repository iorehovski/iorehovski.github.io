const game = new Phaser.Game(
    window.innerWidth,
    window.innerHeight,
    Phaser.AUTO,
    '',
    { preload: preload, create: create, update: update }
);

function preload() {
    game.load.tilemap('map', 'map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'terrainSet.png');
}

var map;
var layer;

function create() {
    game.stage.backgroundColor = "#2e2e2e";

    map = game.add.tilemap('map');
    map.addTilesetImage('terrainSet', 'tiles');
    layer = map.createLayer('World1');
    layer.resizeWorld();
}

function update() {

}