import React from "react";
import { View, Text, Image, TouchableOpacity, Switch } from "react-native";
// import { styled } from "nativewind";

const UserSettings = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);

  const toggleSwitch = () => setIsEnabled(!isEnabled);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Profile Section */}
      <View className="bg-white p-4 items-center shadow-md">
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          className="w-24 h-24 rounded-full mb-4"
        />
        <Text className="text-lg font-bold text-gray-800">John Doe</Text>
        <Text className="text-sm text-gray-500">johndoe@example.com</Text>
        <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded-full">
          <Text className="text-white">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <View className="mt-6">
        {/* Notification Settings */}
        <View className="bg-white p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Notifications
          </Text>
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-gray-600">Push Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>

        {/* Account Settings */}
        <View className="bg-white p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">Account</Text>
          <TouchableOpacity className="py-2">
            <Text className="text-gray-600">Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text className="text-gray-600">Privacy Settings</Text>
          </TouchableOpacity>
        </View>

        {/* General Settings */}
        <View className="bg-white p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">General</Text>
          <TouchableOpacity className="py-2">
            <Text className="text-gray-600">Language</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text className="text-gray-600">About</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-2">
            <Text className="text-red-600">Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserSettings;
