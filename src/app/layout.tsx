import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Music Bookmark",
  description: "Ứng dụng bookmark bài hát cho karaoke",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0abfc] relative`}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 10%, #a5b4fc55 0%, transparent 60%),
                            radial-gradient(circle at 80% 0%, #f0abfc44 0%, transparent 70%),
                            radial-gradient(circle at 50% 80%, #f472b655 0%, transparent 70%)`
        }}
      >
        {/* Art background pattern */}
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
