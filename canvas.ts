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

  setEmpty() {
    this.type = null;
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
      console.error("Both width and height must be greater than zero");
      return;
    }
  }

  //private
  validCoordinates(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private setCell(x: number, y: number, cell: Cell) {
    if (!this.validCoordinates(x, y)) {
      console.error(`Coordinates out of canvas`);
      return;
    }
    this.canvas[y][x] = cell;
  }

  private getCell(x: number, y: number): Cell | null {
    if (!this.validCoordinates(x, y)) {
      console.error(`Coordinates out of canvas`);
      return null;
    }
    return this.canvas[y][x];
  }

  // TODO: good?
  private static printRow(rowOfCells: (Cell | BorderCell)[]) {
    console.log(rowOfCells.join(""));
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

  newLine(x1: number, y1: number, x2: number, y2: number) {
    if (!this.validCoordinates(x1, y1) && !this.validCoordinates(x2, y2)) {
      console.error(`Coordinates out of canvas`);
      return;
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
        this.setCell(x1, y, new Cell({ type: CellType.line }));
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
        this.setCell(x, y1, new Cell({ type: CellType.line }));
      }
    } else {
      // TODO: implement
      console.error(
        "Currently only vertical and horizontal lines are supported"
      );
    }
  }

  newRectangle(x1: number, y1: number, x2: number, y2: number) {
    if (!this.validCoordinates(x1, y1) && !this.validCoordinates(x2, y2)) {
      console.error(`Coordinates out of canvas`);
      return;
    }

    // assume x1 <= x2 and y1 <= y2

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
    if (!this.validCoordinates(x, y)) {
      console.error(`Coordinates out of canvas`);
      return;
    }
    if (c.length !== 1) {
      console.error(`"c" must be a single charactor`);
      return;
    }

    let tmpStack: [number, number][] = [[x, y]];

    while (tmpStack.length) {
      const [x0, y0] = tmpStack.pop()!;

      if (!this.validCoordinates(x0, y0)) {
        // cell out of canvas, skip
        continue;
      }

      const cell0 = this.getCell(x0, y0)!;
      if (!cell0.isLine() && !cell0.isFilledBy(c)) {
        cell0.fillBy(c);
        this.setCell(x0, y0, cell0);

        // add adjacent coordinates
        tmpStack.push([x0 - 1, y0]);
        tmpStack.push([x0 + 1, y0]);
        tmpStack.push([x0, y0 - 1]);
        tmpStack.push([x0, y0 + 1]);
      }
    }
  }
}

/**
 * Test
 */

function drawLines(canvas: Canvas) {
  canvas.newLine(12, 2, 12, 19);
  canvas.newLine(47, 12, 2, 12);
  // canvas.newLine(19, 12, 19, 7);
}

function drawRects(canvas: Canvas) {
  canvas.newRectangle(2, 3, 27, 14);
  canvas.newRectangle(16, 9, 43, 17);
}

function fill(canvas: Canvas) {
  canvas.fill(10, 6, "2");
  canvas.fill(41, 15, "4");
  canvas.fill(17, 11, "7");
  canvas.fill(41, 14, "9");
}

function test() {
  const canvas = new Canvas(50, 20);
  drawLines(canvas);
  drawRects(canvas);
  fill(canvas);
  canvas.print();
}

// test();
