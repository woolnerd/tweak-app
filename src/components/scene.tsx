import { eq } from "drizzle-orm";
import { View, Pressable, Text, StyleSheet } from "react-native";

import { FixtureType } from "./fixture.tsx";
import { db } from "../db/client.ts";
import { fixtureAssignments } from "../db/schema.ts";
import {
  clearCacheOnScene,
  getAllFixturesFromSceneKeys,
  getManualFixtureKeys,
} from "../util/fixture-cache.ts";

export type SceneProps = {
  name: string;
  id: number;
  setSelectedSceneId: (id: number) => void;
};

export function Scene(props: SceneProps) {
  const handleScenePress = () => {
    props.setSelectedSceneId(props.id);
  };

  const handleRecPress = async () => {
    try {
      const keys = await getManualFixtureKeys();

      let cachedFixtures;

      if (keys) {
        cachedFixtures = await getAllFixturesFromSceneKeys(keys, props.id);
      } else {
        throw new Error("Something went wrong");
      }

      if (cachedFixtures) {
        updateDb(cachedFixtures)
          .then((res) => {
            console.log("Updated fixture assignments:");
          })
          .then((res) => {
            clearCacheOnScene(keys, props.id);
          });
      } else {
        throw new Error("Could not find results in cache");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateDb = async (cache: FixtureType[]) => {
    try {
      await db
        .transaction(async (tx) => {
          cache.forEach(async (fixture: FixtureType) => {
            await tx
              .update(fixtureAssignments)
              .set({ values: fixture.values })
              .where(eq(fixtureAssignments.id, fixture.fixtureAssignmentId))
              .returning();
          });
        })
        .then((res) => console.log("completed", res))
        .catch((err) => console.log(err));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{ flex: 2, flexDirection: "row", ...styles.sceneCtrl }}>
      <Pressable style={styles.rec} onPress={handleRecPress}>
        <Text style={styles.btnText}>REC</Text>
      </Pressable>
      <Pressable style={styles.scene} onPress={handleScenePress}>
        <Text style={styles.btnText}>{props.name}</Text>
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
