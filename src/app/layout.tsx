import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Job_Application",
  description: "For My Personal Project",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="">
        <SessionProvider>
          <div className="min-h-screen bg-cyan-600 py-2 md:py-4">
            <main className="container mx-auto px-4 py-4 space-y-4 md:space-y-8">
              <Navbar/>
              {children}
              </main>
          </div>
          <Toaster position="top-right"/>
        </SessionProvider>
      </body>
    </html>
  );
  
}
