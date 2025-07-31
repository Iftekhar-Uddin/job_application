import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/providers/SessionProvider";
import { auth } from "../../auth";


export const metadata: Metadata = {
  title: "Job_Application",
  description: "For My Personal Project",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();

  return (
    <html lang="en">
      <body className="">
        <SessionProvider session={session}>
          <div className="min-h-screen bg-cyan-600 py-8">
            <Navbar />
            <main className="container mx-auto px-4 py-4">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
