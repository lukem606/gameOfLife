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
      Math.abs(this.posX - otherX) <= 1 &&
      Math.abs(this.posY - otherY) <= 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  detectNeighbours(array, size) {
    this.neighbours = [];
    for (let other of array) {
      if (this.posX !== other.posX || this.posY !== other.posY) {
        if (this.isNeighbour(other.posX, other.posY)) {
          this.neighbours.push(other);
        }
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
    for (let i = 0; i < this.initialSquares - this.squares.length; i++) {
      const newSquare = new Square(
        Math.round(Math.random() * (this.width / this.cellSize)),
        Math.round(Math.random() * (this.height / this.cellSize))
      );

      for (let square of this.squares) {
        if (square.posX === newSquare.posX && square.posY === newSquare.posY) {
          newSquare.state = DEAD;
        }
      }

      if (newSquare.state === LIVE) {
        this.squares.push(newSquare);
      }
    }
  }

  drawSquares() {
    this.context.beginPath();

    for (let square of this.squares) {
      this.context.fillStyle = this.green;
      this.context.fillRect(
        square.posX * this.cellSize,
        square.posY * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    }

    this.context.closePath();
  }

  updateSquares() {
    /*

    Add code to triangulate new squares
    Certain patterns?

    For square;
    - Get all neighbours within 2 squares

    */

    for (let square of this.squares) {
      square.detectNeighbours(this.squares);

      if (square.neighbours.length > 3 || square.neighbours.length < 2) {
        square.state = DEAD;
      }
    }

    /* 

    Remove section below

    Instead;
    - Mark squares LIVE or DEAD
    - In drawSquares()
      - Draw fillRect if square is LIVE
      - Draw clearRect if square is DEAD, remove from this.squares

    */

    const liveSquares = this.squares.filter((square) => {
      return square.state === LIVE;
    });

    this.squares = liveSquares;
  }

  gameLoop() {
    this.clearCanvas();
    this.drawSquares();

    if (this.squares.length === 0) {
      clearInterval(this.running);
    }

    this.updateSquares();
  }

  run() {
    this.drawGrid();
    this.createSquares();

    this.running = setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

const game = new Game(1, 10, 2000);
game.run();
