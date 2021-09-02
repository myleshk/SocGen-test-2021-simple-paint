import { expect } from "chai";
import { Canvas } from "./canvas";

const LINE_CELL = "x";
const BORDER = ".";
const EMPTY_CELL = " ";

function getBorderRowString(length: number): string {
  return new Array(length).fill(BORDER).join("");
}
function getEmptyCellsString(length: number): string {
  return new Array(length).fill(EMPTY_CELL).join("");
}
function getLineCellsString(length: number): string {
  return new Array(length).fill(LINE_CELL).join("");
}

describe("can create", () => {
  it("sized 1x1", () => {
    const canvas = new Canvas(1, 1);
    expect(canvas.toString().split("\n")).eql([
      getBorderRowString(3),
      [BORDER, EMPTY_CELL, BORDER].join(""),
      getBorderRowString(3),
    ]);
  });

  it("sized 10x10", () => {
    const canvas = new Canvas(10, 10);
    expect(canvas.toString().split("\n")).eql([
      getBorderRowString(12),
      ...new Array(10).fill([BORDER, getEmptyCellsString(10), BORDER].join("")),
      getBorderRowString(12),
    ]);
  });

  it("size of 0 should fail", () => {
    expect(() => {
      new Canvas(0, 0);
    }).to.throw();
  });

  it("size too large should fail", () => {
    expect(() => {
      new Canvas(300, 300);
    }).to.throw();
  });
});

describe("can draw line", () => {
  let canvas: Canvas;

  beforeEach(() => {
    canvas = new Canvas(10, 10);
  });

  it("draw vertical line", () => {
    canvas.newLine(2, 2, 2, 8);

    const emptyRow = [BORDER, getEmptyCellsString(10), BORDER].join("");
    const rowWithLine = [
      BORDER,
      getEmptyCellsString(2),
      LINE_CELL,
      getEmptyCellsString(7),
      BORDER,
    ].join("");

    expect(canvas.toString().split("\n")).eql([
      getBorderRowString(12),
      ...new Array(2).fill(emptyRow),
      ...new Array(7).fill(rowWithLine),
      emptyRow,
      getBorderRowString(12),
    ]);
  });

  it("draw horizontal line", () => {
    canvas.newLine(2, 2, 8, 2);

    const emptyRow = [BORDER, getEmptyCellsString(10), BORDER].join("");

    expect(canvas.toString().split("\n")).eql([
      getBorderRowString(12),
      ...new Array(2).fill(emptyRow),
      [
        BORDER,
        getEmptyCellsString(2),
        getLineCellsString(7),
        EMPTY_CELL,
        BORDER,
      ].join(""),
      ...new Array(7).fill(emptyRow),
      getBorderRowString(12),
    ]);
  });
});
