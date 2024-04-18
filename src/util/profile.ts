/**
 * Profile
 * this is where the dmxvalues are interpreted and routed to the appropriate channel.
 * A light fixture has an array of profiles.
 * The profile
 */
export default class Profile {}

const testProfile = {
  mode: "6",
  name: "CCT & RGBW, 16bit",
  channels: {
    1: "Dimmer",
    2: "Dimmer fine",
    3: "Color Temp",
    4: "Color Temp fine",
    5: "Green/Magenta Point",
    6: "Green/Magenta Point fine",
    7: "Crossfade color",
    8: "Crossfade color fine",
    9: "Red intensity",
    10: "Red intensity fine",
    11: "Green intensity",
    12: "Green intensity fine",
    13: "Blue intensity",
    14: "Blue intensity fine",
    15: "White intensity",
    16: "White intensity fine",
    17: "Fan control",
    18: "Preset",
    19: "Strobe",
    20: "Reserved for future use",
  },
};

const channelsJSON = {
  "1": "Dimmer",
  "2": "Dimmer fine",
  "3": "Color Temp",
  "4": "Color Temp fine",
  "5": "Green/Magenta Point",
  "6": "Green/Magenta Point fine",
  "7": "Crossfade color",
  "8": "Crossfade color fine",
  "9": "Red intensity",
  "10": "Red intensity fine",
  "11": "Green intensity",
  "12": "Green intensity fine",
  "13": "Blue intensity",
  "14": "Blue intensity fine",
  "15": "White intensity",
  "16": "White intensity fine",
  "17": "Fan control",
  "18": "Preset",
  "19": "Strobe",
  "20": "Reserved for future use",
};
