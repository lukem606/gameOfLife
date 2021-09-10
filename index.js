const LIVE = "LIVE";
const DEAD = "DEAD";

class Square {
  constructor(posX, posY) {
    this.state = LIVE;
    this.posX = posX;
    this.posY = posY;
    this.green = "rgb(3, 160, 98)";
    this.neighbours = [];
  }

  isNeighbour(otherX, otherY) {
    if (
      Math.abs(this.posX - otherX) === 1 &&
      Math.abs(this.posY - otherY) === 1
    ) {
      return true;
    }
  }

  detectNeighbours(array) {
    // not working as it should

    for (let other of array) {
      if (this.isNeighbour(other.posX, other.posY)) {
        this.neighbours.push(other);
      }
    }
  }
}

class Game {
  constructor(fps, cellSize, initialSquares) {
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
    this.grid = document.getElementById("gridCanvas");
    this.grid.width = this.width;
    this.grid.height = this.height;
    this.gridContext = this.grid.getContext("2d");
    this.squares = [];
    this.initialSquares = initialSquares;
  }

  drawGrid() {
    this.gridContext.beginPath();

    this.gridContext.fillStyle = this.black;
    this.gridContext.fillRect(0, 0, this.width, this.height);

    this.gridContext.strokeStyle = this.green;
    for (let i = 0; i < Math.ceil(this.width / this.cellSize); i++) {
      for (let j = 0; j < Math.ceil(this.height / this.cellSize); j++) {
        this.gridContext.strokeRect(
          i * this.cellSize,
          j * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }

    this.gridContext.closePath();
  }

  clearCanvas() {
    this.context.beginPath();
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.closePath();
  }

  createSquares() {
    for (let i = 0; i < this.initialSquares; i++) {
      const posX =
        Math.round(Math.random() * (this.width / this.cellSize)) *
        this.cellSize;
      const posY =
        Math.round(Math.random() * (this.height / this.cellSize)) *
        this.cellSize;
      this.squares.push(new Square(posX, posY));
    }
  }

  drawSquares() {
    this.context.beginPath();

    for (let square of this.squares) {
      this.context.fillStyle = this.green;
      this.context.fillRect(
        square.posX,
        square.posY,
        this.cellSize,
        this.cellSize
      );
    }

    this.context.closePath();
  }

  updateSquares() {
    for (let square of this.squares) {
      square.detectNeighbours(this.squares);
    }

    for (let square of this.squares) {
      if (square.neighbours.length > 3 || square.neighbours.length < 2) {
        square.state = DEAD;
      }
    }
  }

  clearSquares() {
    const liveSquares = this.squares.filter((square) => square.state === LIVE);
    this.squares = liveSquares;
  }

  gameLoop() {
    this.clearCanvas();
    this.drawSquares();
    this.updateSquares();
    this.clearSquares();

    if (this.squares.length === 0) {
      clearInterval(this.running);
    }
  }

  run() {
    this.drawGrid();
    this.createSquares();

    this.running = setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

const game = new Game(2, 10, 500);
game.run();
