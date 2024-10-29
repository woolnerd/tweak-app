// import CommandLineErrorHandler from "../command-line-error-handler.ts";
// import CommandLineStack from "../command-line-stack.ts";

jest.mock("../command-line-error-handler", () =>
  jest.fn().mockImplementation(() => ({
    ensureValid: jest
      .fn()
      .mockImplementation((command: string) => command !== "invalid"),
  })),
);

describe("CommandLineStack", () => {
  // test("test_clearAll_method", () => {
  //   const stack = new CommandLineStack();
  //   stack.add("command1");
  //   stack.add("command2");
  //   stack.clearAll();
  //   expect(stack.read).toEqual([]);
  // });

  test("test_clearLast_method", () => {
    // const stack = new CommandLineStack();
    // stack.add("command1");
    // stack.add("command2");
    // stack.clearLast();
    // expect(stack.read).toEqual(["command1"]);
  });

  // test("test_checkButtonType_method", () => {
  //   const stack = new CommandLineStack();
  //   stack.commands = ["valid", "invalid", "valid"];
  //   stack.checkButtonType();
  //   // Assuming ensureValid method filters out 'invalid'
  //   expect(stack.commands).toEqual(["valid", "valid"]);
  // });
});
