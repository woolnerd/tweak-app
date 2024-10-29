import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const homeIcon = (color: string) => (
    <FontAwesome size={28} name="home" color={color} />
  );

  const patchIcon = () => (
    <Fontisto name="nav-icon-grid" size={24} color="black" />
  );

  const cogIcon = (color: string) => (
    <FontAwesome size={28} name="cog" color={color} />
  );

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => homeIcon(color),
        }}
      />
      <Tabs.Screen
        name="patch"
        options={{
          title: "Patch",
          tabBarIcon: ({ color }) => patchIcon(),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => cogIcon(color),
        }}
      />
    </Tabs>
  );
}
