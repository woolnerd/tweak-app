import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function Tab() {
  const UNIVERSE_SIZE = 512;

  const buildUniverse = () => {
    const universe: React.JSX.Element[][] = [];
    for (let i = 1; i <= UNIVERSE_SIZE; i++) {
      const row: React.JSX.Element[] = [];
      for (let j = 1; j <= 10; j++) {
        row.push(<View style={{width: 10, height: 10, backgroundColor: 'gold', margin: 2}} />);
        if (j == 10) {
          universe.push(row);
        }
      }
    }
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text>Tab Settings</Text>
    </View>
  );
}
