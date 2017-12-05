function printTechData(dataObject) {
    fill(255);
    textSize(TEXTSIZE_TECHDATA);
    text('player x: ' + dataObject.xPlayer, dataObject.xPlayer - 140, dataObject.yPlayer);
	text('player y: ' + dataObject.yPlayer, dataObject.xPlayer - 140, dataObject.yPlayer - 20);
}