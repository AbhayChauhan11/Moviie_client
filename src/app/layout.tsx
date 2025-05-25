import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TypeExProvider } from "@/context/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moveefy",
  description: "Movie syncing app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>  <TypeExProvider>{children}</TypeExProvider></body>
    </html>
  );
}
