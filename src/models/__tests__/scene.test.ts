import {
  mockSelect,
  mockFrom,
  mockOrderBy,
  dbMock,
  dbMockDsc,
  mockScenes,
  mockScenesDesc,
  mockSelectDsc,
} from "../__mocks__/scene.ts";
import Scene from "../scene.ts";

describe("Scene model - getAllOrdered", () => {
  beforeEach(() => {
    mockSelect.mockClear();
    mockFrom.mockClear();
    mockOrderBy.mockClear();
  });

  test("should retrieve all scenes in ascending order by default", async () => {
    const scene = new Scene(dbMock as any);
    const result = await scene.getAllOrdered();

    expect(result).toEqual(mockScenes);
  });

  test("should retrieve all scenes in descending order when specified", async () => {
    const scene = new Scene(dbMockDsc as any); // Casting to any due to mock
    const result = await scene.getAllOrdered({ desc: true });

    expect(mockSelectDsc).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockScenesDesc);
  });
});
