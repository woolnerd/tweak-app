import { SceneModel } from '../scene';
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
    const result = await new SceneModel().create(scene);
    expect(result.name).toEqual(scene.name);
    expect(prismaMock.scene.create).toHaveBeenCalledTimes(1);
  });

  test("should get scene by it's id", async () => {
    prismaMock.scene.findUnique.mockResolvedValue(mockScene);

    await expect(new SceneModel().getById(mockScene.id)).resolves.toEqual(
      mockScene
    );
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

    await expect(new SceneModel().getAll()).resolves.toHaveLength(2);
    await expect(new SceneModel().getAll()).resolves.toBe(mockScenes);
  });

  test('should update a scene', async () => {
    prismaMock.scene.update.mockResolvedValue(mockScene);

    await expect(new SceneModel().update(mockScene)).resolves.toEqual({
      id: 1,
      name: 'Test Scene',
      orderNumber: 1,
    });

    expect(prismaMock.scene.update).toHaveBeenCalledTimes(1);
  });

  test('should delete a scene', async () => {
    prismaMock.scene.delete.mockResolvedValue(mockScene);

    await expect(new SceneModel().delete(1)).resolves.toEqual(mockScene);
  });
});
