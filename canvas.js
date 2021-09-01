"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Canvas = void 0;
var LINE_CELL = "x";
var BORDER = ".";
var EMPTY_CELL = " ";
var CellType;
(function (CellType) {
    CellType["line"] = "line";
    CellType["filled"] = "filled";
})(CellType || (CellType = {}));
var Cell = /** @class */ (function () {
    function Cell(cell) {
        this.filledBy = null;
        this.type = null;
        // set cell according to provided values
        if (cell === null || cell === void 0 ? void 0 : cell.filledBy) {
            this.fillBy(cell.filledBy);
        }
        else if ((cell === null || cell === void 0 ? void 0 : cell.type) === CellType.line) {
            this.setLine();
        }
    }
    // setter
    Cell.prototype.fillBy = function (value) {
        this.type = CellType.filled;
        this.filledBy = value;
    };
    Cell.prototype.setLine = function () {
        this.type = CellType.line;
        this.filledBy = null;
    };
    Cell.prototype.setEmpty = function () {
        this.type = null;
        this.filledBy = null;
    };
    // getter
    Cell.prototype.isFilled = function () {
        return this.type === CellType.filled;
    };
    Cell.prototype.isLine = function () {
        return this.type === CellType.line;
    };
    Cell.prototype.toString = function () {
        switch (this.type) {
            case CellType.filled:
                return this.filledBy;
            case CellType.line:
                return LINE_CELL;
            default:
                return EMPTY_CELL;
        }
    };
    return Cell;
}());
var BorderCell = /** @class */ (function () {
    function BorderCell() {
    }
    BorderCell.prototype.toString = function () {
        return BORDER;
    };
    return BorderCell;
}());
var Canvas = /** @class */ (function () {
    function Canvas(width, height) {
        this.canvas = [];
        this.height = 0;
        this.width = 0;
        if (width > 0 && height > 0) {
            // init canvas
            this.width = width;
            this.height = height;
            this.canvas = [];
            for (var y = 0; y < height; y++) {
                var rowOfCells = [];
                for (var x = 0; x < width; x++) {
                    rowOfCells.push(new Cell());
                }
                this.canvas.push(rowOfCells);
            }
        }
        else {
            throw "Both width and height must be greater than zero";
        }
    }
    //private
    Canvas.prototype.validCoordinates = function (x, y) {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    };
    Canvas.prototype.setCell = function (x, y, cell) {
        this.canvas[y][x] = cell;
    };
    Canvas.prototype.getCell = function (x, y) {
        if (!this.validCoordinates(x, y)) {
            throw "Coordinates (" + x + ", " + y + ") out of canvas";
        }
        return this.canvas[y][x];
    };
    // TODO: good?
    Canvas.printRow = function (rowOfCells) {
        console.log(rowOfCells.join(""));
    };
    Canvas.prototype.print = function () {
        var borderCell = new BorderCell();
        var borderRow = new Array(this.width + 2).fill(borderCell);
        // add top border
        Canvas.printRow(borderRow);
        for (var _i = 0, _a = this.canvas; _i < _a.length; _i++) {
            var rowData = _a[_i];
            // add side border cells
            Canvas.printRow(__spreadArray(__spreadArray([borderCell], rowData, true), [borderCell], false));
        }
        // add bottom border
        Canvas.printRow(borderRow);
    };
    Canvas.prototype.newLine = function (x1, y1, x2, y2) {
        if (x1 === x2) {
            // vertical line
            if (y1 > y2) {
                // swap y1 and y2 so that y1 < y2
                var yTmp = y1;
                y1 = y2;
                y2 = yTmp;
            }
            // draw the line
            for (var y = y1; y <= y2; y++) {
                this.setCell(x1, y, new Cell({ type: CellType.line }));
            }
        }
        else if (y1 === y2) {
            // horizontal line
            if (x1 > x2) {
                // swap x1 and x2 so that x1 < x2
                var xTmp = x1;
                x1 = x2;
                x2 = xTmp;
            }
            // draw the line
            for (var x = x1; x <= x2; x++) {
                this.setCell(x, y1, new Cell({ type: CellType.line }));
            }
        }
    };
    Canvas.prototype.newRectangle = function (x1, y1, x2, y2) {
        // assume x1 <= x2 and y1 <= y2
        // draw the upper edge
        this.newLine(x1, y1, x2, y1);
        // draw the lower edge
        this.newLine(x1, y2, x2, y2);
        // draw the left edge
        this.newLine(x1, y1, x1, y2);
        // draw the right edge
        this.newLine(x2, y1, x2, y2);
    };
    Canvas.prototype.fill = function (x, y, c) {
        if (!this.validCoordinates(x, y)) {
            throw "Coordinates (" + x + ", " + y + ") out of canvas";
        }
        var tmpStack = [[x, y]];
        while (tmpStack.length) {
            var _a = tmpStack.pop(), x0 = _a[0], y0 = _a[1];
            if (!this.validCoordinates(x0, y0)) {
                // cell out of canvas, skip
                continue;
            }
            var cell0 = this.getCell(x0, y0);
            if (!cell0.isLine()) {
                cell0.fillBy(c);
                this.setCell(x0, y0, cell0);
                // add adjacent coordinates
                tmpStack.push([x0 - 1, y0]);
                tmpStack.push([x0 + 1, y0]);
                tmpStack.push([x0, y0 - 1]);
                tmpStack.push([x0, y0 + 1]);
            }
        }
    };
    return Canvas;
}());
exports.Canvas = Canvas;
function drawLines(canvas) {
    canvas.newLine(12, 2, 12, 5);
    canvas.newLine(32, 18, 46, 18);
    canvas.newLine(27, 10, 22, 10);
    canvas.newLine(19, 12, 19, 7);
}
function drawRects(canvas) {
    canvas.newRectangle(2, 3, 27, 14);
    canvas.newRectangle(16, 9, 43, 17);
}
function fill(canvas) {
    canvas.fill(10, 6, "5");
}
var canvas = new Canvas(50, 20);
// drawLines(canvas);
drawRects(canvas);
fill(canvas);
canvas.print();
// drawRects();
