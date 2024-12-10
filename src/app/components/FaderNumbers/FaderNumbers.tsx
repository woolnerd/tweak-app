import React, { useRef, useEffect, useState } from "react";
import { View, Text } from "react-native";

type FaderNumberProps = {
  start: number;
  end: number;
  duration: number;
};

const FaderNumbers = ({ start, end, duration }: FaderNumberProps) => {
  const currentValueRef = useRef(start);
  const [displayValue, setDisplayValue] = useState(start); // To trigger re-renders

  useEffect(() => {
    const steps = 100; // Number of steps for smooth transition
    const intervalTime = duration / steps; // Time per step
    const increment = (end - start) / steps; // Value increment per step

    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      currentValueRef.current += increment;

      // Update state for UI
      setDisplayValue(Math.round(currentValueRef.current));

      if (stepCount >= steps) {
        clearInterval(timer); // Stop when steps are complete
        currentValueRef.current = end; // Ensure the final value is precise
        setDisplayValue(end); // Final UI update
      }
    }, intervalTime);

    return () => {
      clearInterval(timer); // Clean up timer on component unmount
    };
  }, [start, end, duration]);

  return (
    <View>
      <Text>Value: {displayValue}%</Text>
    </View>
  );
};

export default FaderNumbers;
