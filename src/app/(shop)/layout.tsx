import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Background3DCanvas from "@/components/Background3DCanvas";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { Suspense } from "react";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      {/* Full-page 3D Parallax & Water Falling Background */}
      <Background3DCanvas />

      {/* Website Content floating on top of 3D background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Suspense fallback={<div className="h-16 md:h-20 w-full bg-brand-950" />}>
          <Navbar />
        </Suspense>
        <CartDrawer />
        <main className="flex-grow pt-20 md:pt-24">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
