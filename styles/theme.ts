export type ThemeName = "light" | "dark";

export interface AppTheme {
  name: ThemeName;
  bg: string;
  bgAccent: string;
  surface: string;
  surfaceRaised: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  x: string;
  xSoft: string;
  o: string;
  oSoft: string;
  win: string;
  winSoft: string;
  danger: string;
  dangerSoft: string;
  shadow: string;
  inset: string;
  overlay: string;
  grain: string;
}

export const darkTheme: AppTheme = {
  name: "dark",
  bg: "#0A0B0E",
  bgAccent: "#101218",
  surface: "#13151B",
  surfaceRaised: "#1A1D25",
  surfaceMuted: "#0E1014",
  border: "rgba(232, 226, 214, 0.08)",
  borderStrong: "rgba(196, 164, 106, 0.28)",
  text: "#EDE8DC",
  textMuted: "#9A9484",
  textFaint: "#6B665A",
  accent: "#C4A46A",
  accentSoft: "rgba(196, 164, 106, 0.12)",
  accentText: "#1A1710",
  x: "#A8C8EA",
  xSoft: "rgba(168, 200, 234, 0.16)",
  o: "#E7B1A4",
  oSoft: "rgba(231, 177, 164, 0.16)",
  win: "#C4A46A",
  winSoft: "rgba(196, 164, 106, 0.16)",
  danger: "#C97A6C",
  dangerSoft: "rgba(201, 122, 108, 0.12)",
  shadow: "0 24px 60px rgba(0, 0, 0, 0.38)",
  inset: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  overlay: "rgba(6, 7, 10, 0.62)",
  grain:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
};

export const lightTheme: AppTheme = {
  name: "light",
  bg: "#F5F1EA",
  bgAccent: "#EDE6D8",
  surface: "#FAF6EE",
  surfaceRaised: "#FFFDF8",
  surfaceMuted: "#EDE6DA",
  border: "rgba(28, 25, 20, 0.08)",
  borderStrong: "rgba(154, 123, 60, 0.28)",
  text: "#1C1914",
  textMuted: "#6B6456",
  textFaint: "#938A78",
  accent: "#B89A6A",
  accentSoft: "rgba(184, 154, 106, 0.28)",
  accentText: "#FFF8E8",
  x: "#5C7AB8",
  xSoft: "rgba(92, 122, 184, 0.22)",
  o: "#B85C5C",
  oSoft: "rgba(184, 92, 92, 0.22)",
  win: "#8B6914",
  winSoft: "rgba(139, 105, 20, 0.12)",
  danger: "#A24B3A",
  dangerSoft: "rgba(162, 75, 58, 0.1)",
  shadow: "0 18px 40px rgba(48, 38, 20, 0.08)",
  inset: "inset 0 1px 0 rgba(255, 255, 255, 0.7)",
  overlay: "rgba(28, 25, 20, 0.38)",
  grain:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
};

export const themes = {
  dark: darkTheme,
  light: lightTheme,
};
