"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("./canvas");
// function prompt() {
//   inquirer.prompt([constant.QUESTION]).then(answers => {
//     console.log('\n');
//     const data = validator(answers.command);
//     handleCommand(data);
//     console.log('\n');
//     ask();
//   });
// }
var canvas = new canvas_1.Canvas();
canvas.set([
    [
        canvas_1.CellState.empty,
        canvas_1.CellState.filled,
        canvas_1.CellState.horizontalLine,
        canvas_1.CellState.horizontalLine,
    ],
    [
        canvas_1.CellState.empty,
        canvas_1.CellState.filled,
        canvas_1.CellState.horizontalLine,
        canvas_1.CellState.horizontalLine,
    ],
    [canvas_1.CellState.empty, canvas_1.CellState.filled, canvas_1.CellState.verticalLine, canvas_1.CellState.filled],
    [canvas_1.CellState.empty, canvas_1.CellState.filled, canvas_1.CellState.verticalLine, canvas_1.CellState.filled],
    [canvas_1.CellState.empty, canvas_1.CellState.filled, canvas_1.CellState.verticalLine, canvas_1.CellState.filled],
]);
canvas.print();
