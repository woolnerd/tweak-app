import ProfileAdapter from "../profile-adapter.ts";

describe("ProfileAdapter", () => {
  let profileAdapter: ProfileAdapter;
  const profile = {
    1: "Dimmer",
    2: "Dimmer fine",
    3: "Color",
    4: "Color fine",
    5: "Gobo",
  };

  beforeEach(() => {
    profileAdapter = new ProfileAdapter("Dimmer", profile);
  });

  test("constructor initializes properties", () => {
    expect(profileAdapter.target).toBe("Dimmer");
    expect(profileAdapter.profile).toEqual(profile);
  });

  test("extractChannels throws error no match", () => {
    const wrongProfileAdapter = new ProfileAdapter("Fog", profile);
    expect(() => wrongProfileAdapter.extractChannels()).toThrow(
      "Did not find matching channel",
    );
  });

  test("extractChannels throws error too many matches", () => {
    const tooManyProfile = {
      1: "Dimmer ",
      2: "Dimmer fine",
      3: "Dimmer extra fine",
    };
    const wrongProfileAdapter = new ProfileAdapter("Dimmer", tooManyProfile);
    expect(() => wrongProfileAdapter.extractChannels()).toThrow(
      "Found too many possible channels",
    );
  });

  test("extractChannels returns correct channels", () => {
    const expectedChannels = [
      ["1", "Dimmer"],
      ["2", "Dimmer fine"],
    ];
    expect(profileAdapter.extractChannels()).toEqual(expectedChannels);

    const dualMatchAdapter = new ProfileAdapter("color", profile);
    const expectedDualChannels = [
      ["3", "Color"],
      ["4", "Color fine"],
    ];
    expect(dualMatchAdapter.extractChannels()).toEqual(expectedDualChannels);
  });
});
