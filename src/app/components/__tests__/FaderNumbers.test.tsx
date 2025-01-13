/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/prefer-screen-queries */
import { render, act } from "@testing-library/react-native";
import React from "react";

import FaderNumbers from "../FaderNumbers/FaderNumbers.tsx";

describe("FaderNumbers", () => {
  let currentTime = 0;
  let animationFrame: number;
  const originalRAF = global.requestAnimationFrame;
  const originalDateNow = Date.now;

  beforeEach(() => {
    currentTime = 0;
    jest.useFakeTimers();

    global.Date.now = jest.fn(() => currentTime);

    global.requestAnimationFrame = (callback: FrameRequestCallback) => {
      animationFrame = setTimeout(() => {
        callback(Date.now());
      }, 16) as unknown as number;
      return animationFrame;
    };

    global.cancelAnimationFrame = (id: number) => {
      clearTimeout(id);
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    global.requestAnimationFrame = originalRAF;
    global.Date.now = originalDateNow;
  });

  const advanceAnimation = async (timeMs: number) => {
    await act(async () => {
      currentTime += timeMs;
      jest.advanceTimersByTime(timeMs);
    });
  };

  test("renders initial value correctly", () => {
    const { getByTestId } = render(
      <FaderNumbers start={0} end={100} duration={1000} />,
    );

    expect(getByTestId("fader-number").props.children.join("")).toBe(" 0");
  });

  test("handles zero duration", () => {
    const { getByTestId } = render(
      <FaderNumbers start={0} end={100} duration={0} />,
    );

    expect(getByTestId("fader-number").props.children.join("")).toBe(" 100");
  });

  test("animates from start to end", async () => {
    const { getByTestId } = render(
      <FaderNumbers start={0} end={100} duration={1000} />,
    );

    await advanceAnimation(500);
    const midValue = parseInt(
      getByTestId("fader-number").props.children.join(""),
      10,
    );
    expect(midValue).toBeGreaterThanOrEqual(45);
    expect(midValue).toBeLessThanOrEqual(55);

    await advanceAnimation(500);
    expect(getByTestId("fader-number").props.children.join("")).toBe(" 100");
  });

  test("handles decreasing values", async () => {
    const { getByTestId } = render(
      <FaderNumbers start={100} end={0} duration={1000} />,
    );

    await advanceAnimation(500);
    const midValue = parseInt(
      getByTestId("fader-number").props.children.join(""),
      10,
    );
    expect(midValue).toBeGreaterThanOrEqual(45);
    expect(midValue).toBeLessThanOrEqual(55);

    await advanceAnimation(500);
    expect(getByTestId("fader-number").props.children.join("")).toBe(" 0");
  });

  test("handles prop changes", async () => {
    const { getByTestId, rerender } = render(
      <FaderNumbers start={0} end={100} duration={1000} />,
    );

    await advanceAnimation(500);

    rerender(<FaderNumbers start={50} end={75} duration={1000} />);

    await advanceAnimation(1000);
    expect(getByTestId("fader-number").props.children.join("")).toBe(" 75");
  });

  test("cleans up animation frame on unmount", () => {
    const { unmount } = render(
      <FaderNumbers start={0} end={100} duration={1000} />,
    );

    const cancelAnimationFrameSpy = jest.spyOn(global, "cancelAnimationFrame");
    unmount();
    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    cancelAnimationFrameSpy.mockRestore();
  });
});
