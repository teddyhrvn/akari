import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akari",
  description: "Découvrez, notez et partagez vos Anime et Manga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}