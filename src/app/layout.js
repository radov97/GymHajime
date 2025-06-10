import "./../styles/globals.css";
import ResponsiveHeader from "@/components/ResponsiveHeader";

export const metadata = {
  title: "FindPalco",
  description: "Connect Beyond Travel",
  icons: {
    icon: "/favicon-palco.png",
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
