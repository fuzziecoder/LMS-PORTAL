import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GCLMS — Global Cloud Learning Management System",
  description: "Next-generation multi-tenant education platform for AI, Robotics, Coding, and Innovation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary-100 selection:text-primary-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-surface focus:text-primary-600 focus:shadow-elevated focus:rounded-md focus:m-2"
        >
          Skip to content
        </a>
        <main id="main-content">{children}</main>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
