const LIVE = "LIVE";
const DEAD = "DEAD";
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

class Square {
  constructor(posX, posY) {
    this.state = DEAD;
    this.posX = posX;
    this.posY = posY;
    this.neighbours = [];
  }

  getIndex(x, y, size) {
    return y * (WIDTH / size) + x;
  }

  getNeighbours(cellArray, cellSize) {
    const returnArray = [];

    const indices = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    for (let i = 0; i < indices.length; i++) {
      let otherX = this.posX + indices[i][0];
      let otherY = this.posY + indices[i][1];

      if (
        otherX >= 0 &&
        otherX < Math.floor(WIDTH / cellSize) &&
        otherY >= 0 &&
        otherY < Math.floor(HEIGHT / cellSize)
      ) {
        returnArray.push(cellArray[this.getIndex(otherX, otherY, cellSize)]);
      }
    }

    this.neighbours = returnArray;
  }
}

class Game {
  constructor(fps, cellSize, initialSquares) {
    this.fps = fps;
    this.cellSize = cellSize;
    this.black = "rgb(0, 0, 0)";
    this.white = "rgb(255, 255, 255)";
    this.green = "rgb(3, 160, 98)";
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.context = this.canvas.getContext("2d");
    this.squaresAdded = [];
    this.squaresRemoved = [];
    this.cells = this.createCells(initialSquares);
  }

  drawGrid() {
    const grid = document.getElementById("gridCanvas");
    grid.width = WIDTH;
    grid.height = HEIGHT;
    const gridContext = grid.getContext("2d");

    gridContext.beginPath();

    gridContext.fillStyle = this.black;
    gridContext.fillRect(0, 0, WIDTH, HEIGHT);

    gridContext.strokeStyle = this.green;
    for (let i = 0; i < Math.ceil(WIDTH / this.cellSize); i++) {
      for (let j = 0; j < Math.ceil(HEIGHT / this.cellSize); j++) {
        gridContext.strokeRect(
          i * this.cellSize,
          j * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }

    gridContext.closePath();
  }

  clearCanvas() {
    this.context.beginPath();
    this.context.clearRect(0, 0, WIDTH, HEIGHT);
    this.context.closePath();
  }

  createCells(initial) {
    const returnArray = [];
    let squareIndices = [];

    for (let y = 0; y < Math.ceil(HEIGHT / this.cellSize); y++) {
      for (let x = 0; x < Math.ceil(WIDTH / this.cellSize); x++) {
        returnArray.push(new Square(x, y));
      }
    }

    const totalCells = returnArray.length;

    for (let i = 0; i < initial; i++) {
      let index = Math.round(Math.random() * totalCells);
      if (squareIndices.includes(index)) {
        index = Math.round(Math.random() * totalCells);
      }

      squareIndices.push(index);
    }

    squareIndices = Array.from(new Set(squareIndices));

    returnArray.forEach((square, index) => {
      square.getNeighbours(returnArray, this.cellSize);

      if (squareIndices.includes(index)) {
        square.state = LIVE;
        this.squaresAdded.push(square);
      }
    });

    return returnArray;
  }

  drawSquares() {
    this.context.beginPath();
    this.context.fillStyle = this.green;

    this.squaresAdded.forEach((square) => {
      this.context.fillRect(
        square.posX * this.cellSize,
        square.posY * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    });

    this.squaresAdded = [];

    this.squaresRemoved.forEach((square) => {
      this.context.clearRect(
        square.posX * this.cellSize,
        square.posY * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    });

    this.squareRemoved = [];
  }

  updateSquares() {
    const liveSquares = this.cells.filter((cell) => {
      return cell.state === LIVE;
    });

    for (let square of liveSquares) {
      square.getNeighbours(this.cells, this.cellSize);

      const totalNeighbours = square.neighbours.filter((neighbour) => {
        neighbour.state === LIVE;
      });

      if (totalNeighbours < 2 || totalNeighbours > 3) {
        square.state = DEAD;
      }
    }
  }

  gameLoop() {
    this.drawSquares();

    if (
      this.cells.filter((cell) => {
        return cell.state === DEAD;
      }).length === 0
    ) {
      clearInterval(this.running);
    }

    this.updateSquares();
  }

  run() {
    this.drawGrid();
    this.createCells();

    this.running = setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

const game = new Game(1, 10, 1000);
game.run();

/*

Get Square from Index
  y = Math.floor(index / screenWidth)
  x = index % screenWidth

get Index from Square
  (y / cellSize * screenWidth) + (x / cellSize)

Two lists in game
- All cells (organised x -> Lx, for each y)
- liveSquares

On update;

For square in liveSquares
  check all dead neighbours for 3+ neighbours

  */
