import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Fixture from '@/models/fixture';
import { SelectFixture } from '@/db/types/tables';
import { Fixture as FixtureComponent, FixtureProps } from './fixture';
import { db } from '@/db/client';

export const LayoutArea = () => {
  const [fixtures, setFixtures] = useState<SelectFixture[]>([])

  const fetchFixtures = async () => {
    try {
      return await new Fixture(db).getAll();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchFixtures().then(fixtures => setFixtures(fixtures));
  }, [])

  return (

    <View style={{
      ...styles.container, alignItems: "center",
    }}>
      {fixtures?.map(fixture => <FixtureComponent key={fixture.id} name={fixture.name} />)}
    </View>
  )
}



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
