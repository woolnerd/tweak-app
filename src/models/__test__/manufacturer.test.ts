import * as mock from "../__mocks__/manufacturer.mock";
import Manufacturer from "../manufacturer";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Manufacturer model", () => {
  test("creates a manufacturer", async () => {
    const { mockManufacturer, mockInsertDb } = mock;

    await expect(new Manufacturer(mockInsertDb).create(mockManufacturer)).resolves.toEqual(
      mockManufacturer,
    );
  });

  test("getAll returns all of the manufacturers", async () => {
    const { mockGetAllDb, mockManufacturerArray } = mock;
    await expect(new Manufacturer(mockGetAllDb).getAll()).resolves.toEqual(mockManufacturerArray);
  });
});
