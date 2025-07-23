import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// TODO: Re-enable custom fonts when Next.js font import issues are resolved.

export const metadata: Metadata = {
  title: "BuildUnia - Learn IoT Through Hands-On Projects",
  description: "A Codeunia product - Build your future with IoT project kits and expert mentorship. Perfect for college students and tech enthusiasts.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={"antialiased min-h-screen flex flex-col !bg-black text-white"}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 !bg-black">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
