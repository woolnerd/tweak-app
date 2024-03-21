import {
  createScene,
  deleteScene,
  getAllScenes,
  getScene,
  updateScene,
} from '../scene';
import { Prisma, Scene } from '@prisma/client';
import { prismaMock } from '@/__mocks__/prisma';

const mockScene: Scene = {
  id: 1,
  name: 'Test Scene',
  orderNumber: 1,
};

describe('Scene model', () => {
  test('should create a new scene', async () => {
    const scene: Prisma.SceneCreateInput = {
      name: 'Test Scene',
      orderNumber: 1,
      sceneLists: {
        connect: [{ id: 1 }, { id: 2 }],
      },
      fixtureAssignments: {
        connect: [{ id: 1 }, { id: 2 }],
      },
    };

    prismaMock.scene.create.mockResolvedValue(mockScene);
    const result = await createScene(scene);
    expect(result.name).toEqual(scene.name);
    expect(prismaMock.scene.create).toHaveBeenCalledTimes(1);
  });

  test("should get scene by it's id", async () => {
    prismaMock.scene.findUnique.mockResolvedValue(mockScene);

    await expect(getScene(mockScene.id)).resolves.toEqual(mockScene);
  });

  test('should find all scenes', async () => {
    const mockScenes = [
      {
        id: 1,
        name: 'Test Scene1',
        orderNumber: 1,
      },
      {
        id: 2,
        name: 'Test Scene2',
        orderNumber: 2,
      },
    ];

    prismaMock.scene.findMany.mockResolvedValue(mockScenes);

    await expect(getAllScenes()).resolves.toHaveLength(2);
    await expect(getAllScenes()).resolves.toBe(mockScenes);
  });

  test('should update a scene', async () => {
    prismaMock.scene.update.mockResolvedValue(mockScene);

    await expect(updateScene(mockScene)).resolves.toEqual({
      id: 1,
      name: 'Test Scene',
      orderNumber: 1,
    });

    expect(prismaMock.scene.update).toHaveBeenCalledTimes(1);
  });

  test('should delete a scene', async () => {
    prismaMock.scene.delete.mockResolvedValue(mockScene);

    await expect(deleteScene(1)).resolves.toEqual(mockScene);
  });
});
