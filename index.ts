import { Canvas } from "./canvas";

// function prompt() {
//   inquirer.prompt([constant.QUESTION]).then(answers => {
//     console.log('\n');
//     const data = validator(answers.command);
//     handleCommand(data);
//     console.log('\n');
//     ask();
//   });

// }

const canvas = new Canvas(20, 10);

// canvas.setCell(2,2,new Cell({type:CellType.}))

canvas.print();
