import { Canvas } from "./canvas";

class InvalidCommandError extends Error {
  message = "Command is invalid";
}

class MissingCanvas extends Error {
  message = "Canvas is not created yet";
}

enum CommandAction {
  create = "C",
  line = "L",
  rectangle = "R",
  bucketFill = "B",
  quit = "Q",
}

type CommandData = (number | string)[];

const DEFAULT_PROMPT = "\nPlease input command: ";
const DEFAULT_ERROR_MESSAGE = "Unkown error";

export class ConsoleInterface {
  stdin: NodeJS.Socket;
  canvas: Canvas | null = null;

  constructor() {
    this.stdin = process.openStdin();
    this.listen();
  }

  listen() {
    this.stdin.addListener("data", (rawData) =>
      this.executeCommand(rawData.toString().trim())
    );
    console.log(DEFAULT_PROMPT);
  }

  private static unpackCommandOrThrow(command: string): {
    action: CommandAction;
    data: CommandData;
  } {
    const [rawAction, ...rawData] = command.split(" ");
    const action = rawAction as CommandAction;
    let data: CommandData = [];

    // unpack for each action
    switch (action as CommandAction) {
      case CommandAction.create:
        data = rawData.map((v) => Number(v));
        if (rawData.length !== 2 || !data.every((v) => v > 0)) {
          throw new InvalidCommandError();
        }
        break;

      case CommandAction.line:
      case CommandAction.rectangle:
        data = rawData.map((v) => Number(v));
        if (rawData.length !== 4 || !data.every((v) => v > 0)) {
          throw new InvalidCommandError();
        }
        break;

      case CommandAction.bucketFill:
        data = [Number(rawData[0]), Number(rawData[1]), rawData[2]];
        if (
          rawData.length !== 3 ||
          !data.every((v, index) =>
            index < 2 ? v > 0 : (v as string).length === 1
          )
        ) {
          throw new InvalidCommandError();
        }
        break;

      case CommandAction.quit:
        if (rawData.length > 0) {
          throw new InvalidCommandError();
        }
        break;

      default:
        throw new InvalidCommandError();
    }

    return { action, data };
  }

  private executeCommand(command: string) {
    try {
      const { action, data } = ConsoleInterface.unpackCommandOrThrow(command);

      // check if canvas is ready
      if (action !== CommandAction.create && !this.canvas) {
        throw new MissingCanvas();
      }

      switch (action) {
        case CommandAction.create:
          // create canvas
          this.canvas = new Canvas(data[0] as number, data[1] as number);
          break;

        case CommandAction.line:
          // draw new line
          this.canvas!.newLine(
            data[0] as number,
            data[1] as number,
            data[2] as number,
            data[3] as number
          );
          break;

        case CommandAction.rectangle:
          this.canvas!.newRectangle(
            data[0] as number,
            data[1] as number,
            data[2] as number,
            data[3] as number
          );
          break;

        case CommandAction.bucketFill:
          this.canvas!.fill(
            data[0] as number,
            data[1] as number,
            data[2] as string
          );
          break;

        case CommandAction.quit:
          process.exit();
      }

      // print latest canvas
      this.canvas!.print();
    } catch (error: any) {
      console.error(`Error: ${error.message || DEFAULT_ERROR_MESSAGE}`);
    }
    console.log(DEFAULT_PROMPT);
  }
}

/**
 * Test
 */

function test() {}

// test();
