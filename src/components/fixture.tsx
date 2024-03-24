import { View, Text, StyleSheet } from 'react-native';

export type FixtureProps = {
  id?: number,
  name: string,
  notes?: string;
  manufacturerId?: number;
  assigned?: boolean;
}

export const Fixture = (fixture: FixtureProps) => {

  return (
    <View key={fixture.id} style={styles.fixtures}>
      <Text>{fixture.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fixtures: {
    backgroundColor: "yellow",
    width: 100,
    height: 100,
    borderColor: "black",
    borderWidth: 4,
    margin: 10,
    textAlign: "center"
  }
})
