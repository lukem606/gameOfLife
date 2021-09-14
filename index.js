const LIVE = "LIVE";
const DEAD = "DEAD";
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const PAD = 20; // Padding of body element

// Co-ordinates for neighbour squares
const NEIGHBOUR_POSITIONS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

/**
 * Cell in grid, only rendered if state is LIVE.
 */
class Square {
  /**
   * Square constructor
   * @param {*} posX X co-ordinate of square, must be positive integer
   * @param {*} posY Y co-ordinate of square, must be positive integer
   */
  constructor(posX, posY) {
    this.state = DEAD;
    this.posX = posX;
    this.posY = posY;
    this.neighbours = [];
  }

  /**
   * Returns array index from x and y co-ordinates.
   * @param {*} x X co-ordinate, must be an integer
   * @param {*} y Y co-ordinate, must be an integer
   * @param {*} size Size of cell in pixels, must be an integer
   * @returns Index derived from x and y
   */
  getIndex(x, y, size) {
    return y * (WIDTH / size) + x;
  }

  /**
   * Populates this.neighbours with valid neighbouring squares.
   * @param {*} cellArray this.cells from instance of Game, must be array
   * @param {*} cellSize size of cell in pixels, must be integer
   */
  getNeighbours(cellArray, cellSize) {
    const returnArray = [];

    for (let i = 0; i < NEIGHBOUR_POSITIONS.length; i++) {
      let otherX = this.posX + NEIGHBOUR_POSITIONS[i][0];
      let otherY = this.posY + NEIGHBOUR_POSITIONS[i][1];

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

/**
 * Handler class for Game
 */
class Game {
  /**
   * Game constructor
   * @param {*} fps Frames per second, used in run() for setInterval
   * @param {*} cellSize Size of squares in pixels, must be integer
   * @param {*} initialSquares Number of LIVE squares at start, must be an integer
   */
  constructor(fps, cellSize, initialSquares) {
    this.fps = fps;
    this.cellSize = cellSize;
    this.black = "rgb(0, 0, 0)";
    this.white = "rgb(255, 255, 255)";
    this.green = "rgb(3, 160, 98)";
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.width = WIDTH - (WIDTH % this.cellSize) - PAD * 2;
    this.canvas.height = HEIGHT - (HEIGHT % this.cellSize) - PAD * 2;
    this.context = this.canvas.getContext("2d");
    this.squaresAdded = [];
    this.squaresRemoved = [];
    this.cells = this.createCells(initialSquares);
  }

  /**
   * Draws grid lines onto gridCanvas element; only happens at start of game.
   */
  drawGrid() {
    const grid = document.getElementById("gridCanvas");
    grid.width = WIDTH - (WIDTH % this.cellSize) - PAD * 2;
    grid.height = HEIGHT - (HEIGHT % this.cellSize) - PAD * 2;
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

  /**
   * Clears gameCanvas element; occurs at start of game loop.
   */
  clearCanvas() {
    this.context.beginPath();
    this.context.clearRect(0, 0, WIDTH, HEIGHT);
    this.context.closePath();
  }

  /**
   * Returns an array with entire grid of cells; changes state of assigned number to LIVE.
   * @param {*} initial Number of initial LIVE squares, must be an integer
   * @returns Array filled with instances of Square, some LIVE
   */
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

  /**
   * Renders newly live squares to gameCanvas, removes newly DEAD squares.
   */
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

    this.squaresRemoved = [];
  }

  /**
   * Updates whether cells are LIVE or DEAD based on Conway's Game of Life rules
   */
  updateSquares() {
    const liveSquares = this.cells.filter((cell) => {
      return cell.state === LIVE;
    });

    for (let square of liveSquares) {
      square.getNeighbours(this.cells, this.cellSize);

      console.log(square);

      const totalNeighbours = square.neighbours.filter((neighbour) => {
        return neighbour.state === LIVE;
      });

      if (totalNeighbours < 2 || totalNeighbours > 3) {
        square.state = DEAD;
        this.squaresRemoved.push(square);
      }
    }
  }

  /**
   * Handler function for the game loop.
   */
  gameLoop() {
    this.drawSquares();

    if (
      this.cells.filter((cell) => {
        return cell.state === LIVE;
      }).length === 0
    ) {
      clearInterval(this.running);
    }

    this.updateSquares();
  }

  /**
   * Starts game.
   */
  run() {
    document.querySelector("body").style.padding = `${20}px`;
    this.drawGrid();
    this.createCells();

    this.running = setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

const game = new Game(1, 10, 5000);
game.run();
