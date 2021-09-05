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

export class ConsoleInterface {
  private canvas: Canvas | null = null;

  private static unpackCommandOrThrow(command: string): {
    action: CommandAction;
    data: CommandData;
  } {
    const [rawAction, ...rawData] = command.trim().split(/\s+/);
    const action = rawAction as CommandAction;
    let data: CommandData = [];

    // unpack for each action
    switch (action as CommandAction) {
      case CommandAction.create:
        data = rawData.map((v) => Number(v));
        if (rawData.length !== 2 || data.some((v) => isNaN(v as number))) {
          throw new InvalidCommandError();
        }
        break;

      case CommandAction.line:
      case CommandAction.rectangle:
        data = rawData.map((v) => Number(v));
        if (rawData.length !== 4 || data.some((v) => isNaN(v as number))) {
          throw new InvalidCommandError();
        }
        break;

      case CommandAction.bucketFill:
        data = [Number(rawData[0]), Number(rawData[1]), rawData[2]];
        if (
          rawData.length !== 3 ||
          data.some((v, index) =>
            index < 2 ? isNaN(v as number) : (v as string).length !== 1
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

  executeCommand(command: string): string {
    const { action, data } = ConsoleInterface.unpackCommandOrThrow(command);

    // check if canvas is ready
    if (
      [
        CommandAction.line,
        CommandAction.rectangle,
        CommandAction.bucketFill,
      ].includes(action) &&
      !this.canvas
    ) {
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

    // always print latest canvas
    return this.canvas?.toString() || "";
  }
}
