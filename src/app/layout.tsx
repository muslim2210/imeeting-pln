'use client';
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/SideBar";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import PrivateRouteMiddleware from "@/components/auth/PrivateRouteMiddleware";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noLayoutPaths = ["/auth/login", "/auth/register"];
  const hideLayout = noLayoutPaths.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {hideLayout ? (
          <>{children}</>
        ) : (
          <PrivateRouteMiddleware requiredRole="USER">
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main>{children}</main>
              </div>
            </div>
          </PrivateRouteMiddleware>
        )}
        <Toaster position="top-center" richColors/>
      </body>
    </html>
  );
}
