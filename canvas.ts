const LINE_CELL = "x";
const BORDER = ".";
const EMPTY_CELL = " ";

enum CellType {
  line = "line",
  filled = "filled",
}

class Cell {
  private filledBy: string | null = null;
  private type: CellType | null = null;

  constructor(cell?: { type: CellType; filledBy?: string | null }) {
    // set cell according to provided values
    if (cell?.filledBy) {
      this.fillBy(cell.filledBy);
    } else if (cell?.type === CellType.line) {
      this.setLine();
    }
  }

  fillBy(value: string) {
    this.type = CellType.filled;
    this.filledBy = value;
  }

  setLine() {
    this.type = CellType.line;
    this.filledBy = null;
  }

  setEmpty() {
    this.type = null;
    this.filledBy = null;
  }

  toString() {
    switch (this.type) {
      case CellType.filled:
        return this.filledBy;

      case CellType.line:
        return LINE_CELL;

      default:
        return EMPTY_CELL;
    }
  }
}

class BorderCell {
  toString() {
    return BORDER;
  }
}

export class Canvas {
  canvas: Cell[][] = [];
  height: number = 0;
  width: number = 0;

  constructor(width: number, height: number) {
    if (width > 0 && height > 0) {
      // init canvas
      this.width = width;
      this.height = height;
      this.canvas = [];
      for (let y = 0; y < height; y++) {
        const rowOfCells = [];
        for (let x = 0; x < width; x++) {
          rowOfCells.push(new Cell());
        }
        this.canvas.push(rowOfCells);
      }
    } else {
      throw "Both width and height must be greater than zero";
    }
  }

  //private
  setCell(x: number, y: number, cell: Cell) {
    this.canvas[y][x] = cell;
  }

  private static printRow(rowOfCells: (Cell | BorderCell)[]) {
    console.log(rowOfCells.join(" "));
  }

  print() {
    const borderCell = new BorderCell();
    const borderRow = new Array(this.width + 2).fill(borderCell);

    // add top border
    Canvas.printRow(borderRow);

    for (const rowData of this.canvas) {
      // add side border cells
      Canvas.printRow([borderCell, ...rowData, borderCell]);
    }

    // add bottom border
    Canvas.printRow(borderRow);
  }

  // function createCanvas(data) {
  //   if (data.w === 0 || data.h === 0) {
  //     return;
  //   }
  //   const yAxisArr = [];
  //   const border = 2;
  //   const height = data.h + border;
  //   const yAxisEnd = height - 1;
  //   const width = data.w + border;
  //   const xAxisEnd = width - 1;
  //   for (let y = 0; y < height; y++) {
  //     const xAxisArr = [];
  //     for (let x = 0; x < width; x++) {
  //       let drawValue = initDrawValue;
  //       if (y === 0 || y === yAxisEnd) {
  //         drawValue = xBorderValue;
  //       } else if (x === 0 || x === xAxisEnd) {
  //         drawValue = yBorderValue;
  //       }
  //       xAxisArr.push({
  //         draw: drawValue,
  //       });
  //     }
  //     yAxisArr.push(xAxisArr);
  //   }
  //   return yAxisArr;
  // }

  // function updateCanvasData(updateData, canvasData) {
  //   const len = updateData.length;
  //   for (let i = 0; i < len; i++) {
  //     const dataCoordinate = updateData[i];
  //     const x = dataCoordinate[0];
  //     const y = dataCoordinate[1];
  //     if (canvasData[y] && canvasData[y][x]) {
  //       const canvasDataCoordinate = canvasData[y][x];
  //       if (canvasDataCoordinate.draw === initDrawValue) {
  //         canvasDataCoordinate.draw = defaultDrawValue;
  //       }
  //     }
  //   }
  // }

  // function newLine(data, canvasData) {
  //   const newLineData = newLineApi(data);
  //   updateCanvasData(newLineData, canvasData);
  // }

  // function newRectangle(data, canvasData) {
  //   const newRectangleData = newRectangleApi(data);
  //   updateCanvasData(newRectangleData, canvasData);
  // }

  // function fill(data, canvasData) {
  //   fillApi(data, canvasData, initDrawValue);
  // }
}

const canvas = new Canvas(20, 10);

canvas.setCell(2, 2, new Cell({ type: CellType.line }));
canvas.setCell(2, 3, new Cell({ type: CellType.line }));
canvas.setCell(2, 4, new Cell({ type: CellType.line }));
canvas.setCell(2, 5, new Cell({ type: CellType.line }));

canvas.setCell(3, 5, new Cell({ type: CellType.line }));
canvas.setCell(3, 6, new Cell({ type: CellType.line }));
canvas.setCell(3, 7, new Cell({ type: CellType.line }));
canvas.setCell(3, 8, new Cell({ type: CellType.line }));

canvas.setCell(2, 8, new Cell({ type: CellType.line }));
canvas.setCell(3, 8, new Cell({ type: CellType.line }));
canvas.setCell(4, 8, new Cell({ type: CellType.line }));
canvas.setCell(5, 8, new Cell({ type: CellType.line }));
canvas.setCell(6, 8, new Cell({ type: CellType.line }));

canvas.setCell(5, 5, new Cell({ type: CellType.filled, filledBy: "x" }));
canvas.setCell(4, 4, new Cell({ type: CellType.filled, filledBy: "y" }));

// TODO: cross line?

canvas.print();
