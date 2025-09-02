import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeaTrip - Discover & Share Amazing Places",
  description: "Connect with travelers, discover amazing places, and share your travel experiences. Your social travel companion.",
  keywords: ["travel", "social media", "places", "photography", "adventure", "NeaTrip"],
  authors: [{ name: "NeaTrip Team" }],
  openGraph: {
    title: "NeaTrip - Social Travel App",
    description: "Discover amazing places and share your travel experiences with the community",
    url: "https://neatrip.com",
    siteName: "NeaTrip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeaTrip - Social Travel App",
    description: "Discover amazing places and share your travel experiences",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
