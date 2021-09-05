// Constants

const LINE_CELL = "x";
const BORDER = ".";
const EMPTY_CELL = " ";
const MAX_CANVAS_WIDTH = 200;
const MAX_CANVAS_HEIGHT = 50;

// Error classes

class InvalidCoordinatesError extends Error {}

class OutOfCanvasError extends InvalidCoordinatesError {
  message = "Coordinates are outside the canvas";
}

class InvalidColorError extends Error {}

class InvalidWidthError extends Error {
  message = `Width must be from 1 to ${MAX_CANVAS_WIDTH}`;
}

class InvalidHeightError extends Error {
  message = `Height must be from 1 to ${MAX_CANVAS_HEIGHT}`;
}

// Type definitions

enum CellType {
  line = "line",
  filled = "filled",
}

class Cell {
  private filledBy: string | null = null;
  private type: CellType | null = null;

  /**
   * Fill cell with color.
   *
   * @param color - The color to fill.
   */
  fillBy(color: string) {
    this.type = CellType.filled;
    this.filledBy = color;
  }

  /**
   * Set cell to be part of a line.
   */
  setLine() {
    this.type = CellType.line;
    this.filledBy = null;
  }

  /**
   * If the cell is filled with the color.
   *
   * @param color - The color to check.
   * @returns
   */
  isFilledWith(color: string): boolean {
    Cell.validateColor(color);
    return this.type === CellType.filled && this.filledBy === color;
  }

  /**
   * If the cell is part of a line.
   *
   * @returns
   */
  isLine(): boolean {
    return this.type === CellType.line;
  }

  /**
   * Get string representation of the cell.
   *
   * @returns The string of length one.
   */
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

  /**
   * Validates color. If fails, throw an error.
   *
   * @param color The color to validate.
   */
  static validateColor(color: string) {
    if (color.length !== 1) {
      throw new InvalidColorError("Only single character is allowed as color");
    }
    if (!/^(?!x)[a-z0-9]$/i.test(color)) {
      throw new InvalidColorError(
        `Only digit or English letter (except "x") is allowed`
      );
    }
  }
}

export class Canvas {
  canvas: Cell[][] = [];
  height: number = 0;
  width: number = 0;

  /**
   * Initiate the canvas with the specified dimensions.
   *
   * @param width
   * @param height
   */
  constructor(width: number, height: number) {
    // validations
    if (width <= 0 || width > MAX_CANVAS_WIDTH) {
      throw new InvalidWidthError();
    }

    if (height <= 0 || height > MAX_CANVAS_HEIGHT) {
      throw new InvalidHeightError();
    }

    // fill canvas with cells
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

  /**
   * Check if the coordinates are within the canvas.
   *
   * @param x
   * @param y
   * @returns
   */
  private validCoordinates(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Get the cell at the specified coordinates.
   *
   * @param x
   * @param y
   * @returns
   */
  private getCell(x: number, y: number): Cell {
    if (!this.validCoordinates(x, y)) {
      throw new OutOfCanvasError();
    }
    return this.canvas[y][x];
  }

  /**
   * Get string representation of the whole canvas with borders.
   *
   * @returns
   */
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

  /**
   * Draw a line from (x1, y1) to (x2, y2)
   *
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   */
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
      // TODO: implement line with any direction
      throw new InvalidCoordinatesError(
        "Currently only vertical and horizontal lines are supported"
      );
    }
  }

  /**
   * Draw a rectangle with (x1, y1) as the top left corner and (x2, y2) as the bottom right corner
   *
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   */
  newRectangle(x1: number, y1: number, x2: number, y2: number) {
    if (!this.validCoordinates(x1, y1) || !this.validCoordinates(x2, y2)) {
      throw new OutOfCanvasError();
    }

    if (x1 >= x2 || y1 >= y2) {
      throw new InvalidCoordinatesError(
        "Coordinates of rectangle must be from top left to bottom right"
      );
    }

    // draw the upper edge
    this.newLine(x1, y1, x2, y1);
    // draw the bottom edge
    this.newLine(x1, y2, x2, y2);
    // draw the left edge
    this.newLine(x1, y1, x1, y2);
    // draw the right edge
    this.newLine(x2, y1, x2, y2);
  }

  /**
   * Bucket fill the area containing (x, y) with the color (character) "c"
   *
   * @param x
   * @param y
   * @param c
   */
  fill(x: number, y: number, c: string) {
    if (this.getCell(x, y).isLine()) {
      throw new InvalidCoordinatesError("Cannot fill on the line");
    }

    // validate color and possibly throw and error
    Cell.validateColor(c);

    let tmpStack: [number, number][] = [[x, y]];

    while (tmpStack.length) {
      const [x0, y0] = tmpStack.pop()!;

      if (!this.validCoordinates(x0, y0)) {
        // cell out of canvas, skip
        continue;
      }

      const cell = this.getCell(x0, y0)!;
      if (!cell.isLine() && !cell.isFilledWith(c)) {
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
