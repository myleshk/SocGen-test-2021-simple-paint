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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
var HORIZONTAL_LINE = "-";
var VERTICAL_LINE = "|";
var EMPTY_CELL_VALUE = " ";
var BORDER_CELL_VALUE = ".";
var CellType;
(function (CellType) {
    CellType[CellType["horizontalLine"] = 0] = "horizontalLine";
    CellType[CellType["verticalLine"] = 1] = "verticalLine";
    CellType[CellType["border"] = 2] = "border";
    CellType[CellType["empty"] = 3] = "empty";
    CellType[CellType["filled"] = 4] = "filled";
})(CellType || (CellType = {}));
var Cell = /** @class */ (function () {
    function Cell(cell) {
        this.filledBy = null;
        this.type = CellType.empty;
        // set cell according to provided values
        if (cell) {
            if (cell.filledBy) {
                this.fillBy(cell.filledBy);
            }
            else if (cell.type) {
                this.setType(cell.type);
            }
        }
    }
    Cell.prototype.fillBy = function (value) {
        this.type = CellType.filled;
        this.filledBy = value;
    };
    Cell.prototype.setType = function (type) {
        if (type === CellType.filled) {
            throw "Only fill with fillBy() method";
        }
        this.type = type;
        this.filledBy = null;
    };
    Cell.prototype.toString = function () {
        if (this.type === CellType.filled) {
            return this.filledBy;
        }
        else if (this.type === CellType.border) {
            return BORDER_CELL_VALUE;
        }
        else if (this.type === CellType.horizontalLine) {
            return HORIZONTAL_LINE;
        }
        else if (this.type === CellType.verticalLine) {
            return VERTICAL_LINE;
        }
        else if (this.type === CellType.empty) {
            return EMPTY_CELL_VALUE;
        }
    };
    return Cell;
}());
var Canvas = /** @class */ (function () {
    function Canvas(canvas) {
        this.canvas = [];
        this.height = 0;
        this.width = 0;
        if (canvas) {
            this.set(canvas);
        }
    }
    Canvas.prototype.set = function (canvas) {
        var _a;
        this.canvas = canvas;
        this.height = canvas.length;
        this.width = ((_a = canvas[0]) === null || _a === void 0 ? void 0 : _a.length) || 0;
    };
    Canvas.printRow = function (rowOfCells) {
        // add side border cells
        var borderCell = new Cell({ type: CellType.border });
        var cells = __spreadArray(__spreadArray([borderCell], rowOfCells, true), [borderCell], false);
        console.log(rowOfCells.join(""));
    };
    Canvas.prototype.print = function () {
        var borderCell = new Cell({ type: CellType.border });
        var borderRow = new Array(this.width + 2).fill(borderCell);
        // add top border
        Canvas.printRow(borderRow);
        for (var _i = 0, _a = this.canvas; _i < _a.length; _i++) {
            var rowData = _a[_i];
            Canvas.printRow(rowData);
        }
        // add bottom border
        Canvas.printRow(borderRow);
    };
    return Canvas;
}());
exports.Canvas = Canvas;
