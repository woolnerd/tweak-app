import React, { useState } from "react";
import { View, Text } from "react-native";
import Dropdown from "../Dropdown.tsx";

type Manufacturer = {
  id: number;
  name: string;
  notes: string;
  website: string;
};

type ManufacturerDropdownProps = {
  manufacturerSelection: number | null;
  handleManufacturerSelection: (m: number) => void;
  manufacturers: Manufacturer[];
};

const ManufacturerDropdown: React.FC<ManufacturerDropdownProps> = ({
  manufacturerSelection,
  handleManufacturerSelection,
  manufacturers,
}) => {
  const selectedManufacturer = manufacturers.find(
    (m) => m.id === manufacturerSelection,
  );
  return (
    <View>
      <Dropdown
        selectedItem={manufacturerSelection}
        onSelect={handleManufacturerSelection}
        items={manufacturers}
        getItemKey={(m: (typeof manufacturers)[number]) => m.id}
        placeholder="Select Manufacturer..."
        getItemLabel={(item: (typeof manufacturers)[number]) => item.name}
      />

      {selectedManufacturer && (
        <View className="mt-4 p-4 bg-gray-800 rounded-lg">
          <Text className="text-white text-lg font-bold">
            Selected Manufacturer: {selectedManufacturer.name}
          </Text>
          <Text className="text-white">
            Notes: {selectedManufacturer.notes}
          </Text>
          <Text className="text-white">
            Website: {selectedManufacturer.website}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ManufacturerDropdown;
