import {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/components/theme-provider";
import ClientLayout from "@/components/client-layout";
import {SessionProvider} from "next-auth/react";
import {UserProvider} from "@/contexts/user-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spark",
  description: "Education application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <UserProvider>
            <ThemeProvider
              defaultTheme="system"
              storageKey="spark-theme"
            >
              <ClientLayout>
                {children}
              </ClientLayout>
              <Toaster/>
            </ThemeProvider>
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}