import { dbMock } from "../__mocks__/dbmock.ts";
import Show from "../show.ts";

describe("Show", () => {
  let show: Show;

  beforeEach(() => {
    show = new Show(dbMock as any);
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
});
