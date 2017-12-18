class Score {
    constructor() {
        this.value = 0;
        this.kills = 0;
    }

    increaseScore() {
        this.value += 120;
        this.kills++;
    }

    update(pos) {
        push();
        translate(pos.x, pos.y);
        fill('#fff');
        textSize(26);
        textFont(scoreFont);
        text('score: ' + this.value, WIN_WIDTH_HALF/2 - 100, -WIN_HEIGHT_HALF + 40);
        text('kills: ' + this.kills, WIN_WIDTH_HALF/2 + 80, -WIN_HEIGHT_HALF + 40);
		pop();
	}
}