import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
}

type OptionalProps<T> = { [P in keyof T]?: T[P] | null}
type ChannelKey = number;
type Value = number;
type Channels = [ChannelKey, Value][]
export const Fixture = (fixture: OptionalProps<FixtureProps>) => {

  const handleChannelValues = () => {
    if (!fixture.profileChannels || !fixture.values) {
      return
    }

    const profileChannels: Channels = JSON.parse(fixture.profileChannels);
    const values: Array<number> = JSON.parse(fixture.values);

    const output: Record<string, number>[] | Array<string>= [];

    values.forEach(value => {
      const [key, outputVal] = value;
      // output.push([profileChannels[key], outputVal]);
      output.push(`${Math.trunc(outputVal / 255 * 100) }%` )
    });

    return output;
  }

  const handleOutput = () => {
    console.log(fixture);
  }

  return (
    <View key={fixture.fixtureAssignmentId} style={{ ...styles.fixtures}} onTouchStart={handleOutput}>
      <Text style={styles.text} >{fixture.channel}</Text>
      <Text style={styles.text} >{fixture.fixtureName}</Text>
      <Text style={styles.text} >{handleChannelValues()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fixtures: {
    backgroundColor: "gold",
    width: 200,
    height: 130,
    borderWidth: 4,
    margin: 10,
    borderColor: 'purple',
      },
  text: {
    fontWeight: '800',
    textAlign: "center",
    fontSize: 20
  }
})
