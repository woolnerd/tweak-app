import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  Pressable
} from 'react-native';
import { LayoutArea } from '@/components/layout-area';
import { Scene as SceneComponent, SceneProps } from '@/components/scene';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq, gt, sql } from "drizzle-orm";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';
import * as FileSystem from 'expo-file-system';
import * as schema from '@/db/schema';
import Fixture from '@/models/fixture'
import Patch from '@/models/patch';
import Scene from '@/models/scene';
import { InsertPatch, SelectScene } from '@/db/types/tables';

const expoDb = openDatabaseSync("dev.db");
const db = drizzle(expoDb, {schema});

type FixtureType = typeof schema.fixtures.$inferSelect

type Profile = typeof schema.profiles.$inferInsert;

type UpdateFixture = Pick<FixtureType, 'id'> & Partial<Omit<Fixture, 'id'>>;

type Scene = typeof schema.scenes.$inferInsert

const App = () => {
  const [color, setColor] = useState('');
  const [scenes, setScenes] = useState<SelectScene[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(FileSystem.documentDirectory);
  // const { success, error } = useMigrations(db, migrations);

  const fixture = { name: 'Vortex', notes: 'test' }
  const manufacturer = { name: 'Creamsource', website: "www.creamsource.com" }
  const patch: InsertPatch = { fixtureId: 1, profileId: 1, startAddress: 81, endAddress: 90, showId: 1, }
  const profile: Profile = { channelCount: 4, channels: JSON.stringify({ 1: 'Red', 2: 'Green', 3: 'Blue', 4: 'Intensity' }), name: 'mode 6' }


  const handleEnterBtn = () => {
    setColor(String(Math.random())), console.log('Simple Button pressed');

    (async () => {

      try {
        // const newPatch = await new Patch(db).create(patch)
      // const newFixture = await new Fixture(db).getAll({ with: { manufacturer: true } })
        // console.log('patch', newPatch);
        // await new Patch(db).create( { fixtureId: 1, profileId: 1, startAddress: 1, endAddress: 10, showId: 10, }).then(res => console.log('new patch: ', res))
        // await new Patch(db).getAll().then(res => console.log('patches', res.map(patch=> [patch.startAddress, patch.endAddress, patch.showId])))
        // console.log('patches', patches);
        // await new Patch(db).delete(10).then((res) => console.log(res))
        const res = await new Scene(db).getAllOrdered({ desc: false });
        console.log(res);

        setScenes(res);
  } catch (e) {
    console.log(e);
  }
    })()

  }

  // if (error) {
  //   return (
  //     <View>
  //       <Text>Migration error: {error.message}</Text>
  //     </View>
  //   );
  // }
  // if (!success) {
  //   return (
  //     <View>
  //       <Text>Migration is in progress...</Text>
  //     </View>
  //   );
  // }
  const fetchScenes = async () => {
    return await new Scene(db).getAllOrdered();
  }

  useEffect(() => {
    fetchScenes().then(scenes => setScenes(scenes));
  }, [])

  // const scenes: Scene[] = [{ name: 'Bedroom night', showId: 1, order: 1 }, { name: 'Exterior look1', showId:1, order: 2 }, { name: 'Interior look1', showId: 1, order: 3 }];

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        height: '80%',
        margin: 'auto',
        backgroundColor: 'black',
        padding: 20,
        borderWidth: 4,
        borderColor: "yellow"
      }}
    >
      <View style={{ flex: 1, ...styles.container }}>
        <View>
          <View style={{ flex: 1, borderColor: 'yellow', height: 100 }} />

          <Pressable style={styles.bigButtons} onPress={() => console.log('Simple Pressable pressed')}>
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Go to Out</Text>
          </Pressable>

          { scenes?.map((scene, i) => <SceneComponent key={ scene.name+i} name={scene.name} />) }

          <Pressable style={styles.bigButtons} onPress={() => { setColor(String(Math.random())), console.log('Simple Pressable pressed') }}>
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Banana</Text>
          </Pressable>


        </View>
        <View style={{ flex: 1, borderColor: 'yellow', height: 100 }} />
      </View>

      <View
        style={{
          flex: 3,
          ...styles.container,
        }}
      >
        <Button title="Enter"
          onPress={handleEnterBtn} />

        <LayoutArea />
      </View>

      <View style={{ flex: 1.5, ...styles.container }}>
        <View style={styles.rec}></View>
        <View style={styles.rec}></View>
        <View style={styles.rec}></View>
        <View style={styles.rec}></View>
      </View>
    </View >
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#cba601',
    borderWidth: 2,
    margin: 4,
  },

  scene: {
    borderColor: 'purple',
    borderWidth: 2,
    margin: 4,
    height: "100%",
    minWidth: 130,
  },

  rec: {
    borderColor: 'red',
    borderWidth: 2,
    margin: 4,
    color: '#fff',
    textAlign: 'center',
    minWidth: 60,
    padding: 4,
    // height: "100%"
  },

  bigButtons: {
    borderColor: "blue",
    minHeight: 60,
    padding: 18,
    borderWidth: 2,
    margin: 4,
    height: 30,
    minWidth: 60
  },

  sceneCtrl: {
    minHeight: 40,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: "space-between"
  },

  btnText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    margin: "auto"
  },

  fixtures: {
    backgroundColor: "yellow",
    width: 100,
    height: 100,
    borderColor: "black",
    borderWidth: 4,
    margin: 10,
    textAlign: "center"
  }
});
