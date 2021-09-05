import { ConsoleInterface } from "./console-interface";

const DEFAULT_PROMPT = "\nPlease input command and hit ENTER:";
const DEFAULT_ERROR_MESSAGE = "Unkown error";

const consoleInterface = new ConsoleInterface();
process.openStdin().addListener("data", (rawData) => {
  try {
    const result = consoleInterface.executeCommand(rawData.toString());
    console.log(result);
  } catch (error: any) {
    console.error(`Error: ${error.message || DEFAULT_ERROR_MESSAGE}`);
  }
  console.log(DEFAULT_PROMPT);
});
console.log(DEFAULT_PROMPT);
