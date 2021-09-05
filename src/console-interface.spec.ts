import { expect } from "chai";
import { assert, createSandbox, SinonStub, SinonStubbedInstance } from "sinon";
import { Canvas } from "./canvas";
import { ConsoleInterface } from "./console-interface";

const FAKE_CANVAS_STRING = "FAKE_CANVAS_STRING";

const sandbox = createSandbox();

describe("class ConsoleInterface", () => {
  it("can create", () => {
    expect(() => {
      new ConsoleInterface();
    }).not.throw();
  });

  describe("can take commands", () => {
    let consoleInterface: ConsoleInterface;
    let canvasStub: SinonStubbedInstance<Canvas>;
    let quitStub: SinonStub;

    beforeEach(() => {
      // stub Canvas
      canvasStub = sandbox.stub(Canvas.prototype);
      canvasStub.toString.returns(FAKE_CANVAS_STRING);

      // stub process
      quitStub = sandbox.stub(process, "exit");

      consoleInterface = new ConsoleInterface();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("can create canvas", () => {
      const output = consoleInterface.executeCommand("C 10 10");
      expect(output).equal(FAKE_CANVAS_STRING);
    });

    it("fail if create canvas command invalid", () => {
      expect(() => {
        consoleInterface.executeCommand("C  1");
      }).to.throw();

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
      consoleInterface.executeCommand("L 1 2 2 2");
      expect(canvasStub.newLine.calledOnce);
    });

    it("fail if draw line command invalid", () => {
      consoleInterface.executeCommand("C 10 10");

      expect(() => {
        consoleInterface.executeCommand("L  1  3");
      }).to.throw();

      expect(() => {
        consoleInterface.executeCommand("L 1 2 3");
      }).to.throw();

      expect(() => {
        consoleInterface.executeCommand("L 1 2 3 4 5");
      }).to.throw();
    });

    it("can draw rectangle", () => {
      consoleInterface.executeCommand("C 10 10");
      consoleInterface.executeCommand("R 1 1 5 5");
      expect(canvasStub.newRectangle.calledOnce);
    });

    it("fail if draw rectangle command invalid", () => {
      consoleInterface.executeCommand("C 10 10");

      expect(() => {
        consoleInterface.executeCommand("R  2 3 4");
      }).to.throw();

      expect(() => {
        consoleInterface.executeCommand("R 1 2 3");
      }).to.throw();

      expect(() => {
        consoleInterface.executeCommand("R 1 2 3 4 5");
      }).to.throw();
    });

    it("can bucket fill", () => {
      consoleInterface.executeCommand("C 10 10");
      consoleInterface.executeCommand("B 1 2 c");
      expect(canvasStub.fill.calledOnce);
    });

    it("fail if bucket fill command invalid", () => {
      consoleInterface.executeCommand("C 10 10");

      expect(() => {
        consoleInterface.executeCommand("B  2 c");
      }).to.throw();

      expect(() => {
        consoleInterface.executeCommand("B 1 2");
      }).to.throw();

      expect(() => {
        consoleInterface.executeCommand("B 1 2 cc");
      }).to.throw();
    });

    it("can quit", () => {
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
