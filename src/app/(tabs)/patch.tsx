import { View, Text } from "react-native";

export default function Tab() {
  const UNIVERSE_SIZE = 512;

  const buildUniverse = () => {
    const universe: React.JSX.Element[] = [];
    let row: React.JSX.Element[] = [];
    for (let i = 1; i <= UNIVERSE_SIZE; i += 1) {
      row.push(
        <View
          key={i}
          style={{
            width: 25,
            height: 25,
            backgroundColor: "gold",
            margin: 2,
            borderColor: "red",
            borderWidth: 1,
          }}>
          <Text>{i}</Text>
        </View>,
      );
      if (i % 10 === 0) {
        universe.push(
          <View
            key={`row${i}`}
            style={{ width: "auto", justifyContent: "space-evenly" }}>
            {row}
          </View>,
        );
        row = [];
      }
    }
    return universe;
  };
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View style={{ height: 600, flexDirection: "row" }}>
        <Text className="text-red-600 text-xl">Patch</Text>
      </View>
    </View>
  );
}
