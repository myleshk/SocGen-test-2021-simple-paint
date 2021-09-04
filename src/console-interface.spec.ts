import { expect } from "chai";
import { assert, createSandbox } from "sinon";
import { Canvas } from "./canvas";
import { ConsoleInterface } from "./console-interface";

const FAKE_CANVAS_STRING = "FAKE_CANVAS_STRING";

const sandbox = createSandbox();

describe("class ConsoleInterface", () => {
  beforeEach(() => {
    sandbox.stub(Canvas.prototype, "toString").returns(FAKE_CANVAS_STRING);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("can create", () => {
    expect(() => {
      const consoleInterface = new ConsoleInterface();
    }).not.throw();
  });

  describe("can take commands", () => {
    let consoleInterface: ConsoleInterface;

    beforeEach(() => {
      consoleInterface = new ConsoleInterface();
    });

    it("can create canvas", () => {
      const output = consoleInterface.executeCommand("C 10 10");

      expect(output).equal(FAKE_CANVAS_STRING);
    });

    it("fail if create canvas command invalid", () => {
      expect(() => {
        consoleInterface.executeCommand("C 1 2 3");
      }).to.throw();

      expect(() => {
        consoleInterface.executeCommand("C 1 2 3 4 5");
      }).to.throw();
    });

    it("fail if draw before canvas created", () => {
      expect(() => {
        consoleInterface.executeCommand("L 1 2 2 2");
      }).to.throw();
    });

    it("can draw line", () => {
      consoleInterface.executeCommand("C 10 10");
      const newLineStub = sandbox.stub(Canvas.prototype, "newLine");
      consoleInterface.executeCommand("L 1 2 2 2");
      assert.calledOnce(newLineStub);
    });

    it("fail if draw line command invalid", () => {
      consoleInterface.executeCommand("C 10 10");
      expect(() => {
        consoleInterface.executeCommand("L 1 2 3");
      }).to.throw();
      expect(() => {
        consoleInterface.executeCommand("L 1 2 3 4 5");
      }).to.throw();
    });

    it("can draw rectangle", () => {
      consoleInterface.executeCommand("C 10 10");
      const newRectangleStub = sandbox.stub(Canvas.prototype, "newRectangle");
      consoleInterface.executeCommand("R 1 1 5 5");
      assert.calledOnce(newRectangleStub);
    });

    it("fail if draw rectangle command invalid", () => {
      consoleInterface.executeCommand("C 10 10");
      expect(() => {
        consoleInterface.executeCommand("R 1 2 3");
      }).to.throw();
      expect(() => {
        consoleInterface.executeCommand("R 1 2 3 4 5");
      }).to.throw();
    });

    it("can bucket fill", () => {
      consoleInterface.executeCommand("C 10 10");
      const bucketFillStub = sandbox.stub(Canvas.prototype, "fill");
      consoleInterface.executeCommand("B 1 2 c");
      assert.calledOnce(bucketFillStub);
    });

    it("fail if bucket fill command invalid", () => {
      consoleInterface.executeCommand("C 10 10");
      expect(() => {
        consoleInterface.executeCommand("B 1 2");
      }).to.throw();
      expect(() => {
        consoleInterface.executeCommand("B 1 2 cc");
      }).to.throw();
    });

    it("can quit", () => {
      const quitStub = sandbox.stub(process, "exit");
      consoleInterface.executeCommand("Q");
      assert.calledOnce(quitStub);
    });

    it("fail on other invalid commands", () => {
      expect(() => {
        consoleInterface.executeCommand("Q 123");
      }).to.throw();

      expect(() => {
        consoleInterface.executeCommand("dummy command");
      }).to.throw();
    });
  });
});
