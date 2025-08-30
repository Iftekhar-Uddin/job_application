import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";

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
          <div className="min-h-screen bg-cyan-600 py-8">
            <Navbar />
            <main className="container mx-auto px-4 py-4">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
  
}
