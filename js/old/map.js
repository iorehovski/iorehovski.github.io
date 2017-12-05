let tileX;
let tileY;

function createAndSetMap(originW, originH) {
	let tmpMap = [];
	for(let w = 0; w < MAP_W; w++){
		tmpMap[w] = [];
		for(let h = 0; h < MAP_H; h++){
			tmpMap[w][h] = new GroundSprite(originW, originH);
			originH += mTileSize;
		}
		originH = 0;
		originW += mTileSize;
	}
	return tmpMap;
}

function drawMap(m) {
	fill('#429b42');

	tileX = Math.floor(player.pos.x / mTileSize);
	tileY = Math.floor(player.pos.y / mTileSize);

	let lWidth = Math.floor(tileX - tilesRenderOnX / 2) - 1;
	let rWidth = Math.floor(tileX + tilesRenderOnX / 2) + 2;
	let uHeight = Math.floor(tileY - tilesRenderOnY / 2);
	let dHeight = Math.floor(tileY + tilesRenderOnY / 2) + 2;

	//x
	if(tileX < m.length / 2){
		if(lWidth < 0){
			lWidth = 0;
		}
	} else {
		if(rWidth > m.length){
			rWidth = m.length;
		}
	}
	//y
	if(tileY < m[0].length / 2){
		if(uHeight < 0){
			uHeight = 0;
		}
	} else {
		if(dHeight > m[0].length){
			dHeight = m[0].length;
		}
	}

	for(let w = lWidth; w < rWidth; w++){
		for(let h = uHeight; h < dHeight; h++){
			m[w][h].show();
			tilesOnRender++;
		}
	}
}