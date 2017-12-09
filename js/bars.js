class Bar {
    constructor() {
        this.value = 120;
        this.cornerRad = 20;
        this.w = 120;
        this.h = 10;
        this.col = null;
        this.strokeCol = null;
    }

    update(barsX, barsY) {
        fill(this.col);
        stroke(this.strokeCol);
        rect(barsX, barsY, this.w, this.h, this.cornerRad);
    }
}

class HealthBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#820a0a';
    }
    
}

class HungerBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#18a329';
    }
}

class EnduranceBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#8ca3aa';
    }
}

class ColdBar extends Bar {
    constructor(color) {
        super();
        this.col = color;
        this.strokeCol = '#0f79af';
    }
}