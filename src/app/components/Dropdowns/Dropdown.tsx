import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";

type DropdownProps<T extends { id: number }> = {
  items: T[];
  onSelect: (item: T) => void;
  selectedItem: number | null;
  placeholder: string;
  getItemKey: (item: T) => string | number; // Function to get the unique key
  getItemLabel: (item: T) => string;
  name: string; // Function to get the label for display
};

const Dropdown = <T extends unknown>({
  items,
  onSelect,
  selectedItem,
  placeholder = "Search...",
  getItemKey,
  getItemLabel,
  name,
}: DropdownProps<T>) => {
  const [searchText, setSearchText] = useState("");

  // Filter items based on search text
  const filteredItems = items.filter((item) =>
    getItemLabel(item).toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View className="border-red-400 border-2 p-5 max-w-md mx-auto w-56 m-5 h-80">
      <Text className="text-white text-xl mb-2">Select {name}</Text>

      {/* Search Input */}
      <TextInput
        className="border border-gray-500 rounded-md p-2 mb-4 text-white bg-gray-800"
        placeholder={placeholder}
        placeholderTextColor="gray"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Item List */}
      <ScrollView className="max-h-60 border border-gray-700 rounded-md">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Pressable
              key={getItemKey(item)}
              className="p-2"
              onPress={() => onSelect(item)}>
              <Text
                className={
                  selectedItem && selectedItem === getItemKey(item)
                    ? "text-yellow-400 font-bold"
                    : "text-white"
                }>
                {getItemLabel(item)}
              </Text>
            </Pressable>
          ))
        ) : (
          <Text className="text-gray-400 p-2">No results found</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Dropdown;
