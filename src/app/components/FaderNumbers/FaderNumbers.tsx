import React, { useEffect, useState } from "react";
import { Text } from "react-native";

type FaderNumberProps = {
  start: number;
  end: number;
  duration: number;
};

const FaderNumbers = ({ start, end, duration }: FaderNumberProps) => {
  const [displayValue, setDisplayValue] = useState(start);

  useEffect(() => {
    if (duration === 0) {
      setDisplayValue(end);
      return;
    }

    let animationFrameId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Use easeInOutQuad easing function for smoother animation
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - (-2 * progress + 2) ** 2 / 2;

      const currentValue = Math.round(start + (end - start) * easeProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // eslint-disable-next-line consistent-return
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [start, end, duration]);

  return <Text testID="fader-number">{displayValue}%</Text>;
};

export default FaderNumbers;
