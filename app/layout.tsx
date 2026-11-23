import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import InstagramPopup from "./components/InstagramPopup";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import { ClerkProvider } from "@clerk/nextjs";
import { CurrencyProvider } from "@/app/context/CurrencyContext";

export const metadata: Metadata = {
  title: "Evolution Body by Andrej Angjeleski | Training & Nutrition",
  description:
    "Evolution Body by Coach Andrej Angjeleski — Structured workout programs (2x, 3x, 4x/week), Bulking & Cutting nutrition plans, and 1-on-1 online coaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-white text-zinc-950 antialiased flex flex-col min-h-screen overflow-x-clip selection:bg-red-700 selection:text-white">
          <CurrencyProvider>
            <CartProvider>
              <Navbar />
              <InstagramPopup />
              <div className="flex-grow">{children}</div>
              <Footer />
              <CartDrawer />
            </CartProvider>
          </CurrencyProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}