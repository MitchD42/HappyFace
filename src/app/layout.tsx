import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HappyFace",
  description: "Dodge or catch projectiles from the happy face!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
