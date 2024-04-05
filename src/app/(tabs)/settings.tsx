import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function Tab() {
  const UNIVERSE_SIZE = 512;

  const buildUniverse = () => {
    const universe: React.JSX.Element[] = [];
    let row: React.JSX.Element[] = [];
    for (let i = 1; i <= UNIVERSE_SIZE; i++) {
      row.push(<View key={i} style={{ width: 25, height: 25, backgroundColor: 'gold', margin: 2, borderColor:'red', borderWidth: 1}}><Text>{i}</Text></View>);
      if (i % 10  === 0) {
        universe.push(
          <View key={`row` + i} style={{ width: 'auto', justifyContent: 'space-evenly'}}>
              {row}
          </View>
        );
        row = []
      }
    }
    return universe;
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <View style={{height: 600, flexDirection: 'row'}}>
        {buildUniverse()}
      </View>
    </View>
  );
}
