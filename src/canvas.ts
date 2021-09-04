class OutOfCanvasError extends Error {
  message = "Coordinates are outside the canvas";
}

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

  // setter
  fillBy(value: string) {
    this.type = CellType.filled;
    this.filledBy = value;
  }

  setLine() {
    this.type = CellType.line;
    this.filledBy = null;
  }

  // getter
  isFilledBy(c: string): boolean {
    return this.type === CellType.filled && this.filledBy === c;
  }

  isLine(): boolean {
    return this.type === CellType.line;
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
export class Canvas {
  canvas: Cell[][] = [];
  height: number = 0;
  width: number = 0;

  constructor(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw Error("Both width and height must be greater than zero");
    }
    if (width > 200 || height > 200) {
      // limit for performance
      throw Error("Both width and height must be smaller than 200");
    }
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
  }

  //private
  private validCoordinates(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private getCell(x: number, y: number): Cell {
    if (!this.validCoordinates(x, y)) {
      throw new OutOfCanvasError();
    }
    return this.canvas[y][x];
  }

  toString(): string {
    const borderRowString = new Array(this.width + 2).fill(BORDER).join("");

    let resultString = "";

    // add top border
    resultString += borderRowString + "\n";

    for (const rowData of this.canvas) {
      // add side borders
      resultString += BORDER + rowData.join("") + BORDER + "\n";
    }

    // add bottom border
    resultString += borderRowString;

    return resultString;
  }

  newLine(x1: number, y1: number, x2: number, y2: number) {
    if (!this.validCoordinates(x1, y1) || !this.validCoordinates(x2, y2)) {
      throw new OutOfCanvasError();
    }

    if (x1 === x2) {
      // vertical line

      if (y1 > y2) {
        // swap y1 and y2 so that y1 < y2
        const yTmp = y1;
        y1 = y2;
        y2 = yTmp;
      }

      // draw the line
      for (let y = y1; y <= y2; y++) {
        this.getCell(x1, y).setLine();
      }
    } else if (y1 === y2) {
      // horizontal line

      if (x1 > x2) {
        // swap x1 and x2 so that x1 < x2
        const xTmp = x1;
        x1 = x2;
        x2 = xTmp;
      }

      // draw the line
      for (let x = x1; x <= x2; x++) {
        this.getCell(x, y1).setLine();
      }
    } else {
      // TODO: implement
      throw Error("Currently only vertical and horizontal lines are supported");
    }
  }

  newRectangle(x1: number, y1: number, x2: number, y2: number) {
    if (!this.validCoordinates(x1, y1) || !this.validCoordinates(x2, y2)) {
      throw new OutOfCanvasError();
    }

    if (x1 >= x2 || y1 >= y2) {
      throw new Error("Invalid coordinates of rectangle");
    }

    // draw the upper edge
    this.newLine(x1, y1, x2, y1);
    // draw the lower edge
    this.newLine(x1, y2, x2, y2);
    // draw the left edge
    this.newLine(x1, y1, x1, y2);
    // draw the right edge
    this.newLine(x2, y1, x2, y2);
  }

  fill(x: number, y: number, c: string) {
    if (this.getCell(x, y).isLine()) {
      throw new Error("Cannot fill on the line");
    }

    let tmpStack: [number, number][] = [[x, y]];

    while (tmpStack.length) {
      const [x0, y0] = tmpStack.pop()!;

      if (!this.validCoordinates(x0, y0)) {
        // cell out of canvas, skip
        continue;
      }

      const cell = this.getCell(x0, y0)!;
      if (!cell.isLine() && !cell.isFilledBy(c)) {
        cell.fillBy(c);

        // add adjacent coordinates
        tmpStack.push([x0 - 1, y0]);
        tmpStack.push([x0 + 1, y0]);
        tmpStack.push([x0, y0 - 1]);
        tmpStack.push([x0, y0 + 1]);
      }
    }
  }
}
