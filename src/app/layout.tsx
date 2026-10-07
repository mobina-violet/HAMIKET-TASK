import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeRegistry from "@/theme/ThemeRegistry";

const iranSans = localFont({
  src: "../fonts/A-Iranian-Sans/Iranian Sans.ttf",
  variable: "--font-iransans",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hamiket-task",
  description: "hamiket-task with Nextjs & mui",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className={iranSans.variable}>
      <body suppressHydrationWarning>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}