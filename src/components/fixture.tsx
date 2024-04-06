import { ControlPanelContext } from '@/app/contexts/control-panel';
import { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FixtureType = {
  channel: number;
  values: string;
  title?: string;
  profileChannels: string;
  profileName?: string;
  fixtureName: string;
  fixtureNotes?: string;
  fixtureId?: number;
  fixtureAssignmentId: number;
}

export type FixtureProps = {
  selectedFixtures: Set<number>;
  setSelectedFixtures: (fixtureIds: ( currentState: Set<number> )=> Set<number>) => void;
} & FixtureType

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
  const [selectedValue, setSelectedValue] = useState(handleChannelValues(profileChannels, values));
  const [manualHighlight, setManualHighlight] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);


  function handleChannelValues(
    profileChannels: string,
    values: string
  ): string | undefined {
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

  useEffect(() => {
    if (selectedFixtures.has(fixtureAssignmentId)) {
      setSelectedValue(ctrlPanelCtx);
      setManualHighlight(true);
      setUnsavedChanges(true);
    }

  }, [ctrlPanelCtx])

  useEffect(() => {
    console.log(selectedFixtures);

  }, [selectedFixtures])

  const getManualFixture = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(`@manual_fixtures_${fixtureAssignmentId}`);
      return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
      console.log(e);
    }

    // if (fixtureIds && fixture.fixtureAssignmentId in fixtureIds) {
    //   // cache is like a shadow list of fixtures with new info merged in.
    //   // it can extend a Fixture as a ManualFixture, could be stored as {id: manualFixtureInstance1, ...}
    // }

    console.log('Done.');
  }

  const setManualFixture = async (fixture: FixtureType) => {
    try {
      const jsonValue = JSON.stringify(fixture)
      await AsyncStorage.setItem(`@manual_fixtures_${fixture.fixtureAssignmentId}`, jsonValue)
    } catch(e) {
      // save error
      console.log(e);
    }
    console.log('Done.')
  };

  const handleOutput = (fixture: FixtureType) => {
    // toggles multiple fixtures in and out of set

    if (selectedFixtures.has(fixture.fixtureAssignmentId)) {
      setSelectedFixtures((curSet: Set<number>) => {
        const dupe = new Set([...curSet]);
        dupe.delete(fixture.fixtureAssignmentId);

        return dupe;
      });
    } else {
      setSelectedFixtures((curSet: Set<number>) => {
        const dupe = new Set([...curSet]);
        dupe.add(fixture.fixtureAssignmentId);
        return dupe;
      });
    }
    console.log(ctrlPanelCtx);
  };

  const selectedStyle = (fixtureAssignmentId: number) => {
    const styles: {color?: string, borderColor?: string} = {};

    if (unsavedChanges) {
      styles['color'] = 'rgb(256, 50, 50)';
    }

    if (selectedFixtures.has(fixtureAssignmentId)) {
      styles['borderColor'] = 'rgb(100, 256, 100)'
    } else {
      styles['borderColor'] = 'purple';
    }
    return styles;
  }

  return (
    <View
      key={fixtureAssignmentId}
      style={{ ...styles.fixtures, ...selectedStyle(fixtureAssignmentId) }}
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
      <Text style={{...styles.text, ...selectedStyle(fixtureAssignmentId)}}>{selectedValue}</Text>
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
