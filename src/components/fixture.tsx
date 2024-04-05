import { ControlPanelContext } from '@/app/contexts/control-panel';
import { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// export type FixtureProps = {
//   id?: number,
//   name: string,
//   notes?: string;
//   manufacturerId?: number;
//   assigned?: boolean;
// }

export type FixtureProps = {
  channel: number;
  values: string;
  title: string;
  profileChannels: string;
  profileName: string;
  fixtureName: string;
  fixtureNotes: string;
  fixtureId: number;
  fixtureAssignmentId: number;
  selectedFixtures: Array<number>;
  setSelectedFixtures: ([]) => void;
};

type OptionalProps<T> = { [P in keyof T]?: T[P] | null };
type ChannelKey = number;
type Value = number;
type Channels = [ChannelKey, Value][];
export const Fixture = ({
  channel,
  fixtureName,
  profileChannels,
  values,
  fixtureAssignmentId,
  selectedFixtures,
  setSelectedFixtures,
}: FixtureProps) => {
  const ctrlPanelCtx = useContext(ControlPanelContext);

  const handleChannelValues = (
    profileChannels: string,
    values: string
  ): string | undefined => {
    if (!profileChannels || !values) {
      return;
    }

    const parsedProfileChannels: Channels = JSON.parse(profileChannels);
    const parsedValues: Array<number> = JSON.parse(values);

    const output: Record<string, number>[] | Array<string> = [];

    parsedValues.forEach((value) => {
      const [key, outputVal] = value;
      // output.push([parsedProfileChannels[key], outputVal]);
      output.push(`${Math.trunc((outputVal / 255) * 100)}%`);
    });

    return output;
  };

  const handleOutput = (fixture: FixtureProps) => {
    const getMyObject = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@live_fixtures');
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
      } catch (e) {
        // read error
        console.log(e);
      }

      const fixtureIds = getMyObject();

      if (fixtureIds && id in fixtureIds) {
        // cache is like a shadow list of fixtures with new info merged in.
        // it can extend a Fixture as a ManualFixture, could be stored as {id: manualFixtureInstance1, ...}
      }

      console.log('Done.');
    };

    const idx = selectedFixtures.findIndex((fixture) => fixture.fixtureAssignmentId === id);
    if (idx !== -1) {
      selectedFixtures[idx] = -1;
      setSelectedFixtures(selectedFixtures.filter((id) => id !== -1));
    } else {
      setSelectedFixtures([...selectedFixtures, id]);
    }
    console.log(ctrlPanelCtx);
  };

  const selectedStyle = selectedFixtures.includes(fixtureAssignmentId)
    ? { borderColor: 'rgb(100,256,100)' }
    : { borderColor: 'purple' };

  const selectedValue = selectedFixtures.includes(fixtureAssignmentId)
    ? ctrlPanelCtx
    : handleChannelValues(profileChannels, values);

  return (
    <View
      key={fixtureAssignmentId}
      style={{ ...styles.fixtures, ...selectedStyle }}
      onTouchStart={() =>
        handleOutput({
          channel,
          fixtureName,
          profileChannels,
          values,
          fixtureAssignmentId,
        })
      }
    >
      <Text style={styles.text}>{channel}</Text>
      <Text style={styles.text}>{fixtureName}</Text>
      <Text style={styles.text}>{selectedValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fixtures: {
    backgroundColor: 'gold',
    width: 200,
    height: 130,
    borderWidth: 4,
    margin: 10,
    borderColor: 'purple',
  },
  text: {
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 20,
  },
});
