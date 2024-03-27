import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  Pressable
} from 'react-native';
import { LayoutArea } from '@/components/layout-area';
import { Scene, SceneProps } from '@/components/scene';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq, gt, sql } from "drizzle-orm";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';
import * as FileSystem from 'expo-file-system';
import * as schema from '@/db/schema';

const expoDb = openDatabaseSync("dev.db");
const db = drizzle(expoDb, {schema});

type Fixture = typeof schema.fixtures.$inferSelect

type Profile = typeof schema.profiles.$inferInsert;

type UpdateFixture = Pick<Fixture, 'id'> & Partial<Omit<Fixture, 'id'>>;

type Scene = typeof schema.scenes.$inferInsert

const App = () => {
  const [color, setColor] = useState('');
  // console.log(FileSystem.documentDirectory);
  const { success, error } = useMigrations(db, migrations);

  async function getFixtures(){
    // return await db.query.fixtures.findMany()
    // return await db.select({name: schema.fixtures.name, id: schema.fixtures.id}).from(schema.fixtures)
    return await db.query.fixtures.findMany()
  }

  async function getManufacturers(){
    // return await db.query.fixtures.findMany();
    // return await db.select().from(schema.manufacturers)
    return await db.query.manufacturers.findMany()

  }

  async function getProfiles(){
    // return await db.query.fixtures.findMany();
    // return await db.select().from(schema.manufacturers)
    return await db.query.profiles.findMany()

  }



  const fixture = { name: 'Vortex', notes: 'test' }
  const manufacturer = { name: 'Creamsource', website: "www.creamsource.com" }

  const profile: Profile = {channelCount: 4, channels: JSON.stringify({1: 'Red', 2:'Green', 3: 'Blue', 4: 'Intensity'}), name: 'mode 6'}
  async function createManufacturer() {
    return await db.insert(schema.manufacturers).values(manufacturer);
  }

  async function deleteManufacturer() {
    return await db.delete(schema.manufacturers).where(gt(schema.manufacturers.id, 1));
  }

  async function deleteProfile() {
    return await db.delete(schema.profiles).where(gt(schema.profiles.id, 1));
  }

  async function createScenes(sceneArr) {
    return await db.insert(schema.scenes).values(sceneArr);
  }

  async function getScenes() {
    return await db.query.scenes.findMany()
  }

  async function createProfile(fixtureId: number) {
    const newProfileId = await db.insert(schema.profiles).values(profile).returning({profileId: schema.profiles.id});
    await db.insert(schema.profilesToFixtures).values({profileId: newProfileId[0].profileId, fixtureId})
  }

  async function createFixture() {
    return await db.insert(schema.fixtures).values(fixture);
  }
  async function updateFixture(data: UpdateFixture) {
    const { id } = data;
    return await db.update(schema.fixtures).set(data).where(eq(schema.fixtures.id, id))
  }
// schema.fixturesRelations.config
//   const result = await db.query.users.findMany({
//   with: {
//     posts: true
//   },
  // });
  // updateFixture()
  const [doThing, setDoThing] = useState(false);
  // createProfile()
  useEffect(() => {

    if (doThing) {
      console.log('in here');
      // createManufacturer()
      // createFixture();
    }
    // createScenes(scenes)
    setDoThing(false)
    // updateFixture({manufacturerId: 2, id: 2})
  }, [doThing])
  // deleteanufacturer()
  getFixtures().then((res) => console.log('fixtures:', res));
  getManufacturers().then(res => console.log('manufacturers:', res))
  getScenes().then(res=> console.log('scenes',res))
  // getProfiles().then(res => console.log('profiles', res))
  // deleteProfile()

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

// // Function to create the table if it doesn't exist
//   async function createTableIfNotExists () {
//     try {
//     // Check if the table exists
//     const result = await executeSql(
//       "SELECT name FROM sqlite_master WHERE type='table' AND name='fixture'"
//     );

//     // If the table doesn't exist, create it
//     if (result.rows.length === 0) {
//       await executeSql(
//         `CREATE TABLE IF NOT EXISTS fixture (
//           id INTEGER PRIMARY KEY,
//           name TEXT,
//           manufacturer_id INTEGER,
//           fixture_profile_id INTEGER,
//           notes TEXT
//         );`
//       );
//       console.log('Table created successfully.');
//     } else {
//       console.log('Table already exists.');
//     }
//     } catch (error) {
//       console.error('Error creating table:', error);
//     }
//   };

// // Call the function to create the table
//   createTableIfNotExists();
// }



  // const getThing = async () => {
  //   await createSL('banana');
  // }
  // getThing();
  // console.log('useEffect ran');
  // console.log(color);

  // useEffect(() => {
  //   const getThing = async () => {
  //     await createSL('banana');
  //   }
  //   getThing();
  //   console.log('useEffect ran');
  //   console.log(color);


  // }, [color])

  const scenes: Scene[] = [{ name: 'Bedroom night', showId: 1, order: 1 }, { name: 'Exterior look1', showId:1, order: 2 }, { name: 'Interior look1', showId: 1, order: 3 }];

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        height: '80%',
        margin: 'auto',
        backgroundColor: 'black',
        width: 400
      }}
    >
      <View style={{ flex: 1, ...styles.container }}>
        <View>
          <View style={{ flex: 1, borderColor: 'yellow', height: 100 }} />

          <Pressable style={styles.bigButtons} onPress={() => console.log('Simple Pressable pressed')}>
            <Text style={{ ...styles.btnText, fontSize: 18 }}>Go to Out</Text>
          </Pressable>

          {scenes.map((scene, i) => <Scene key={ scene.name+i} name={scene.name} />)}

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
          onPress={() => { setColor(String(Math.random())), console.log('Simple Button pressed') }} />

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
