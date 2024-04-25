import { eq } from "drizzle-orm";
import { View, Pressable, Text, StyleSheet } from "react-native";

import { FixtureControlData } from "./types/fixture.ts";
import { useManualFixtureStore } from "../app/store/useManualFixtureStore.ts";
import { db } from "../db/client.ts";
import { fixtureAssignments } from "../db/schema.ts";
import {
  clearCacheOnScene,
  getAllFixturesFromSceneKeys,
  getManualFixtureKeys,
} from "../util/fixture-cache.ts";
import ScenesToFixtureAssignments from "../models/scene-to-fixture-assignments.ts";
import { useCompositeFixtureStore } from "../app/store/useCompositeFixtureStore.ts";
import { useFixtureChannelSelectionStore } from "../app/store/useFixtureChannelSelectionStore.ts";

export type SceneProps = {
  name: string;
  id: number;
  setSelectedSceneId: (id: number) => void;
};

export function Scene({ name, id, setSelectedSceneId }: SceneProps) {
  const manualFixtures = useManualFixtureStore((state) => state.manualFixtures);
  const updateManualFixtures = useManualFixtureStore(
    (state) => state.updateManualFixtures,
  );

  const updateCompositeFixtures = useCompositeFixtureStore(
    (state) => state.updateCompositeFixtures,
  );

  const updateFixtureSelection = useFixtureChannelSelectionStore(
    (state) => state.updateFixtureSelection,
  );

  const handleScenePress = () => {
    setSelectedSceneId(id);
  };

  const handleRecPress2 = () => {
    updateDb(manualFixtures);
    //   .then((res) => {
    //   new ScenesToFixtureAssignments(db)
    //     .getCompositeFixtureInfo(id, new Set())
    //     .then((res1) => {
    //       console.log(res1);
    //       // updateCompositeFixtures(res1);
    //     });
    // });
    updateFixtureSelection(new Set());
    updateManualFixtures([]);
  };

  const handleRecPress = async () => {
    try {
      const keys = await getManualFixtureKeys();

      let cachedFixtures;

      if (keys) {
        cachedFixtures = await getAllFixturesFromSceneKeys(keys, id);
      } else {
        throw new Error("Something went wrong");
      }

      if (cachedFixtures) {
        updateDb(cachedFixtures)
          .then((res) => {
            console.log("Updated fixture assignments:");
          })
          .then((res) => {
            clearCacheOnScene(keys, id);
          });
      } else {
        throw new Error("Could not find results in cache");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateDb = async <
    T extends { values: number[][]; fixtureAssignmentId: number },
  >(
    manualFixtureState: T[],
  ) => {
    const valueObj = (fixture: T) => ({
      values: JSON.stringify(fixture.values),
    });
    let result: T[];
    try {
      await db.transaction(async (tx) => {
        result = await Promise.all(
          manualFixtureState.map((fixture: T) =>
            tx
              .update(fixtureAssignments)
              .set(valueObj(fixture))
              .where(eq(fixtureAssignments.id, fixture.fixtureAssignmentId))
              .returning(),
          ),
        );
      });

      return result;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{ flex: 2, flexDirection: "row", ...styles.sceneCtrl }}>
      <Pressable style={styles.rec} onPress={handleRecPress2}>
        <Text style={styles.btnText}>REC</Text>
      </Pressable>
      <Pressable style={styles.scene} onPress={handleScenePress}>
        <Text style={styles.btnText}>{name}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    borderColor: "purple",
    borderWidth: 2,
    margin: 4,
    height: "100%",
    minWidth: 130,
  },

  rec: {
    borderColor: "red",
    borderWidth: 2,
    margin: 4,
    color: "#fff",
    textAlign: "center",
    minWidth: 60,
    padding: 4,
  },

  sceneCtrl: {
    minHeight: 40,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: "space-between",
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    margin: "auto",
  },
});
