import { ConsoleInterface } from "./console-interface";

// Constants

const DEFAULT_PROMPT = "\nPlease input command and hit ENTER:";
const DEFAULT_ERROR_MESSAGE = "Unkown error";

function main() {
  // Create the console interface instance
  const consoleInterface = new ConsoleInterface();

  // listen to user input and pass to console interface for handling
  process.openStdin().addListener("data", (rawData) => {
    try {
      const result = consoleInterface.executeCommand(rawData.toString());

      // print out the result returned
      console.log(result);
    } catch (error: any) {
      // print out the error caught
      console.error(`Error: ${error.message || DEFAULT_ERROR_MESSAGE}`);
    }
    console.log(DEFAULT_PROMPT);
  });
  console.log(DEFAULT_PROMPT);
}

main();
