import { ShowModel } from '../show';
import { Prisma, Show } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

const mockShow: Show = {
  id: 1,
  name: 'Test Show',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Show model', () => {
  test('should create a new show with nested relations', async () => {
    const data: Prisma.ShowCreateInput = {
      name: 'Test Show',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const show = new ShowModel();
    prismaMock.show.create.mockResolvedValue(mockShow);

    await expect(show.create(data)).resolves.toEqual(mockShow);

    expect(prismaMock.show.create).toHaveBeenCalledTimes(1);

    expect(prismaMock.show.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Show',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    expect(show).toBeInstanceOf(ShowModel);
  });

  test("should get show by it's id", async () => {
    prismaMock.show.findUnique.mockResolvedValue(mockShow);

    const newShow = new ShowModel();

    await expect(newShow.getById(mockShow.id)).resolves.toEqual(mockShow);
  });

  test('should find all shows', async () => {
    const mockShows = [
      {
        id: 1,
        name: 'Test Show 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Test Show 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.show.findMany.mockResolvedValue(mockShows);

    const show = new ShowModel();

    await expect(show.getAll()).resolves.toHaveLength(2);
    await expect(show.getAll()).resolves.toBe(mockShows);
  });

  test('should update a show', async () => {
    prismaMock.show.update.mockResolvedValue(mockShow);

    const show = new ShowModel();

    await expect(show.update(mockShow)).resolves.toEqual({
      id: 1,
      name: 'Test Show',
      createdAt: mockShow.createdAt,
      updatedAt: mockShow.updatedAt,
    });

    expect(prismaMock.show.update).toHaveBeenCalledTimes(1);
  });

  test('should delete a show', async () => {
    prismaMock.show.delete.mockResolvedValue(mockShow);

    const show = new ShowModel();

    await expect(show.delete(1)).resolves.toEqual(mockShow);
  });
});
