/*
Общее / в перспективе:

1. разбить программу на файлы
2. миникарта
3. алгоритм генерации карты для одиночного режима (и кооператива)
4. время суток
5. плавное следование камеры за игроком
6. животные
7. ИИ животных
8. drag and drop предметов

-----------

Denis (TODO):
2. объект дерево
	1. текстура
	2. collision
	3. ресурс дерева
3. объект камень
	1. текстура
	2. collision
	3. ресурс камня
4. система столкновений circle-circle
	5. Оптимизация системы столкновений
5. инвентарь
6. полоска здоровья
7. полоска голода
8. полоска холода
9. внутриигровой режим отладки
	1. телепортация по координатам
	2. отключение и включение режима
10. зона пустыни 
11. зона арктики
12. Дополнительная оптимизация рендеринга карты
13. Доработать анимацию руки

Ilia (TODO):
1.Анимация предметов
*/
var player;
let playerSpeed = 10;
const boostedPlayerSpeed = playerSpeed * 5;

var techDataFontSize = 18;

var map = [];
const MAP_W = 60;
const MAP_H = 40;
const mTileSize = 200;
var tilesRenderOnX;
var tilesRenderOnY;

var displayWidthDivBy2;
var displayHeightDivBy2;

let tilesOnRender = 0;
let treesOnRender = 0;
//paths to files
//var grassPath = 'img/grass.png';
const playerPath = 'img/player.png';
const treePath = 'img/tree.png';
var playerImg;

var trees = [];
const treeNumber = 40;

//colors
const bgColor = 50;
const collisionColor = '#0DA7F2';
const treeColor = '#267036';

var handAnim;
function preload() {
	playerImg = loadImage(playerPath);
}

function setup(){
	tilesRenderOnX = Math.floor(displayWidth / mTileSize);
	tilesRenderOnY = Math.floor(displayHeight / mTileSize);

	imageMode(CENTER);
	angleMode(DEGREES);

	createCanvas(displayWidth, displayHeight);
	displayWidthDivBy2 = displayWidth/2;
	displayHeightDivBy2 = displayHeight/2;

	map = createAndSetMap(0, 0);
	trees = setupTrees(180, treeNumber);

	player = new Player(60);
	tree = new Tree(100, 0, 0);
}

function draw(){
	resetPLayerDirection();

	background(bgColor);

	camera(player.pos.x - displayWidthDivBy2, player.pos.y - displayHeightDivBy2);

	drawMap(map);
	updateTrees(trees);
	player.update();

	collisionSystem(player, trees);
	
	technicalData();

	controller(playerDirection);
}

function GroundSprite(w, h) {
	this.pos = createVector(w, h);

	this.show = function() {
		rect(this.pos.x, this.pos.y, mTileSize, mTileSize);
	}
}

function controller(plDir) {

}

function technicalData() {
	fill(255);
	var dX = player.pos.x - displayWidthDivBy2 + 2;
	var dY = player.pos.y - displayHeightDivBy2;
	var yPos = 20;
	textSize(techDataFontSize);
	text('player speed: ' + playerSpeed, dX, dY + 20);
	text('player Coors on map: X:' + tileX + " Y:" + tileY, dX, dY + (yPos+=20));
	text('MAP_W: ' + MAP_W, dX, dY + (yPos+=20));
	text('MAP_H: ' + MAP_H, dX, dY + (yPos+=20));
	text('tiles rendering: ' + tilesOnRender + '/' + map.length * map[0].length, dX, dY + (yPos+=20));
	text('trees rendering: ' + treesOnRender + '/' + treeNumber, dX, dY + (yPos+=20));

	tilesOnRender = 0;
	treesOnRender = 0;
}

function collisionSystem(singleObj, objArray) {
	for(let i = 0; i < objArray.length; i++) {
		if((objArray[i].r + singleObj.r)/2 > dist(singleObj.pos.x, singleObj.pos.y, objArray[i].pos.x, objArray[i].pos.y)) {
			objArray[i].color = collisionColor;
		if(singleObj.pos.x >= objArray[i].pos.x) {
			//прекратить движение влево
			playerDirection[1] = false;
			player.pos.x +=1;
		} else {
			//прекратить движение вправо
			playerDirection[3] = false;
			player.pos.x -=1;
		}
		if(singleObj.pos.y >= objArray[i].pos.y) {
			//прекратить движение вверх
			playerDirection[0] = false;
			player.pos.y -=1;
		} else {
			//прекратить движение вниз
			playerDirection[2] = false;
			player.pos.y +=1;
		}
	} else {
		objArray[i].color = treeColor;
	}
	}
}

function resetPLayerDirection() {
	for(let i = 0; i < playerDirection.length; i++) {
		playerDirection[i] = true;
	}
}

function Tree(r, w, h, treeColor) {
	this.pos = createVector(w, h);
	this.r = r;
	this.color = treeColor;
	this.update = function() {
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.r, this.r);
	}
}

function updateTrees(tArr) {
	for( var i = 0; i < tArr.length; i++) {
		tArr[i].update();
		treesOnRender++;
	}
}

function setupTrees(r, num) {
	let tmpTrees = [];
	for(let i = 0; i < num; i++) {
		tmpTrees[i] = new Tree(r, Math.floor(random(mTileSize * MAP_W)), Math.floor(random(mTileSize * MAP_H)), treeColor);
	}
	return tmpTrees;
}

function mousePressed() {
	//player
	if (!player.animantionInProcess) {
		player.animantionInProcess = true;
		handAnim = setInterval('player.handAnimation()', 30);
	}
}

function stopHandAnim() {
	clearInterval(handAnim);
}
