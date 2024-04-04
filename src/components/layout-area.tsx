import React, { useEffect, useState, SetStateAction, Dispatch } from 'react';
import { StyleSheet, View } from 'react-native';
import ScenesToFixtureAssignments from '@/models/scene-to-fixture-assignments';
import { SelectFixture, SelectFixtureAssignment } from '@/db/types/tables';
import { Fixture as FixtureComponent, FixtureProps } from './fixture';
import { db } from '@/db/client';
import { fixtureAssignments, scenesToFixtureAssignments } from '@/db/schema';

export const LayoutArea = () => {

  type FixtureAssignmentResponse = {
    fixtureAssignmentId: number;
    channel: number;
    values: string | null;
    title: string | null;
    profileChannels: string | null;
    profileName: string | null;
    fixtureName: string | null;
    fixtureNotes: string | null;
  }[]


  const [fixtures, setFixtures] = useState<FixtureAssignmentResponse>([]);

  const temporarySceneId = 1;

  const fetchFixtures = async () => {
    try {
      const fixturesWithAssignments = await new ScenesToFixtureAssignments(
        db
      ).getFixturesAndAssignments(temporarySceneId);


      // console.log(fixturesWithAssignments);

      return fixturesWithAssignments;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchFixtures().then((res) => {
      if (res) setFixtures(res)
    });
  }, []);

  return (
    <View
      style={{
        ...styles.container,
        alignItems: 'center',
      }}
    >
      {fixtures?.map((fixture) => (
        <FixtureComponent key={fixture.fixtureAssignmentId} {...fixture} />
      ))}
    </View>
  );
};

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
    height: '100%',
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
    borderColor: 'blue',
    minHeight: 60,
    padding: 18,
    borderWidth: 2,
    margin: 4,
    height: 30,
    minWidth: 60,
  },

  sceneCtrl: {
    minHeight: 40,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },

  btnText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    margin: 'auto',
  },

  fixtures: {
    backgroundColor: 'yellow',
    width: 100,
    height: 100,
    borderColor: 'black',
    borderWidth: 4,
    margin: 10,
    textAlign: 'center',
  },
});
