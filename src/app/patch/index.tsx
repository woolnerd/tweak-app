import { View, Text } from "react-native";

export default function Patch() {
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
    <View className="flex-1 justify-center items-center bg-gray-100">
      {/* First container (takes half of the screen height) */}
      <View className="w-full h-1/2 bg-blue-500 justify-center items-center">
        <Text className="text-white">Top Container</Text>
      </View>

      {/* Second container (divided in half) */}
      <View className="w-full h-1/2 flex-row">
        {/* First half */}
        <View className="w-1/2 h-full bg-red-500 justify-center items-center">
          <Text className="text-white">Bottom Container - Top Half</Text>
        </View>

        {/* Second half */}
        <View className="w-1/2 h-full bg-green-500 justify-center items-center">
          <Text className="text-white">Bottom Container - Bottom Half</Text>
        </View>
      </View>
    </View>
  );
}
