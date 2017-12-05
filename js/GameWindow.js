class GameWindow {
    constructor() {
        this.WIDTH = window.outerWidth;
        this.HEIGHT = window.outerHeight;
    }

    printDimentions() {
        console.log('width ' + this.WIDTH);
        console.log('heigth ' + this.HEIGHT);
    }
    
}