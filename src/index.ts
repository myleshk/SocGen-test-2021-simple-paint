import { Canvas } from "./canvas";

const stdin = process.openStdin();

let canvas: Canvas | null = null;
stdin.addListener("data", (rawData) => {
  const command = rawData.toString().trim();

  // validate command
  let valid = /^(C \d+ \d+|(L|R) \d+ \d+ \d+ \d+|B \d+ \d+ \w|Q)$/.test(
    command
  );

  if (valid) {
    const [action, ...data] = command.split(" ");
    switch (action) {
      case "C":
        // create canvas
        canvas = new Canvas(Number(data[0]), Number(data[1]));
        break;

      case "L":
        if (canvas) {
          canvas.newLine(
            Number(data[0]),
            Number(data[1]),
            Number(data[2]),
            Number(data[3])
          );
        } else {
          console.error("Must create canvas first!");
        }
        break;

      case "R":
        if (canvas) {
          canvas?.newRectangle(
            Number(data[0]),
            Number(data[1]),
            Number(data[2]),
            Number(data[3])
          );
        } else {
          console.error("Must create canvas first!");
        }
        break;

      case "B":
        if (canvas) {
          canvas.fill(Number(data[0]), Number(data[1]), data[2]);
        } else {
          console.error("Must create canvas first!");
        }
        break;

      case "Q":
        process.exit();

      default:
        valid = false;
    }
  }

  if (valid) {
    if (canvas) {
      // only print canvas when there's change due to valid command
      canvas.print();
    }
    console.log("\nPlease input command:");
  } else {
    console.log("\nInvalid command! Please input command:");
  }
});
console.log("\nPlease input command: ");
