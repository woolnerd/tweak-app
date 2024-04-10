// tests/show.test.ts
import { dbMock } from "../__mocks__/dbmock";

import Show from "@/models/show";

describe("Show", () => {
  let show: Show;

  beforeEach(() => {
    show = new Show(dbMock as any); // Casting as any for simplicity
  });

  it("should create a new show", async () => {
    const mockData = {
      name: "New Show",
      createdAt: "2023-04-01",
      updatedAt: "2023-04-01",
    };
    const result = await show.create(mockData);

    expect(dbMock.insert).toHaveBeenCalledWith(show.table);
    expect(dbMock.values).toHaveBeenCalledWith(mockData);
    expect(dbMock.returning).toHaveBeenCalled();
    expect(result).toEqual("mocked value");
  });

  // Add more tests for other methods like getAll, getById, update, delete...
});
