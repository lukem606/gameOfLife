class Game {
  constructor(fps, cellSize) {
    this.fps = fps;
    this.cellSize = cellSize;
    this.black = "rgb(0, 0, 0)";
    this.white = "rgb(255, 255, 255)";
    this.green = "rgb(3, 160, 98)";
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");
  }

  clearCanvas() {
    this.context.beginPath();
    this.context.fillStyle = this.black;
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.closePath();
  }

  draw() {
    this.context.beginPath();
    this.context.strokeStyle = Math.random() > 0.5 ? this.green : this.white;
    this.context.strokeRect(100, 100, this.cellSize, this.cellSize);
    this.context.closePath();
  }

  gameLoop() {
    this.clearCanvas();
    this.draw();
  }

  run() {
    this.running = setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

const game = new Game(2, 10);
game.run();
