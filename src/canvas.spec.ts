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

function getColorCellsString(length: number, color: string): string {
  return new Array(length).fill(color).join("");
}

describe("class Canvas", () => {
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
        ...new Array(10).fill(
          [BORDER, getEmptyCellsString(10), BORDER].join("")
        ),
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

  describe("can draw and paint", () => {
    let canvas: Canvas;
    const emptyRow = [BORDER, getEmptyCellsString(10), BORDER].join("");

    beforeEach(() => {
      canvas = new Canvas(10, 10);
    });

    describe("can draw lines", () => {
      it("draw vertical line", () => {
        canvas.newLine(2, 2, 2, 8);

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

      it("draw both horizontal and vertical lines", () => {
        canvas.newLine(2, 2, 8, 2);
        canvas.newLine(4, 1, 4, 8);

        const rowWithVerticalLine = [
          BORDER,
          getEmptyCellsString(4),
          LINE_CELL,
          getEmptyCellsString(5),
          BORDER,
        ].join("");

        expect(canvas.toString().split("\n")).eql([
          getBorderRowString(12),
          emptyRow,
          rowWithVerticalLine,
          [
            BORDER,
            getEmptyCellsString(2),
            getLineCellsString(7),
            EMPTY_CELL,
            BORDER,
          ].join(""),
          ...new Array(6).fill(rowWithVerticalLine),
          emptyRow,
          getBorderRowString(12),
        ]);
      });

      it("line outside canvas should fail", () => {
        expect(() => {
          canvas.newLine(20, 1, 20, 10);
        }).to.throw();
      });
    });

    describe("can draw rectangles", () => {
      it("draw one rectangle", () => {
        canvas.newRectangle(2, 2, 7, 8);

        const horizontalEdgesRow = [
          BORDER,
          getEmptyCellsString(2),
          getLineCellsString(6),
          getEmptyCellsString(2),
          BORDER,
        ].join("");

        expect(canvas.toString().split("\n")).eql([
          getBorderRowString(12),
          ...new Array(2).fill(emptyRow),
          horizontalEdgesRow,
          ...new Array(5).fill(
            [
              BORDER,
              getEmptyCellsString(2),
              LINE_CELL,
              getEmptyCellsString(4),
              LINE_CELL,
              getEmptyCellsString(2),
              BORDER,
            ].join("")
          ),
          horizontalEdgesRow,
          emptyRow,
          getBorderRowString(12),
        ]);
      });

      it("draw 2 rectangles", () => {
        canvas.newRectangle(2, 2, 7, 8);
        canvas.newRectangle(4, 4, 9, 5);

        const horizontalEdgesRow0 = [
          BORDER,
          getEmptyCellsString(2),
          getLineCellsString(6),
          getEmptyCellsString(2),
          BORDER,
        ].join("");
        const verticalEdgesRow0 = [
          BORDER,
          getEmptyCellsString(2),
          LINE_CELL,
          getEmptyCellsString(4),
          LINE_CELL,
          getEmptyCellsString(2),
          BORDER,
        ].join("");

        expect(canvas.toString().split("\n")).eql([
          getBorderRowString(12),
          ...new Array(2).fill(emptyRow),
          horizontalEdgesRow0,
          verticalEdgesRow0,
          ...new Array(2).fill(
            [
              BORDER,
              getEmptyCellsString(2),
              LINE_CELL,
              EMPTY_CELL,
              getLineCellsString(6),
              BORDER,
            ].join("")
          ),
          ...new Array(2).fill(verticalEdgesRow0),
          horizontalEdgesRow0,
          emptyRow,
          getBorderRowString(12),
        ]);
      });

      it("width of 0 should fail", () => {
        expect(() => {
          canvas.newRectangle(1, 3, 1, 4);
        }).to.throw();
      });

      it("height of 0 should fail", () => {
        expect(() => {
          canvas.newRectangle(1, 3, 2, 3);
        }).to.throw();
      });

      it("outside canvas should fail", () => {
        expect(() => {
          canvas.newRectangle(20, 1, 30, 10);
        }).to.throw();
      });
    });

    describe("can bucket fill", () => {
      const color = "c";
      const filledRow = [BORDER, getColorCellsString(10, color), BORDER].join(
        ""
      );

      it("fill whole canvas", () => {
        canvas.newLine(2, 2, 2, 8);
        canvas.fill(3, 3, color);

        const rowWithLine = [
          BORDER,
          getColorCellsString(2, color),
          LINE_CELL,
          getColorCellsString(7, color),
          BORDER,
        ].join("");

        expect(canvas.toString().split("\n")).eql([
          getBorderRowString(12),
          ...new Array(2).fill(filledRow),
          ...new Array(7).fill(rowWithLine),
          filledRow,
          getBorderRowString(12),
        ]);
      });

      it("fill outside", () => {
        canvas.newRectangle(2, 2, 7, 8);
        canvas.fill(3, 1, color);

        const horizontalEdgesRow = [
          BORDER,
          getColorCellsString(2, color),
          getLineCellsString(6),
          getColorCellsString(2, color),
          BORDER,
        ].join("");

        expect(canvas.toString().split("\n")).eql([
          getBorderRowString(12),
          ...new Array(2).fill(filledRow),
          horizontalEdgesRow,
          ...new Array(5).fill(
            [
              BORDER,
              getColorCellsString(2, color),
              LINE_CELL,
              getEmptyCellsString(4),
              LINE_CELL,
              getColorCellsString(2, color),
              BORDER,
            ].join("")
          ),
          horizontalEdgesRow,
          filledRow,
          getBorderRowString(12),
        ]);
      });

      it("fill inside", () => {
        canvas.newRectangle(2, 2, 7, 8);
        canvas.fill(3, 3, color);

        const horizontalEdgesRow = [
          BORDER,
          getEmptyCellsString(2),
          getLineCellsString(6),
          getEmptyCellsString(2),
          BORDER,
        ].join("");

        expect(canvas.toString().split("\n")).eql([
          getBorderRowString(12),
          ...new Array(2).fill(emptyRow),
          horizontalEdgesRow,
          ...new Array(5).fill(
            [
              BORDER,
              getEmptyCellsString(2),
              LINE_CELL,
              getColorCellsString(4, color),
              LINE_CELL,
              getEmptyCellsString(2),
              BORDER,
            ].join("")
          ),
          horizontalEdgesRow,
          emptyRow,
          getBorderRowString(12),
        ]);
      });

      it("fill on the line should fail", () => {
        expect(() => {
          canvas.newRectangle(1, 1, 2, 2);
          canvas.fill(1, 2, color);
        }).to.throw();
      });

      it("outside canvas should fail", () => {
        expect(() => {
          canvas.fill(20, 1, color);
        }).to.throw();
      });
    });
  });
});
