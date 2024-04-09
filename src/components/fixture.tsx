import { ControlPanelContext } from '@/app/contexts/control-panel';
import { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { removeManualFixture, addManualFixture } from '@/util/fixture-cache';

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
  sceneId: number;
}

export type FixtureProps = {
  selectedFixtureIds: Set<number>;
  setSelectedFixtureIds: (fixtureIds: ( currentState: Set<number> )=> Set<number>) => void;
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
  selectedFixtureIds,
  setSelectedFixtureIds,
  sceneId
}: FixtureProps) => {
  const ctrlPanelCtx = useContext(ControlPanelContext);
  const [selectedValue, setSelectedValue] = useState<string | null>(handleChannelValues(profileChannels, values));
  const [manualHighlight, setManualHighlight] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);


  function handleChannelValues(
    profileChannels: string,
    values: string
  ): string | null {
    if (!profileChannels || !values) {
      return;
    }

    const parsedProfileChannels: Channels = JSON.parse(profileChannels);
    const parsedValues: Array<number> = JSON.parse(values);

    const output: Array<string> = [];

    parsedValues.forEach((value) => {
      const [key, outputVal] = value;
      // output.push([parsedProfileChannels[key], outputVal]);
      output.push(`${Math.trunc((outputVal / 255) * 100)}%`);
    });

    return output;
  };

  useEffect(() => {
    if (selectedFixtureIds.has(fixtureAssignmentId)) {
      setSelectedValue(ctrlPanelCtx);
      setManualHighlight(true);
      setUnsavedChanges(true);
    }

  }, [ctrlPanelCtx])

  useEffect(() => {
    // console.log(selectedFixtureIds);
    if (selectedFixtureIds.has(fixtureAssignmentId)) {
      addManualFixture({
        channel,
        fixtureName,
        profileChannels,
        values: JSON.stringify([[1, 200]]), //here we need the correctly parsed value
        fixtureAssignmentId,
        sceneId
      })
    } else {
      removeManualFixture(sceneId, fixtureAssignmentId);
    }
  }, [selectedFixtureIds])

  const handleOutput = (fixture: FixtureType) => {
    // toggles multiple fixtures in and out of set

    if (selectedFixtureIds.has(fixture.fixtureAssignmentId)) {
      setSelectedFixtureIds((curSet: Set<number>) => {
        const dupe = new Set([...curSet]);
        dupe.delete(fixture.fixtureAssignmentId);

        return dupe;
      });
    } else {
      setSelectedFixtureIds((curSet: Set<number>) => {
        const dupe = new Set([...curSet]);
        dupe.add(fixture.fixtureAssignmentId);
        return dupe;
      });
    }
    console.log('ctrlpanelctx', ctrlPanelCtx);
  };

  const selectedStyle = (fixtureAssignmentId: number) => {
    const styles: {color?: string, borderColor?: string} = {};

    if (unsavedChanges) {
      styles['color'] = 'rgb(256, 50, 30)';
    }

    if (selectedFixtureIds.has(fixtureAssignmentId)) {
      styles['borderColor'] = 'gold';
    } else {
      styles['borderColor'] = 'rgb(100, 256, 100)'
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
          sceneId
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
    backgroundColor: 'purple',
    width: 200,
    height: 130,
    borderWidth: 4,
    margin: 10,
    borderColor: 'gold',
  },
  text: {
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 20,
  },
});
