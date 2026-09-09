import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xsu — Premium Tic-Tac-Toe",
  description:
    "A premium local two-player Tic-Tac-Toe studio with match history, analytics, timed play, and persistent player names.",
};

const themeBoot = `
try {
  var raw = localStorage.getItem("arena.v1");
  var theme = "dark";
  if (raw) {
    var parsed = JSON.parse(raw);
    if (parsed && parsed.settings && parsed.settings.theme === "light") theme = "light";
  }
  document.documentElement.dataset.theme = theme;
} catch (e) {
  document.documentElement.dataset.theme = "dark";
}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
