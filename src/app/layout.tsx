import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import "@liveblocks/react-ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Task",
  description: "A team-based task management app built with Clerk Organizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
          <body className={`h-screen ${inter.className}`}>
            <Navbar />
            <div className="flex justify-center md:mx-0 h-full">
              <div className="flex flex-col w-full max-w-[960px] p-2">
                {children}
              </div>
            </div>
          </body>
      </html>
    </ClerkProvider>
  );
}
