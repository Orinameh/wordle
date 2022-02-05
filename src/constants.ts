import { Dictionary } from "./types";

export const colors: Dictionary<string> = {
  black: "#121214",
  darkgrey: "#3A3A3D",
  grey: "#818384",
  lightgrey: "#D7DADC",
  primary: "#538D4E",
  secondary: "#B59F3B",
};

export const colorsToEmoji: Dictionary<string> = {
  [colors.darkgrey]: "⬛",
  [colors.primary]: "🟩",
  [colors.secondary]: "🟧",
};

export enum ACTION_KEY {
  ENTER = "ENTER",
  CLEAR = "CLEAR"
}

export const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  [ACTION_KEY.ENTER, "z", "x", "c", "v", "b", "n", "m", ACTION_KEY.CLEAR],
];