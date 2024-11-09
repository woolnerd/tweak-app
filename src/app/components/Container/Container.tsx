import React, { ReactNode } from "react";
import { ScrollView, View, Dimensions, Platform } from "react-native";

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {
  const isIphone = () => {
    const { height, width } = Dimensions.get("window");
    return Platform.OS === "ios" && (height < 812 || width < 812);
  };

  return isIphone() ? (
    <ScrollView className="flex-1 flex flex-col space-y-4 m-auto bg-black p-5 border-4 border-yellow-500 w-full">
      {children}
    </ScrollView>
  ) : (
    <View className=" flex flex-row space-y-4 m-auto bg-black p-5 border-4 border-yellow-500 w-full">
      {children}
    </View>
  );
}

export default Container;
