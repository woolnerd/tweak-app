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
import Profile from '@/models/profile';
import Show from '@/models/show';
import { InsertPatch, SelectScene } from '@/db/types/tables';
import Manufacturer from '@/models/manufacturer';
import { seeds, Seeds } from '@/db/seeds';
import FixtureAssignment from '@/models/fixture-assignment';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { ControlPanel } from '@/components/control-panel';
import { ControlPanelContext } from '../contexts/control-panel';
import { FixtureCacheContext } from '../contexts/fixture-cache';

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
  const [ctrlPanelValue, setControlPanelValue] = useState<string | null>(null)
  // console.log(FileSystem.documentDirectory);
  // const { success, error } = useMigrations(db, migrations);

  const handleEnterBtn = () => {
    setColor(String(Math.random())), console.log('Simple Button pressed');

    (async () => {

  try {
    // const res = await new Fixture(db).create(seeds.fixtures)
    // console.log(res);
    // const res = await new Manufacturer(db).create(seeds.manufacturers)
    // console.log(res);
    // const res = await new Patch(db).create(seeds.patches)
    // console.log(res);
    // const res = await new Scene(db).create(seeds.scenes)
    // console.log(res);
    // const res = await new Profile(db).create(seeds.profiles)
    // console.log(res);
    // const res = await new FixtureAssignment(db).create(seeds.fixtureAssignments)
    // console.log(res);
    // const res = await new Show(db).create(seeds.shows)
    // console.log(res);
    // const res = await db.insert(schema.scenesToFixtureAssignments).values(seeds.scenesToFixtureAssignments)
    // console.log(res);
    // const res = await db.query.scenesToFixtureAssignments.findMany();
    // console.log(res);

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
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Label</Text>
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
          <ControlPanelContext.Provider value={ctrlPanelValue}>
            <LayoutArea />
          </ControlPanelContext.Provider>
      </View>

      <View style={{ flex: 1.5, flexDirection: 'row', ...styles.container}}>
        <ControlPanel setControlPanelValue={setControlPanelValue} />
      </View>
    </View >
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
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
    color: '#fff'
  },

  rec: {
    borderColor: 'red',
    borderWidth: 2,
    margin: 4,
    backgroundColor: '#000',
    color: '#fff',
    textAlign: 'center',
    minWidth: 60,
    padding: 4,
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
    color: '#fff',
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
  },

  touchpadBtn: {
    height: 50,
    width: '90%',
    backgroundColor: 'gray',
    marginVertical: 2,
    borderColor: 'blue',
    borderWidth: 2,
    gap: 2
  }
});
