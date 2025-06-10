import "./../styles/globals.css";
import ResponsiveHeader from "@/components/ResponsiveHeader";

export const metadata = {
  title: "FindPalco",
  description: "Connect Beyond Travel",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ResponsiveHeader />
        {children}
      </body>
    </html>
  );
}
