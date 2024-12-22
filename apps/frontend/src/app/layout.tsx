import type { Metadata } from "next";
import Context from "@/context/Context";
import "@mysten/dapp-kit/dist/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Walrus Wallpaper",
  description: "Walrus Wallpaper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Context>{children}</Context>
      </body>
    </html>
  );
}
