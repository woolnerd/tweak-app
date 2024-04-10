import handleDatabaseError from "../errors.ts";

describe("handleDatabaseError", () => {
  test("should throw an error with a message when passed an instance of Error", () => {
    expect(() => handleDatabaseError(new Error("There was a problem"))).toThrow(
      "Database operation failed: There was a problem",
    );
  });

  test("should throw an error with a message when passed an instance of a custom Error class", () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = "CustomError";
      }
    }

    expect(() => handleDatabaseError(new CustomError("Test error"))).toThrow(
      "Database operation failed: Test error",
    );
  });

  test("should throw a default error message if not passed an error object", () => {
    expect(() => handleDatabaseError("There was a problem")).toThrow(
      "Database operation failed with unknown error",
    );
    expect(() => handleDatabaseError(new Array())).toThrow(
      "Database operation failed with unknown error",
    );
  });
});
