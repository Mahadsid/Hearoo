import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Hearoo🎧",
  description: "Hearoo is a CNN-based audio classifier and visualizer",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 8000, // 8 seconds
            style: {
              background: "#FFCCCB",
              color: "#111",
              padding: "16px",
              borderRadius: "12px",
              maxWidth: "400px",
            },
          }}
        />
      </body>
    </html>
  );
}
