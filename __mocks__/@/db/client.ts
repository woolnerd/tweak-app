type Test =
  | {
      fixtureAssignmentId: number;
      channel: number;
      values: string | null;
      title: string | null;
      profileChannels: string | null;
      profileName: string | null;
      fixtureName: string | null;
      fixtureNotes: string | null;
      sceneId: number | null;
    }[]
  | undefined;

export const mockData = {
  // Define mock data here
  fixtureAssignments: [
    {
      fixtureAssignmentId: 1,
      channel: 1,
      values: JSON.stringify([
        [1, 100],
        [2, 255],
      ]),
      title: "Fixture 1",
      profileChannels: JSON.stringify({
        1: "intensity",
        2: "red",
        3: "green",
        4: "blue",
      }),
      profileName: "Profile 1",
      fixtureName: "Fixture 1",
      fixtureNotes: "no notes",
      sceneId: 1,
    },
    {
      fixtureAssignmentId: 2,
      channel: 2,
      values: JSON.stringify([
        [1, 100],
        [2, 255],
      ]),
      title: "Fixture 2",
      profileChannels: JSON.stringify({
        1: "intensity",
        2: "red",
        3: "green",
        4: "blue",
      }),
      profileName: "Profile 1",
      fixtureName: "Fixture 2",
      fixtureNotes: "no notes",
      sceneId: 1,
    },
    {
      fixtureAssignmentId: 3,
      channel: 3,
      values: JSON.stringify([
        [1, 100],
        [2, 255],
      ]),
      title: "Fixture 1",
      profileChannels: JSON.stringify({
        1: "intensity",
        2: "red",
        3: "green",
        4: "blue",
      }),
      profileName: "Profile 1",
      fixtureName: "Fixture 3",
      fixtureNotes: "no notes",
      sceneId: 1,
    },
  ],
};
