class Square {
  constructor(originX, originY, rgb) {
    this.posX = originX;
    this.posY = originY;
    this.distX = Math.round(Math.random() * 20) - 10;
    this.distY = Math.round(Math.random() * 20) - 10;
    this.size = Math.round(Math.random() * 30);
    this.xy = 1;
    this.colour = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeRect(this.posX, this.posY, this.size, this.size);
    ctx.strokeStyle = this.colour;
    ctx.closePath();
  }
}

class Game {
  constructor(fps, cellSize) {
    this.fps = fps;
    this.cellSize = cellSize;
    this.colour = "#03a062";
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.grid = document.querySelector(".gridCanvas");
    this.grid.width = this.width;
    this.grid.height = this.height;
    this.canvas = document.querySelector(".gameCanvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");
  }

  drawGrid() {
    for (let i = 0; i < this.grid.width / this.cellSize; i++) {
      for (let j = 0; j < this.grid.height / this.cellSize; i++) {
        drawCell(this.grid.getContext("2d"), i, j);
      }
    }
  }

  drawCell(ctx, indexX, indexY) {
    ctx.beginPath();
    ctx.strokeRect(
      indexX * this.cellSize,
      indexY * this.cellSize,
      this.cellSize,
      this.cellSize
    );
    ctx.strokeStyle = this.colour;
    ctx.closePath();
  }
}

// class Game {
//   constructor(fps, numberOfShapes) {
//     this.fps = fps;
//     this.width = window.innerWidth;
//     this.height = window.innerHeight;
//     this.canvas = document.querySelector(".myCanvas");
//     this.canvas.width = this.width;
//     this.canvas.height = this.height;
//     this.context = this.canvas.getContext("2d");

//     this.grid = grid();
//     this.shapes = this.createSquares(numberOfShapes);
//   }

//   grid() {
//     const offScreen = document.createElement("canvas");
//     offscreenCanvas.width = this.width;
//     offscreenCanvas.height = this.height;

//     for (let i = 0; i < this.width / 6; i++) {
//       for (let j = 0; j < this.height / 6; i++) {
//         offScreenCanvas;
//       }
//     }
//   }

//   //myCanvas.getContext('2d').drawImage(myCanvas.offScreenCanvas, 0, 0);

//   clearCanvas() {
//     this.context.beginPath();
//     this.context.fillStyle = "rgb(0, 0, 0)";
//     this.context.fillRect(0, 0, this.width, this.height);
//     this.context.closePath();
//   }

//   createSquares(numberOfCells) {
//     const returnArray = [];
//     for (let i = 0; i < numberOfCells; i++) {
//       returnArray.push(
//         new Square(
//           Math.round(Math.random() * this.width),
//           Math.round(Math.random() * this.height),
//           this.getRandomBlueColour()
//         )
//       );
//     }

//     return returnArray;
//   }

//   getRandomBlueColour() {
//     const colourVal = Math.random() * 200;

//     return [colourVal, colourVal, colourVal < 50 ? Math.random() * 255 : 255];
//   }

//   update(shape) {
//     shape.posX += shape.distX;
//     shape.posY += shape.distY;

//     if (
//       shape.posX - shape.size / 2 <= 0 ||
//       shape.posX + shape.size / 2 >= this.width
//     ) {
//       shape.distX = shape.distX * -1;
//     }
//     if (
//       shape.posY - shape.size / 2 <= 0 ||
//       shape.posY + shape.size / 2 >= this.height
//     ) {
//       shape.distY = shape.distY * -1;
//     }
//   }

//   run() {
//     this.running = setInterval(() => {
//       this.clearCanvas();
//       for (let shape of this.shapes) {
//         shape.draw(this.context);
//         this.update(shape);
//       }
//     }, 1000 / this.fps);
//   }
// }

const game = new Game(40, 6);
//game.run();
